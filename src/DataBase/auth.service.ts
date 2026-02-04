import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "./fireBase";

export const signupUser = async (
  userName: string,
  email: string,
  password: string 
) => { 
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await set(ref(database, `users/${userCredential.user.uid}`), {
    userName,
    email,
    createdAt: new Date().toISOString(),
  });
};

export const loginUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);
