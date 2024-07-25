import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  FieldError,
  Path,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { auth, db, storage } from "../firebase";
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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, updateDoc } from "firebase/firestore";

type FormValues = {
  name: string;
  email: string;
  password: string;
  birthday?: Date;
  gender?: "female" | "male";
  female: boolean;
  male: boolean;
  agreement: boolean;
  profileImage?: FileList;
};

type InputProps = {
  name: Path<FormValues>;
  register: UseFormRegister<FormValues>;
  error?: FieldError;
  required?: string;
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
    <StyledInput id={name} type={type} {...register(name, { required})} />
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
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      birthday: undefined,
      gender: undefined,
      agreement: false,
      profileImage: undefined,
    },
  });

  const file = watch("profileImage");
  console.log(file,errors)
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { name, email, password, birthday, gender, agreement, profileImage } =
      data;
    setError(null);
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const doc = await addDoc(collection(db, "users"), {
        name,
        birthday,
        gender,
        agreement,
        createAt: Date.now(),
        userId: credentials.user.uid,
      });

      let url;
      if (profileImage && profileImage.length === 1) {
        const locationRef = ref(
          storage,
          `users/${credentials.user.uid}-${name}`,
        );
        const result = await uploadBytes(locationRef, profileImage[0]);
        url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photoUrl: url,
        });
      }
      await updateProfile(credentials.user, {
        displayName: name,
        photoURL:url
      });
      navigate("/");
      reset();
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
        <Input name="name" register={register} required="入力してください" error={errors.name}/>
        <Input name="email" register={register} required="入力してください." type="email" error={errors.email}/>
        <Input name="password" register={register} required="入力してください" type="password" error={errors.password}/>

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
          {file?.length ? "Photo added 💜" : "Add photo"}
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
            required="チェックをしてください"
            label="同意します"
            error={errors.agreement}
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
