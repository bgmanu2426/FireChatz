import React from "react";
import PopupWrapper from "./PopupWrapper";
import { useAuth } from "@/contexts/authContext";
import { useChatContext } from "@/contexts/chatContext";
import AvatarComponent from "../Avatar";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import SearchComponent from "../Search";

const UsersPopup = (props) => {
    const { users, dispatch } = useChatContext();
    const { currentUser } = useAuth();

    const handleSelect = async (user) => {
        try {
            const combinedId = currentUser.userId > user.userId ? currentUser.userId + user.userId : user.userId + currentUser.userId

            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                // If chat doesn't exist, create a new one

                await setDoc(doc(db, "chats", combinedId), {
                    messages: [],
                }); // Create chat

                const currentUserChatRef = await getDoc(doc(db, "userChats", currentUser.userId)); // Get current user's chat reference

                const userChatRef = await getDoc(doc(db, "userChats", user.userId)); // Get user's chat reference who is being chatted with

                // If ABOVE users chat reference doesn't exist, create it
                if (!currentUserChatRef.exists()) {
                    await setDoc(doc(db, "userChats", currentUser.userId), {});
                }
                await updateDoc(doc(db, "userChats", currentUser.userId), {
                    [combinedId + ".userInfo"]: {
                        userId: user.userId,
                        username: user.username,
                        email: user.email,
                        photoURL: user.photoURL || null,
                        color: user.color,
                    },
                    [combinedId + ".messagingFrom"]: serverTimestamp(),
                });

                if (!userChatRef.exists()) {
                    await setDoc(doc(db, "userChats", user.userId), {});
                }
                await updateDoc(doc(db, "userChats", user.userId), {
                    [combinedId + ".userInfo"]: {
                        userId: currentUser.userId,
                        username: currentUser.username,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL || null,
                        color: currentUser.color,
                    },
                    [combinedId + ".messagingFrom"]: serverTimestamp(),
                });
            } else {
                // If chat exists, open it
            }

            dispatch({
                type: "CHANGE_USER",
                payload: user
            })

            props.onHide();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <PopupWrapper {...props}>
            <SearchComponent onHide={props.onHide} />
            <div className="mt-5 flex flex-col gap-2 grow relative overflow-auto scrollbar">
                <div className="absolute w-full">
                    {users && Object.values(users).map((user, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 rounded-xl hover:bg-c5 py-2 px-4 cursor-pointer"
                            onClick={() => {
                                handleSelect(user);
                            }} >
                            <AvatarComponent size="large" user={user} />
                            <div className="flex flex-col gap-1 grow">
                                <span className="text-base text-white flex items-center justify-between">
                                    <div className="font-medium">{user.username}</div>
                                </span>
                                <p className="text-sm text-c3">{user.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PopupWrapper>
    )
};

export default UsersPopup;
