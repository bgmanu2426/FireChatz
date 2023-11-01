"use client"

import { createContext, useContext, useReducer, useState } from "react"

const ChatContext = createContext();
import { useAuth } from "./authContext";

export const ChatProvider = ({ children }) => {
    const [users, setUsers] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    const { currentUser } = useAuth();

    const INITIAL_STATE = {
        chatId: "",
        user: null,
    }

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: currentUser.userId > action.payload.userId ? currentUser.userId + action.payload.userId : action.payload.userId + currentUser.userId
                }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{
            users,
            setUsers,
            data: state,
            dispatch,
            chats,
            setChats,
            selectedChat,
            setSelectedChat
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext);