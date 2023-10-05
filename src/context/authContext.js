"use client"

import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const clear = () => {
        setIsLoading(false);
        setCurrentUser(null);
    }

    const authStateChanged = async(user) => {
        setIsLoading(true);
        if (!user) {
            clear();
            return;
        }
        const userData = await getDoc(doc(db, "users", user.uid));
        setCurrentUser(userData.data());
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