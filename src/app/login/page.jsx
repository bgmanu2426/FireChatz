"use client"

import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/firebase";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider
} from "firebase/auth";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import LoginComponent from "@/components/Login";

const G_Provider = new GoogleAuthProvider();
const F_Provider = new FacebookAuthProvider();

const Login = () => {
    const router = useRouter();
    const { currentUser, isLoading } = useAuth();

    const [userDetails, setuserDetails] = useState({
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
        const { email, password } = userDetails;
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.log(error);
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

    return isLoading || (!isLoading && currentUser) ? "Loader..." : (
        <LoginComponent userDetails={userDetails} setuserDetails={setuserDetails} signInWithGoogle={signInWithGoogle} signInWithFacebook={signInWithFacebook} handleSubmit={handleSubmit} />
    );
};

export default Login;
