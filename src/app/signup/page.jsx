"use client"

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/authContext";
import { auth, db } from "../../firebase/firebase";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider,
    updateProfile,
    sendEmailVerification
} from "firebase/auth";
import SignupComponent from "../../components/Signup";
import { doc, setDoc } from "firebase/firestore";
import { profileColors } from "../../utils/constants";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";


const G_Provider = new GoogleAuthProvider();
const F_Provider = new FacebookAuthProvider();

const Signup = () => {
    const router = useRouter();
    const { currentUser, isLoading } = useAuth();

    const [userDetails, setUserDetails] = useState({
        username: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        if (!isLoading && currentUser) {
            router.push("/");
        }
    }, [currentUser, isLoading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password } = userDetails;
        const colorIndex = Math.floor(Math.random() * profileColors.length);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            console.log(user);
            await updateProfile(user, {
                displayName: username, photoURL: "https://w7.pngwing.com/pngs/419/473/png-transparent-computer-icons-user-profile-login-user-heroes-sphere-black-thumbnail.png"
            })
            await sendEmailVerification(user);
            await setDoc(doc(db, "users", user.uid), {
                username,
                email,
                userId: user.uid,
                color: profileColors[colorIndex]
            })
            await setDoc(doc(db, "userChats", user.uid), {})
        } catch (error) {
            toast.error((error.message).split(":")[1]);
        }
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, G_Provider)
        } catch (error) {
            console.log(error);
        }
    }

    const signInWithFacebook = async () => {
        try {
            await signInWithPopup(auth, F_Provider)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Suspense fallback={<Loader />}>
            <SignupComponent userDetails={userDetails} setUserDetails={setUserDetails} signInWithGoogle={signInWithGoogle} signInWithFacebook={signInWithFacebook} handleSubmit={handleSubmit} />
        </Suspense>
    );
};

export default Signup;
