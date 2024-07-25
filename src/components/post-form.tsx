import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { styled } from "styled-components";
import { auth, db } from "../firebase";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #9b59b6;
  }
`;

const SubmitBtn = styled.input`
  background-color: #9b59b6;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

type FormValue = {
  post: string;
};

function PostForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: { post: "" },
  });
  const onSubmit: SubmitHandler<FormValue> = async ({ post }) => {
    const user = auth.currentUser;
    if (!user || isLoading || post.trim() === "" || post.trim().length > 140)
      return;
    try {
      setIsLoading(true);
      await addDoc(collection(db, "posts"), {
        post,
        createAt: Date.now(),
        username: user.displayName || "anonymous",
        userId: user.uid,
      });
      //
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        {...register("post", { required: true })}
        rows={3}
        maxLength={140}
        placeholder="What is happening?!"
      />
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post "} />
    </Form>
  );
}

export default PostForm;
