import { useChatContext } from "@/contexts/chatContext";
import { db } from "@/firebase/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import AvatarComponent from "./Avatar";
import { useAuth } from "@/contexts/authContext";

const ChatsComponent = () => {
    const [search, setSearch] = useState("");

    const { users, setUsers, chats, setChats, selectedChat, setSelectedChat } = useChatContext();

    const { currentUser } = useAuth();

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

    useEffect(() => {
        const getChats = () => {
            onSnapshot(doc(db, "userChats", currentUser.userId), (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setChats(data);
                }
            });
        }

        currentUser.userId && getChats()
    }, [setChats]);

    return (
        <div className="flex flex-col h-full">
            <div className="shrink-0 sticky -top-[20px] z-10 flex justify-center w-full bg-c2 py-5">
                <RiSearchLine className="absolute top-9 left-9 text-c3" />
                <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Username..."
                    className="w-[320px] h-12 rounded-xl bg-c1/[0.5] pl-11 pr-5 placeholder:text-c3 outline-none text-base"
                />
            </div>

            <ul className="flex flex-col w-full my-5 gap-[2px]">
                <li className={`h-[90px] flex items-center gap-4 hover:bg-c1 p-4 cursor-pointer rounded-3xl bg-c1`}>
                    <AvatarComponent size="large" user={currentUser} />
                    <div className="flex flex-col gap-1 grow relative">
                        <span className="text-base text-white flex items-center justify-between">
                            <div className="font-medium">{currentUser.username}</div>
                            <div className="text-xs text-c3">date</div>
                        </span>
                        <p className="text-sm text-c3 line-clamp-1 break-all">Last message</p>
                        <span className="absolute right-0 top-8 min-w-[18px] h-[18px] rounded-full bg-red-500 flex items-center justify-center text-sm">5</span>
                    </div>
                </li>
            </ul>
        </div>
    )
};

export default ChatsComponent;
