import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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
import {
  AttachFileButton,
  AttachFileInput,
  Button,
  CheckBoxWrapper,
  Container,
  Error,
  Form,
  RadioWrapper,
  StyledInput,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import { LABEL } from "../constants/auth";

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
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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

  const file = watch("profileImage");
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError(null);
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
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
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

        <span>{LABEL.profileImage}</span>
        <AttachFileButton htmlFor="file">
          {file ? "Photo added 💜" : "Add photo"}
        </AttachFileButton>
        <AttachFileInput
          {...register("profileImage")}
          type="file"
          id="file"
          accept="image/*"
        />
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
        {error ? <Error>{error}</Error> : null}

        <Button type="submit">{isLoading ? "Loading..." : "登録"}</Button>
      </Form>
      <Switcher>
        Already have an account ? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
    </Container>
  );
}
export default CreateAccount;
