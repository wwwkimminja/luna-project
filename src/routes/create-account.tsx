import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import {
  FieldError,
  Path,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  height: 100%;
  width: 420px;
  padding: 50px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 36px;
`;

const Form = styled.form`
  width: 100%;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
`;
const StyledInput = styled.input`
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
`;

const RadioWrapper = styled.div`
  display: flex;
  padding: 10px 10px;
  label {
    padding-left: 10px;
    width: 30px;
  }
`;

const CheckBoxWrapper = styled.div`
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
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  font-size: 16px;
  margin-top: 50px;
  transition: all 0.5s ease;

  &:hover {
    cursor: pointer;
    background-color: rgb(200, 108, 236);
  }
`;
const Error = styled.span`
  font-weight: 600;
  color: red;
`;

type FormValues = {
  name: string;
  email: string;
  password: string;
  birthday?: Date;
  gender?: "female" | "male";
  female: boolean;
  male: boolean;
  agreement: boolean;
  profileImage?: string;
};

const LABEL = {
  name: "ユーザー名",
  email: "メールアドレス",
  password: "パスワード",
  birthday: "誕生日",
  gender: "性別",
  female: "女",
  male: "男",
  agreement: "利用規約への同意",
  profileImage: "プロフィールアイコン",
} as const;

type InputProps = {
  name: Path<FormValues>;
  register: UseFormRegister<FormValues>;
  error?: FieldError;
  required?: boolean;
};
type RadioInputProps = {
  label: string;
  value?: string;
} & InputProps;

type CheckBoxProps = {
  children: React.ReactNode;
  label: string;
} & InputProps;

const Input = ({
  name,
  register,
  required,
  error,
  type,
}: InputProps & {
  type?: string;
}) => (
  <Wrapper>
    <label htmlFor={name}>{LABEL[name]}</label>
    <StyledInput id={name} type={type} {...register(name, { required })} />
    {error ? <Error>{error.message}</Error> : null}
  </Wrapper>
);

const RadioInput = ({ name, label, value, register }: RadioInputProps) => {
  return (
    <RadioWrapper>
      <input id={value} type="radio" value={value} {...register(name)} />
      <label htmlFor={value}> {label}</label>
    </RadioWrapper>
  );
};

const CheckBox = ({
  name,
  label,
  required,
  error,
  register,
  children,
}: CheckBoxProps) => {
  return (
    <CheckBoxWrapper>
      {children}
      <div>
        <input id={name} type="checkbox" {...register(name, { required })} />
        <label htmlFor={name}>{label}</label>
      </div>
      {error ? <Error>{error.message}</Error> : null}
    </CheckBoxWrapper>
  );
};

function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      birthday: undefined,
      gender: undefined,
      agreement: false,
      profileImage: "",
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      await updateProfile(credentials.user, {
        displayName: data.name,
      });
      navigate("/");
    } catch (e) {
      //setError
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>新規会員登録</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input name="name" register={register} required />
        <Input name="email" register={register} required type="email" />
        <Input name="password" register={register} required type="password" />

        <fieldset>
          <legend>{LABEL.gender}</legend>
          <RadioInput
            name="gender"
            register={register}
            value="male"
            label={LABEL.male}
          />
          <RadioInput
            name="gender"
            register={register}
            value="female"
            label={LABEL.female}
          />
          {errors.gender ? <Error>{errors.gender.message}</Error> : null}
        </fieldset>

        <Input name="profileImage" register={register} type="file" />
        <Input name="birthday" register={register} type="date" />

        <fieldset>
          <legend>{LABEL.agreement}</legend>
          <CheckBox
            name="agreement"
            register={register}
            required
            label="同意します"
          >
            <a
              href="https://luna-matching.notion.site/a714620bbd8740d1ac98f2326fbd0bbc"
              target="_blank"
            >
              利用契約
            </a>
          </CheckBox>
        </fieldset>

        <Button type="submit">{isLoading ? "Loading..." : "登録"}</Button>
      </Form>
    </Container>
  );
}
export default CreateAccount;
