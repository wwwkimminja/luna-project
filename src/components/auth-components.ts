import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  width: 420px;
  padding: 50px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 36px;
`;

export const Form = styled.form`
  width: 100%;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
`;
export const StyledInput = styled.input`
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
`;

export const RadioWrapper = styled.div`
  display: flex;
  padding: 10px 10px;
  label {
    padding-left: 10px;
    width: 30px;
  }
`;

export const CheckBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 20px;
  a {
    color: white;
  }
  input[type="checkbox"] {
    accent-color: rgb(200, 108, 236);
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  font-size: 16px;
  margin-top: 20px;
  transition: all 0.5s ease;

  &:hover {
    cursor: pointer;
    background-color: rgb(200, 108, 236);
  }
`;
export const Error = styled.span`
font-size: 14px;
  font-weight: 600;
  color:  rgb(192, 57, 43);
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: rgb(200, 108, 236);
  }
`;

export const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #9b59b6;
  text-align: center;
  border-radius: 20px;
  border: 1px solid#9b59b6;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export const AttachFileInput = styled.input`
  display: none;
`;
