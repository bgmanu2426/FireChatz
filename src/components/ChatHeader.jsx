import React, { useState } from "react";
import { useChatContext } from "@/contexts/chatContext";
import AvatarComponent from "./Avatar";

const ChatHeaderComponent = () => {
    const [showMenu, setShowMenu] = useState(false);
    const { data, users } = useChatContext();

    const online = users[data.user.userId]?.isOnline;
    const user = users[data.user.userId];

    return (
        <div className="flex justify-between items-center pb-5 border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
                <AvatarComponent size="large" user={user} />
                <div>
                    <div className="font-medium">{user.username}</div>
                    <p className="text-sm text-c3">{online ? "Online" : "Offline"}</p>
                </div>
            </div>
        </div>
    )
};

export default ChatHeaderComponent;
