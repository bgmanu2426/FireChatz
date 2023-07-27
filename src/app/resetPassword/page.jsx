"use client"

import ResetPasswordComponent from "@/components/ResetPassword";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/authContext";

const ResetPassword = () => {
    const { currentUser, isLoading } = useAuth();

    const [userEmail, setUserEmail] = useState("");

    const resetPassword = async (e) => {
        e.preventDefault();
        try {
            toast.promise(async () => {
                await sendPasswordResetEmail(auth, userEmail)
            }, {
                pending: "Generating Reset Link",
                success: "Password reset link has been sent to your registered email",
                error: "You have entered an invalid email"
            }, {
                autoClose: 5000
            })
        } catch (error) {
            console.log(error);
        }
    }
    return isLoading || (!isLoading && currentUser) ? <Loader/> : (
        <>
            <ResetPasswordComponent resetPassword={resetPassword} userEmail={userEmail} setUserEmail={setUserEmail} />
        </>
    )
};

export default ResetPassword;
