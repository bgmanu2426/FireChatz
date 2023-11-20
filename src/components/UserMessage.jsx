import { useAuth } from "@/contexts/authContext";
import React, { useState } from "react";
import AvatarComponent from "./Avatar";
import { useChatContext } from "@/contexts/chatContext";
import Image from "next/image";
import ImageViewer from "react-simple-image-viewer"
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { formatDate, wrapEmojisInHtmlTag } from "@/utils/helpers";
import IconComponent from "./Icon";
import { GoChevronDown } from "react-icons/go";
import MessageDropdownComponent from "./MessageDropdown";
import DeleteMsgPopupComponent from "./popup/DeleteMsgPopup";
import { db } from "@/firebase/firebase";
import { DELETED_FOR_EVERYONE, DELETED_FOR_ME } from "@/utils/constants";

const UserMessageComponent = ({ msg }) => {
    const { currentUser } = useAuth();
    const { users, data, imageViewer, setImageViewer } = useChatContext();

    const [showMenu, setShowMenu] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false)

    const self = msg.sender === currentUser.userId;

    const timestamp = new Timestamp(msg.timestamp?.seconds, msg.timestamp?.nanoseconds);
    const date = timestamp.toDate();

    const deleteMsgPopupHandle = () => {
        setShowDeletePopup(true);
        setShowMenu(false);
    }

    const deleteMessage = async (actionType) => {
        try {
            const messageId = msg.id;
            const chatRef = doc(db, "chats", data?.chatId);
            const chatDoc = await getDoc(chatRef);

            const updatedMessages = chatDoc.data().messages.map((message) => {
                if (message.id === messageId) {
                    if(actionType === DELETED_FOR_ME) {
                        
                    }
                }
            });
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={`mb-5 max-w-[75%] ${self && "self-end"}`}>
            {showDeletePopup && <DeleteMsgPopupComponent
                noHeader={true}
                shortHeight={true}
                self={self}
                onHide={() => setShowDeletePopup(false)}
                className={`DeleteMsgPopup`}
                deleteMessage={deleteMessage}
            />}
            <div className={`flex items-end gap-3 mb-1 ${self && "justify-start flex-row-reverse"}`}>
                <AvatarComponent size={"small"} user={self ? currentUser : users[data?.user?.userId]} />
                <div className={`group flex flex-col gap-4 p-3 rounded-3xl relative break-all ${self ? "rounded-br-md bg-c5" : "rounded-bl-md bg-c1"}`}>
                    {
                        msg?.img &&
                        <>
                            <Image
                                className="rounded-3xl max-w-[250px]"
                                src={msg?.img}
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
                                imageViewer && imageViewer?.msgId === msg.id && (
                                    <ImageViewer
                                        src={[imageViewer?.url]}
                                        currentIndex={0}
                                        disableScroll={false}
                                        closeOnClickOutside={true}
                                        onClose={() => setImageViewer(null)}
                                    />
                                )
                            }
                        </>
                    }
                    {
                        msg?.text && (
                            <div
                                className="text-sm"
                                dangerouslySetInnerHTML={{ __html: wrapEmojisInHtmlTag(msg?.text) }}
                            />
                        )}
                    <div
                        className={`${showMenu ? "" : "hidden"} group-hover:flex absolute top-2 ${self ? "left-2 bg-c5" : "right-2 bg-c1"}`}
                    >
                        <IconComponent
                            size={"small"}
                            className={`hover:bg-inherit rounded-none`}
                            icon={<GoChevronDown size={24} className={`text-c3`} />}
                            onClick={() => setShowMenu(true)}
                        />
                        {
                            showMenu && <MessageDropdownComponent
                                self={self}
                                setShowMenu={setShowMenu}
                                showMenu={showMenu}
                                deleteMsgPopupHandle={deleteMsgPopupHandle}
                            />
                        }
                    </div>
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
