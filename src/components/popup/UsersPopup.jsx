import React from "react";
import PopupWrapper from "./PopupWrapper";
import { useAuth } from "@/contexts/authContext";
import { useChatContext } from "@/contexts/chatContext";
import AvatarComponent from "../Avatar";

const UsersPopup = (props) => {

    const { users } = useChatContext();
    const { currentUser } = useAuth();


    return (
        <PopupWrapper {...props}>
            <div className="mt-5 flex flex-col gap-2 grow relative overflow-auto scrollbar">
                <div className="absolute w-full">
                    {users && Object.values(users).map((user) => (
                        <div key={1} className="flex items-center gap-4 rounded-xl hover:bg-c5 py-2 px-4 cursor-pointer">
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
