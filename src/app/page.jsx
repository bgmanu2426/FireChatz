"use client"

import { useAuth } from "../contexts/authContext";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import LeftNavComponent from "../components/LeftNav";
import UserChatsListComponent from "@/components/UserChatsList";
import ChatComponent from "@/components/Chat";
import { useChatContext } from "@/contexts/chatContext";

const Home = () => {
  const router = useRouter();
  const { signOut, currentUser, isLoading } = useAuth();
  const { data } = useChatContext();

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
            <div className="w-[400px] p-5 overflow-auto scrollbar shrink-0 border-r border-white/[0.05]">
              <div className="flex flex-col h-full">
                <UserChatsListComponent />
              </div>
            </div>
            {data.user && <ChatComponent />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;