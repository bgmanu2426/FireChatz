import { db } from "@/firebase/firebase";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import AvatarComponent from "./Avatar";
import { useChatContext } from "@/contexts/chatContext";
import { useAuth } from "@/contexts/authContext";

const SearchComponent = (props) => {
    const { dispatch } = useChatContext();
    const { currentUser } = useAuth();

    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const handleSelect = async () => {
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
                        userId: currentUser?.userId,
                        username: currentUser?.username,
                        email: currentUser?.email,
                        photoURL: currentUser?.photoURL || null,
                        color: currentUser?.color,
                    },
                    [combinedId + ".messagingFrom"]: serverTimestamp(),
                });
            } else {
                await updateDoc(doc(db, "userChats", currentUser.userId), {
                    [combinedId + ".chatDeleted"]: deleteField(),
                })
            }

            setUsername("");
            setUser(null);

            dispatch({
                type: "CHANGE_USER",
                payload: user
            })

            props.onHide();
        } catch (error) {
            console.error(error);
        }
    }

    const onkeyHandler = async (e) => {
        if (e.key === "Enter" && !!username) {
            try {
                setErr(false);
                const userRef = collection(db, "users");
                const q = query(userRef, where("username", "==", username));

                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    setErr("User not found!");
                    setUser(null);
                } else {
                    querySnapshot.forEach((doc) => {
                        setUser(doc.data());
                    });
                }
            } catch (error) {
                console.error(error);
                setErr(error.message)
            }
        }
    }

    return (
        <div className="shrink-0">
            <div className="relative">
                <RiSearchLine className="absolute top-4 left-4 text-c3" />
                <input
                    type="text"
                    placeholder="Search User ..."
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                    onKeyUp={onkeyHandler}
                    value={username}
                    autoFocus
                    className="w-full rounded-xl h-12 bg-c1/[0.5] pl-11 pr-16 placeholder:text-c3 outline-none text-base"
                />
                <span className="absolute top-[14px] right-4 text-sm text-c3">
                    Enter
                </span>
            </div>

            {err && (
                <>
                    <div className="mt-5 w-full text-sm text-center">{err}</div>
                    <div className="w-full h-[1px] bg-white/[0.1] mt-5"></div>
                </>
            )}

            {user && (
                <>
                    <div
                        className="flex items-center gap-4 rounded-xl hover:bg-c5 py-2 px-4 mt-5 cursor-pointer"
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
                    <div className="w-full h-[1px] bg-white/[0.1] mt-5"></div>
                </>
            )}


        </div>
    );
};

export default SearchComponent;
