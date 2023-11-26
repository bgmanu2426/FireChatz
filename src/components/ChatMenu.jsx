import { useAuth } from "@/contexts/authContext";
import { useChatContext } from "@/contexts/chatContext";
import { db } from "@/firebase/firebase";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";

const ChatMenuComponent = (props) => {
    const { currentUser } = useAuth();
    const { data, users, chats, dispatch, setSelectedChat } = useChatContext();


    const handleClickAway = () => {
        props.setShowMenu(false);
    };

    const isUserBlocked = users[currentUser?.userId]?.blockedUsers?.find(u => u === data?.user?.userId)
    const IamBlocked = users[data?.user?.userId]?.blockedUsers?.find(u => u === currentUser?.userId)

    const handleBlockUser = async (action) => {
        if (action === "BLOCK") {
            await updateDoc(doc(db, "users", currentUser?.userId), {
                blockedUsers: arrayUnion(data?.user?.userId)
            });
        }

        if (action === "UNBLOCK") {
            await updateDoc(doc(db, "users", currentUser?.userId), {
                blockedUsers: arrayRemove(data?.user?.userId)
            });
        }
    }

    const handleDeleteChat = async () => {
        try {
            const chatRef = doc(db, "chats", data?.chatId);
            const chatDoc = await getDoc(chatRef);

            const updatedMessages = chatDoc.data().messages.map(msg => {
                msg.deleteChatInfo = {
                    ...msg.deleteChatInfo,
                    [currentUser?.userId]: true
                }
                return msg;
            }); // Add deleteChatInfo to messages

            await updateDoc(chatRef, {
                messages: updatedMessages
            }); // Update messages

            await updateDoc(doc(db, "userChts", currentUser?.userId), {
                [data?.chatId + ".chatDeleted"]: true
            }); // Update userChats

            const filteredChats = Object
                .entries(chats || {})
                .filter(([id, chat]) => id !== data?.chatId)
                .sort((a, b) => b[1]?.messagingFrom - a[1]?.messagingFrom);

            if (filteredChats.length > 0) {
                setSelectedChat(filteredChats?.[0]?.[1]?.userInfo);
                dispatch({ type: "CHANGE_USER", payload: filteredChats?.[0]?.[1]?.userInfo })
            } else {
                dispatch({ type: "EMPTY" })
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className="w-[200px] absolute top-[70px] right-5 bg-c0 z-10 rounded-md overflow-hidden">
                <ul className="flex flex-col py-2">
                    {
                        !IamBlocked &&
                        <li
                            className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBlockUser(isUserBlocked ? "UNBLOCK" : "BLOCK");
                                props.setShowMenu(false);
                            }}
                        >
                            {isUserBlocked ? "Unblock User" : "Block User"}
                        </li>
                    }
                    <li
                        className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat();
                            props.setShowMenu(false);
                        }}
                    >
                        Delete Chat
                    </li>
                </ul>
            </div>
        </ClickAwayListener>
    );
};

export default ChatMenuComponent;
