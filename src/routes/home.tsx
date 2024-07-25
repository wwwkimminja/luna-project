import styled from "styled-components";
import PostForm from "../components/post-form";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;

function Home() {
  return (
    <Wrapper>
      <PostForm />
      <Timeline />
    </Wrapper>
  );
}
export default Home;
