import { useAuth } from "@/contexts/authContext";
import { useChatContext } from "@/contexts/chatContext";
import { db, storage } from "@/firebase/firebase";
import { Timestamp, arrayUnion, deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect } from "react";
import { TbSend } from "react-icons/tb";
import { v4 as uuidv4 } from "uuid";

let typingTimeout = null;

const ChatInputBarComponent = () => {
    const { inputText, setInputText, data, attachment, setAttachment, setAttachmentPreview, editMessage, setEditMessage } = useChatContext();
    const { currentUser } = useAuth();

    useEffect(() => {
        setInputText(editMessage?.text || "");
    }, [attachment, editMessage?.text, setInputText]);

    const handleTyping = async (e) => {
        setInputText(e.target.value);
        await updateDoc(doc(db, "chats", data.chatId), {
            [`typing.${currentUser.userId}`]: true
        });

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        typingTimeout = setTimeout(async () => {
            await updateDoc(doc(db, "chats", data.chatId), {
                [`typing.${currentUser.userId}`]: false
            });
            typingTimeout = null;
        }, 400);
    }

    const onKeyUp = (e) => {
        if (e.key === "Enter" && (inputText.trim().length > 0 || attachment)) {
            editMessage ? handleEdit() : handleSendMessage();
        }
    }

    const handleSendMessage = async () => {
        try {
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
                [data.chatId + ".chatDeleted"]: deleteField(),
            });

            setInputText("");
            setAttachment(null);
            setAttachmentPreview(null);
        } catch (error) {
            console.error(error);
        }
    }

    const handleEdit = async () => {
        try {
            const messageId = editMessage.id;
            const chatRef = doc(db, "chats", data.chatId);

            const chatDoc = await getDoc(chatRef);
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
                                // Create a new "messages" array that excludes the message with the matching ID
                                let updatedMessages = chatDoc
                                    .data()
                                    .messages.map((message) => {
                                        if (message.id === messageId) {
                                            message.text = inputText;
                                            message.img = downloadURL;
                                        }
                                        return message;
                                    });

                                await updateDoc(chatRef, {
                                    messages: updatedMessages,
                                });
                            });
                    }
                );
            } else {
                // Create a new "messages" array that excludes the message with the matching ID
                let updatedMessages = chatDoc.data().messages.map((message) => {
                    if (message.id === messageId) {
                        message.text = inputText;
                    }
                    return message;
                });
                await updateDoc(chatRef, { messages: updatedMessages });
            }

            setInputText("");
            setAttachment(null);
            setAttachmentPreview(null);
            setEditMessage(null);
        } catch (error) {
            console.error(error);
        }
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
                onClick={editMessage ? handleEdit : handleSendMessage}
            >
                <TbSend
                    size={20}
                    className="text-white"
                />
            </button>
        </div>
    );
};

export default ChatInputBarComponent;
