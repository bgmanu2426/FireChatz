"use client"

import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io"
import { BsArrowRight } from "react-icons/bs"
import Link from "next/link";

const LoginComponent = (props) => {
    const { userDetails, setuserDetails, handleSubmit, signInWithGoogle, signInWithFacebook } = props
    return (
        <div className="h-[100vh] flex items-center justify-center bg-c1">
            <div className="flex items-center flex-col">
                <div className="text-center">
                    <div className="text-4xl font-bold">
                        Login to Your Account
                    </div>
                    <div className="mt-3 text-c3">
                        Connect and chat with anyone around the world from anywhere
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full mt-10 mb-5">
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]">
                        <div className="flex items-center justify-center gap-3 font-semibold text-white bg-c1 w-full h-full rounded-md" onClick={signInWithGoogle}>
                            <IoLogoGoogle size={24} />
                            <span>Login with Google</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]">
                        <div className="flex items-center justify-center gap-3 font-semibold text-white bg-c1 w-full h-full rounded-md" onClick={signInWithFacebook}>
                            <IoLogoFacebook size={24} />
                            <span>Login with Facebook</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <span className="w-5 h-[1px] bg-c3"></span>
                    <span className="text-c3 font-semibold">OR</span>
                    <span className="w-5 h-[1px] bg-c3"></span>
                </div>

                <form className="flex flex-col items-center gap-3 w-[500px] mt-5" onSubmit={handleSubmit}>
                    <input
                        className="w-full bg-c5 h-12 rounded-xl outline-none border-none text-c3 px-5"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={userDetails.email}
                        onChange={(e) => {
                            setuserDetails({ ...userDetails, email: e.target.value })
                        }}
                    />
                    <input
                        className="w-full bg-c5 h-12 rounded-xl outline-none border-none text-c3 px-5"
                        type="password"
                        name="password"
                        autoComplete="off"
                        placeholder="Password"
                        value={userDetails.password}
                        onChange={(e) => {
                            setuserDetails({ ...userDetails, password: e.target.value })
                        }}
                    />
                    <div className="text-right w-full text-c3">
                        <Link href={"/resetPassword"} >Forgot Password?</Link>
                    </div>
                    <button className="flex items-center justify-center mt-4 w-full h-12 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Login to Your Account<BsArrowRight className="mx-3" /></button>
                </form>

                <div className="flex justify-center gap-1 text-c3 mt-5">
                    <span>Don&apos;t have an account?</span>
                    <Link href={"/signup"} className="font-semibold text-white underline underline-offset-2 cursor-pointer">Register Now</Link>
                </div>

            </div>
        </div>
    )
};

export default LoginComponent;
