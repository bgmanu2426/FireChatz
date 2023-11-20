import { useAuth } from "@/contexts/authContext";
import React from "react";
import AvatarComponent from "./Avatar";
import { useChatContext } from "@/contexts/chatContext";
import Image from "next/image";
import ImageViewer from "react-simple-image-viewer"
import { Timestamp } from "firebase/firestore";
import { formatDate, wrapEmojisInHtmlTag } from "@/utils/helpers";

const UserMessageComponent = ({ msg }) => {
    const { currentUser } = useAuth();
    const { user, data, imageViewer, setImageViewer } = useChatContext();

    const self = msg.sender === currentUser.userId;

    const timestamp = new Timestamp(msg.timestamp?.seconds, msg.timestamp?.nanoseconds);
    const date = timestamp.toDate();

    return (
        <div className={`mb-5 max-w-[75%] ${self && "self-end"}`}>
            <div className={`flex items-end gap-3 mb-1 ${self && "justify-start flex-row-reverse"}`}>
                <AvatarComponent size={"small"} user={self ? currentUser : user[data.user.userId]} />
                <div className={`group flex flex-col gap-4 p-3 rounded-3xl relative break-all ${self ? "rounded-br-md bg-c5" : "rounded-bl-md bg-c1"}`}>
                    {
                        msg.text && (
                            <div
                                className="text-sm"
                                dangerouslySetInnerHTML={{ __html: wrapEmojisInHtmlTag(msg.text) }}
                            />
                        )}
                    {
                        msg.img &&
                        <>
                            <Image
                                className="rounded-3xl max-w-[250px]"
                                src={msg.img}
                                alt={msg?.text || ""}
                                width={250}
                                height={250}
                                onClick={() => {
                                    setImageViewer({
                                        msgId: msg.id,
                                        url: msg.img
                                    });
                                }}
                            />
                            {
                                imageViewer && imageViewer.msgId === msg.id && (
                                    <ImageViewer
                                        src={[imageViewer.url]}
                                        currentIndex={0}
                                        disableScroll={false}
                                        closeOnClickOutside={true}
                                        onClose={() => setImageViewer(null)}
                                    />
                                )
                            }
                        </>
                    }
                </div>
            </div>
            <div className={`flex items-end ${self ? "justify-start flex-row-reverse mr-12" : "ml-12"}`}>
                <div className="text-xs text-c3">
                    {formatDate(date)}
                </div>
            </div>
        </div>
    );
};

export default UserMessageComponent;
