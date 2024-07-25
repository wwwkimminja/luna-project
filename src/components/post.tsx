import { styled } from "styled-components";
import { PostType } from "./timeline";
import { auth, db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";

const Wrapper = styled.div`
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
  margin-right: 5px;
  +span{
    font-size: 12px;
  }
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
 
`;
const DeleteButton = styled.button`
  background-color: rgb(192, 57, 43);
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

function Post({ id,userId, username, post, createAt }: PostType) {
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("削除します。よろしいですか?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (e) {
      console.log(e);
    } 
  };
  const date = new Date(createAt).getFullYear() + "." + (new Date(createAt).getMonth()+1) + "." + new Date(createAt).getDate()
  console.log(post.length)
  return (
    <Wrapper>
      <div>
        <Username>{username}</Username> <span>{date}</span>
        <Payload>{post}</Payload>
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ):null}
      </div>
    </Wrapper>
  );
}

export default Post;
