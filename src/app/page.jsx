"use client"

import { useAuth } from "@/context/authContext";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const { signOut, currentUser, isLoading } = useAuth();

  useEffect(() => {
    if(!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);
  
  return (
    <>
      <button className="text-black" onClick={signOut}>Logout</button>
    </>
  );
};

export default Home;