import React from "react";
import ChatHeaderComponent from "./ChatHeader";
import MessagesComponent from "./Messages";
import { useChatContext } from "@/contexts/chatContext";
import ChatFooterComponent from "./ChatFooter";
import { useAuth } from "@/contexts/authContext";

const ChatComponent = () => {
    const { currentUser } = useAuth();
    const { data, users } = useChatContext();

    const isUserBlocked = users[currentUser?.userId]?.blockedUsers?.find(u => u === data?.user?.userId)
    const IamBlocked = users[data?.user?.userId]?.blockedUsers?.find(u => u === currentUser?.userId)

    return (
        <div className="flex flex-col p-5 grow">
            <ChatHeaderComponent />
            {data.chatId && <MessagesComponent />}
            {!isUserBlocked && !IamBlocked && <ChatFooterComponent />}
            {isUserBlocked && <div className="w-full text-center text-c3 py-5">This user has been blocked</div>}
            {IamBlocked && <div className="w-full text-center text-c3 py-5">{`${data?.user?.username} has blocked you!`}</div>}
        </div>
    )
};

export default ChatComponent;
