import { useAuth } from "@/contexts/authContext";
import { useChatContext } from "@/contexts/chatContext";
import { db } from "@/firebase/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import React from "react";
import ClickAwayListener from "react-click-away-listener";

const ChatMenuComponent = (props) => {
    const { currentUser } = useAuth();
    const { data, users } = useChatContext();

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
                                handleClickAway();
                            }}
                        >
                            {isUserBlocked ? "Unblock User" : "Block User"}
                        </li>
                    }
                    <li
                        className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
                        onClick={() => { }}
                    >
                        Delete Chat
                    </li>
                </ul>
            </div>
        </ClickAwayListener>
    );
};

export default ChatMenuComponent;
