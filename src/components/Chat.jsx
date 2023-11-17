import React from "react";
import ChatHeaderComponent from "./ChatHeader";
import MessagesComponent from "./Messages";
import { useChatContext } from "@/contexts/chatContext";
import ChatFooterComponent from "./ChatFooter";

const ChatComponent = () => {
    const { data } = useChatContext();

    return (
        <div className="flex flex-col p-5 grow">
            <ChatHeaderComponent />
            {data.chatId && <MessagesComponent />}
            <ChatFooterComponent />
        </div>
    )
};

export default ChatComponent;
