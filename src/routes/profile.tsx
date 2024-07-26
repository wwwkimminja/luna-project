
import { styled } from "styled-components";
import { auth, storage } from "../firebase";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import { FirebaseError } from "firebase/app";
import { Error } from "../components/auth-components";
import { IconAvatarPlaceholder } from "../assets/Icons";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #7e8183;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 80px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

type ProfileForm = {
  image?: FileList
}

function Profile() {

  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [error, setError] = useState<string | null>(null);

  const { register } = useForm<ProfileForm>({
    defaultValues: {
      image: undefined
    }

  })
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!user) return;
    try {

      if (files && files.length === 1) {
        const file = files[0];
        const locationRef = ref(storage, `users/${user?.uid}`);
        const result = await uploadBytes(locationRef, file);
        const avatarUrl = await getDownloadURL(result.ref);
        setAvatar(avatarUrl);
        await updateProfile(user, {
          photoURL: avatarUrl,
        });
      }
    } catch (e) {
      if (e instanceof FirebaseError)
        setError(e.message);
    }

  }


  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <IconAvatarPlaceholder />
        )}
      </AvatarUpload>
      <AvatarInput
        {...register("image")}
        onChange={onAvatarChange}
        type="file"
        id="avatar"
        accept="image/*"
      />
      {error ? <Error>{error}</Error> : null}
      <Name>{user?.displayName ?? "Anonymous"}</Name>
    </Wrapper>
  );
}

export default Profile;
