"use client"

import { auth } from "@/firebase/firebase";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const clear = () => {
        setIsLoading(false);
        setCurrentUser(null);
    }

    const authStateChanged = (user) => {
        setIsLoading(true);
        if (!user) {
            clear();
            return;
        }
        setCurrentUser(user);
        setIsLoading(false);
    }

    const signOut = () => {
        authSignOut(auth)
            .then(() => {
                clear();
            }).catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged)
        return () => unsubscribe()
    }, []);


    return (
        <UserContext.Provider value={{
            currentUser,
            setCurrentUser,
            isLoading,
            setIsLoading,
            signOut
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuth = () => useContext(UserContext)