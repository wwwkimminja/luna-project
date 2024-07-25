import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { styled } from "styled-components";
import { db } from "../firebase";
import Post from "./post";
import { Unsubscribe } from "firebase/auth";

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export type PostType = {
  id: string;
  post: string;
  userId: string;
  username: string;
  createAt: number;
};
function Timeline() {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      const postQuery = query(
        collection(db, "posts"),
        orderBy("createAt", "desc"),
        limit(30),
      );

      unsubscribe = await onSnapshot(postQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const { post, userId, username, createAt } = doc.data();
          return {
            id: doc.id,
            post,
            userId,
            username,
            createAt,
          };
        });
        setPosts(posts);
      });
    };

    fetchPosts();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>{posts?.map((post) => <Post key={post.id} {...post} />)}</Wrapper>
  );
}

export default Timeline;
