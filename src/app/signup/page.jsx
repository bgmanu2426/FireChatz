"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation"
import SignupComponent from "@/components/Signup";

const Signup = () => {
    const router = useRouter();

    const [userDetails, setUserDetails] = useState({
        username: "",
        email: "",
        password: ""
    });


    return (
        <>
            <SignupComponent userDetails={userDetails} setUserDetails={setUserDetails} />
        </>
    );
};

export default Signup;
