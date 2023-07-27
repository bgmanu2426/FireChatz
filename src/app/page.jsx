"use client"

import { useAuth } from "@/context/authContext";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import LeftNavComponent from "@/components/LeftNav";

const Home = () => {
  const router = useRouter();
  const { signOut, currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);

  return !currentUser ? <Loader /> : (
    <>
      <div className="bg-c1 flex h-[100vh]">
        <div className="flex w-full shrink-0">
          <LeftNavComponent />

          <div className="flex bg-c2 grow">
            <div>Sidebar</div>
            <div>Chat</div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Home;