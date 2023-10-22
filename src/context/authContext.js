"use client"

import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, use, useContext, useEffect, useState } from "react"

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const clear = async () => {
        try {
            if (currentUser) {
                await updateDoc(doc(db, "users", currentUser.userId), {
                    isOnline: false
                });
            }
            setIsLoading(false);
            setCurrentUser(null);
        } catch (error) {
            console.error(error);
        }
    }

    const authStateChanged = async (user) => {
        // console.log(user);
        setIsLoading(true);
        if (!user) {
            clear();
            return;
        }

        const userDocExists = await getDoc(doc(db, "users", user.uid))
        if (userDocExists.exists()) {
            // console.log(userDocExists.data());
            await updateDoc(doc(db, "users", user.uid), {
                isOnline: true
            });
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