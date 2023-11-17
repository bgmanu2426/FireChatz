import React, { useState } from "react";
import IconComponent from "./Icon";
import { CgAttachment } from "react-icons/cg";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import ComposebarComponent from "./Composebar";
import EmojiPicker from "emoji-picker-react";
import ClickAwayListener from "react-click-away-listener";
import { useChatContext } from "@/contexts/chatContext";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

const ChatFooterComponent = () => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const { isTyping, editMessage, setEditMessage, inputText, setInputText, attachment, setAttachment, attachmentPreview, setAttachmentPreview } = useChatContext();

    const onEmojiClick = (emojiObject) => {
        let text = inputText;
        setInputText((text += emojiObject.emoji));
    }

    const onFileChange = (e) => {
        const file = e.target.files[0];
        setAttachment(file);

        if (file) {
            const blobUrl = URL.createObjectURL(file);
            setAttachmentPreview(blobUrl);
        }
    }

    return (
        <div className="flex items-center bg-c1/[0.5] p-2 rounded-xl relative">
            <div className="shrink-0">
                <input
                    type="file"
                    id="fileUploader"
                    className="hidden"
                    onChange={onFileChange}
                />
                <label htmlFor="fileUploader">
                    <IconComponent size={"large"} icon={<CgAttachment size={20} className="text-c3" />} />
                </label>
            </div>

            <div className="shrink-0 relative">
                <IconComponent
                    size={"large"}
                    className={``}
                    icon={<HiOutlineEmojiHappy size={24} className="text-c3" />}
                    onClick={() => setShowEmojiPicker(true)}
                />
                {
                    showEmojiPicker &&
                    (
                        <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
                            <div className="absolute bottom-12 left-0 shadow-lg">
                                <EmojiPicker emojiStyle="apple" theme="login" onEmojiClick={onEmojiClick} autoFocusSearch="false" />
                            </div>
                        </ClickAwayListener>
                    )
                }
            </div>

            {isTyping &&
                (<div className="absolute -top-6 left-4 bg-c2 w-full h-6">
                    <div className="flex gap-2 w-full h-full opacity-50 text-sm text-white">
                        {`User is typing...`}
                        <Image src="/typing.svg" alt="typing" width={20} height={20} />
                    </div>
                </div>)
            }

            {editMessage && <div
                className="absolute -top-14 left-1/2 -translate-x-1/2 bg-c4 flex items-center gap-2 py-2 px-4 pr-2 rounded-full text-sm font-semibold cursor-pointer shadow-lg"
                onClick={() => setEditMessage(null)}
            >
                <span>Cancel Edit</span>
                <IoClose size={16} className="text-white" />
            </div>}

            <ComposebarComponent />
        </div>
    );
};

export default ChatFooterComponent;
