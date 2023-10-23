"use client"

import { createContext, useContext, useReducer, useState } from "react"

const ChatContext = createContext();
import { useAuth } from "./authContext";

export const ChatProvider = ({ children }) => {
    const [users, setUsers] = useState(false);
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
            dispatch
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext);