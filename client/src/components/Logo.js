import logo from "../assets/images/logo.svg";
import styled from "styled-components";

const Logo = () => {
  return (
    <Wrapper>
      <img src={logo} alt="tasker" className="logo" />
      <span>Tasker</span>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    height: 80px;
    margin: 0;
    padding: 0;
  }
  span {
    font-size: 2rem;
    color: var(--primary-500);
  }
`;

export default Logo;
