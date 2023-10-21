"use client"

import React, { Suspense, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithRedirect,
    FacebookAuthProvider
} from "firebase/auth";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import LoginComponent from "../../components/Login";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

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
            toast.error((error.message).split(":")[1]);
        }
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithRedirect(auth, G_Provider)
        } catch (error) {
            console.log(error);
        }
    }

    const signInWithFacebook = async () => {
        try {
            await signInWithRedirect(auth, F_Provider)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Suspense fallback={<Loader />}>
            <LoginComponent userDetails={userDetails} setuserDetails={setuserDetails} signInWithGoogle={signInWithGoogle} signInWithFacebook={signInWithFacebook} handleSubmit={handleSubmit} />
        </Suspense>
    );
};

export default Login;
