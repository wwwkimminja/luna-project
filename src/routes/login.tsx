import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  FieldError,
  Path,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Button, Container, Error, Form, StyledInput, Switcher, Title, Wrapper } from "../components/auth-components";
import { LABEL } from "../constants/auth";


type FormValues = {
  email: string;
  password: string;
};

type InputProps = {
  name: Path<FormValues>;
  register: UseFormRegister<FormValues>;
  error?: FieldError;
  required?: boolean;
};

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


function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError]=useState<string|null>(null)
  const {
    register,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: ""
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError(null)
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth,data.email,data.password)
      navigate("/");
    } catch (e) {
      if(e instanceof FirebaseError){
        setError(e.message)
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Luna</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input name="email" register={register} required type="email" />
        <Input name="password" register={register} required type="password" />
        {error ? <Error>{error}</Error> : null}
        <Button type="submit">{isLoading ? "Loading..." : "ログイン"}</Button>
      </Form>
      <Switcher>
      Don't have an account ?<Link to="/create-account">Create on &rarr;</Link>
      </Switcher>
    </Container>
  );
} 
export default Login;

