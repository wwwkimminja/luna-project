import { Link, Outlet, useNavigate } from "react-router-dom";
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

const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  svg {
    width: 30px;
    fill: white;
  }
  &.log-out {
    border-color: #9d47ff;
    svg {
      fill: #9d47ff;
    }
  }
`;

function LayOut() {
  const navigate = useNavigate();
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
          <MenuItem>
            <IconHome />
          </MenuItem>
        </Link>

        <Link to="/profile">
          <MenuItem>
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
