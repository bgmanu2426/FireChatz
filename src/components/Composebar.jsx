import { useAuth } from "@/contexts/authContext";
import { useChatContext } from "@/contexts/chatContext";
import { db, storage } from "@/firebase/firebase";
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { TbSend } from "react-icons/tb";
import { v4 as uuidv4 } from "uuid";

const ComposebarComponent = () => {
    const { inputText, setInputText, data, attachment, setAttachment, setAttachmentPreview } = useChatContext();
    const { currentUser } = useAuth();

    const handleTyping = (e) => {
        setInputText(e.target.value);
    }

    const onKeyUp = (e) => {
        if (e.key === "Enter" && (inputText.trim().length > 0 || attachment)) {
            handleSendMessage();
        }
    }

    const handleSendMessage = async () => {
        if (attachment) {
            const storageRef = ref(storage, `users/${currentUser.userId}/attachments/${attachment.name + uuidv4()}`);
            const uploadTask = uploadBytesResumable(storageRef, attachment);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then(async (downloadURL) => {
                            await updateDoc(doc(db, "chats", data.chatId), {
                                messages: arrayUnion({
                                    id: uuidv4(),
                                    text: inputText,
                                    sender: currentUser.userId,
                                    timestamp: Timestamp.now(),
                                    read: false,
                                    img: downloadURL
                                })
                            });
                        });
                }
            );
        } else {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuidv4(),
                    text: inputText,
                    sender: currentUser.userId,
                    timestamp: Timestamp.now(),
                    read: false
                })
            });
        }


        let Msg = { text: inputText }

        if (attachment) {
            Msg.img = true;
        }

        await updateDoc(doc(db, "userChats", currentUser.userId), {
            [data.chatId + ".lastMessage"]: Msg,
            [data.chatId + ".messagingFrom"]: Timestamp.now(),
        }); // update last message and last message time in user's chats

        await updateDoc(doc(db, "userChats", data.user.userId), {
            [data.chatId + ".lastMessage"]: Msg,
            [data.chatId + ".messagingFrom"]: Timestamp.now(),
        });

        setInputText("");
        setAttachment(null);
        setAttachmentPreview(null);
    }

    return (
        <div className="flex items-center gap-2 grow">
            <input
                type="text"
                placeholder="Type a message"
                className="grow w-full outline-0 p-2 text-white bg-transparent placeholder:text-c3 outline-none text-base"
                value={inputText}
                onChange={handleTyping}
                onKeyUp={onKeyUp}
            />
            <button
                className={`h-10 w-10 rounded-xl shrink-0 flex justify-center items-center ${inputText.trim().length > 0 ? "bg-c4 cursor-pointer" : "cursor-default"} ${attachment ? "bg-c4 cursor-pointer" : "cursor-default"}`}
                onClick={handleSendMessage}
            >
                <TbSend
                    size={20}
                    className="text-white"
                />
            </button>
        </div>
    );
};

export default ComposebarComponent;
