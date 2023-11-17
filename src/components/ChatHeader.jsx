import React, { useState } from "react";
import { useChatContext } from "@/contexts/chatContext";
import AvatarComponent from "./Avatar";
import IconComponent from "./Icon";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import ChatMenuComponent from "./ChatMenu";

const ChatHeaderComponent = () => {
    const [showMenu, setShowMenu] = useState(false);
    const { data, users } = useChatContext();

    const online = users[data.user.userId]?.isOnline;
    const user = users[data.user.userId];

    return (
        <div className="flex justify-between items-center pb-5 border-b border-white/[0.05]">
            {user &&
                (<div className="flex items-center gap-3">
                    <AvatarComponent size="large" user={user} />
                    <div>
                        <div className="font-medium">{user.username}</div>
                        <p className="text-sm text-c3">{online ? "Online" : "Offline"}</p>
                    </div>
                </div>
                )}
            <div className="flex items-center gap-2">
                <IconComponent
                    size="large"
                    className={`${showMenu && "bg-c1"}`}
                    onClick={() => setShowMenu(true)}
                    icon={<IoEllipsisVerticalSharp size={20} className="text-c3" />}
                />
                {
                    showMenu && <ChatMenuComponent showMenu={showMenu} setShowMenu={setShowMenu} />
                }
            </div>
        </div>
    )
};

export default ChatHeaderComponent;
