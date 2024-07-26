import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { IconHome, IconLogOut, IconProfile } from "../assets/Icons";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  grid-template-columns: 1fr 4fr;
  height: 100vh;
  padding: 50px 0px;
  width: 100%;
  max-width: 860px;
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MenuItem = styled.div<{ active?: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${(props) => (props.active ? " #ab5bcb" : "white")};
  opacity: ${(props) => (props.active ? 1 : 0.7)};
  height: 50px;
  width: 50px;
  border-radius: 50%;
  svg {
    width: 30px;
    fill: ${(props) => (props.active ? " #ab5bcb" : "white")};
  }
  &:hover {
    opacity: 1;
  }
`;

function LayOut() {
  const navigate = useNavigate();
  const currentPage = useLocation().pathname;
  const onLogOut = async () => {
    const ok = confirm("ログアウトします。よろしいですか?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };

  return (
    <Wrapper>
      <Menu>
        <Link to="/">
          <MenuItem active={currentPage === "/"}>
            <IconHome />
          </MenuItem>
        </Link>

        <Link to="/profile">
          <MenuItem active={currentPage === "/profile"}>
            <IconProfile />
          </MenuItem>
        </Link>

        <MenuItem onClick={onLogOut} className="log-out">
          <IconLogOut />
        </MenuItem>
      </Menu>
      <Outlet />
    </Wrapper>
  );
}
export default LayOut;
