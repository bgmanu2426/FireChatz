import { useChatContext } from "@/contexts/chatContext";
import { db } from "@/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import UserMessageComponent from "./UserMessage";
import { useAuth } from "@/contexts/authContext";

const MessagesComponent = () => {
    const { data } = useChatContext();
    const { currentUser } = useAuth();

    const [messages, setMessages] = useState([]);
    const ref = useRef()

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "chats", data.chatId),
            (doc) => {
                if (doc.exists()) {
                    setMessages(doc.data().messages);
                }
            });
        return () => unsub();
    }, [data.chatId]);

    return (
        <div
            ref={ref}
            className="grow p-5 overflow-auto scrollbar flex flex-col"
        >
            {messages?.filter((m) => {
                return m?.deletedInfo?.[currentUser.userId] !== "DELETED_FOR_ME" && !m?.deletedInfo?.deletedForEveryone
            })?.map((msg) => {
                return (
                    <UserMessageComponent key={msg.id} msg={msg} />
                )
            })}

        </div>
    );
};

export default MessagesComponent;