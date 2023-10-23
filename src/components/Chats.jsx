import { useChatContext } from "@/contexts/chatContext";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect } from "react";

const ChatsComponent = () => {
    const { users, setUsers } = useChatContext();

    useEffect(() => {
        onSnapshot(collection(db, "users"),
            (snapshot) => {
                const updatedUsers = {}
                snapshot.forEach((doc) => {
                    updatedUsers[doc.id] = doc.data(); 
                });
                setUsers(updatedUsers);
            });
    }, [setUsers]);

    return (
        <div>Chats</div>
    )
};

export default ChatsComponent;
