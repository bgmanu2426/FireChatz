"use client"

import React from "react";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs"

const ResetPasswordComponent = (props) => {
    const { resetPassword, userEmail, setUserEmail } = props;
    return (
        <>
            <div className="h-screen flex items-center justify-center bg-c1">
                <div className="flex items-center flex-col">
                    <div className="text-center">
                        <div className="text-4xl font-bold">
                            Reset Password
                        </div>
                        <div className="mt-3 text-c3">
                            Connect and chat with anyone around the world from anywhere
                        </div>
                    </div>

                    <form className="flex flex-col items-center gap-3 w-[500px] mt-10" onSubmit={resetPassword}>
                        <input
                            className="w-full bg-c5 h-12 rounded-xl outline-none border-none text-c3 px-5"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={userEmail}
                            onChange={(e) => {
                                setUserEmail(e.target.value)
                            }}
                        />
                        <button className="flex items-center justify-center mt-4 w-full h-12 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Reset Password<BsArrowRight className="mx-3" /></button>
                    </form>

                    <div className="flex justify-center gap-1 text-c3 mt-5">
                        <span>Already have an account?</span>
                        <Link href={"/login"} className="font-semibold text-white underline underline-offset-2 cursor-pointer">Login</Link>
                    </div>
                </div>
            </div>
        </>
    )
};

export default ResetPasswordComponent;
