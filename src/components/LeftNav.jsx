import React, { useState } from "react";
import { BiCheck, BiEdit } from "react-icons/bi";
import AvatarComponent from "./Avatar";
import { useAuth } from "../context/authContext";
import IconComponent from "./Icon";
import { FiPlus } from "react-icons/fi";
import { IoLogOutOutline, IoClose } from "react-icons/io5";
import { MdPhotoCamera, MdAddAPhoto, MdDeleteForever } from "react-icons/md";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { profileColors } from "@/utils/constants";
import { toast } from "react-toastify";
import ToastMessage from "./ToastMessage";
import { doc, updateDoc } from "firebase/firestore";

const LeftNavComponent = () => {
    const { currentUser, signOut } = useAuth();

    const [editProfile, setEditProfile] = useState(false);
    const [nameEdited, setNameEdited] = useState(false);

    const handleUpdateProfile = (type, value) => {
        // color, name, photo, photo-del
        let userObject = { ...currentUser }
        switch (type) {
            case "color":
                userObject.color = value;
                break;
            case "name":
                userObject.username = value;
                break;
            case "photo":
                userObject.photoURL = value;
                break;
            case "photo-del":
                userObject.photoURL = null;
                break;
            default:
                break;
        }

        try {
            toast.promise(async () => {
                const docRef = doc(db, "users", currentUser.uid)
                await updateDoc(docRef, userObject)
            }, {
                pending: "Updating Profile",
                success: "Profile updated successfully",
                error: "Profile update failed"
            }, {
                autoClose: 3000
            })
        } catch (error) {
            console.log(error);
        }
    }



    const onkeydown = (e) => {
        if (e.key === "Enter" && e.keyCode === 13) {
            e.preventDefault(); // Ensure that there is no special behaviour
        }
    }

    const onkeyup = (e) => {
        if (e.target.innerText.trim() !== currentUser.username) {
            setNameEdited(true); // name is edited
        } else {
            setNameEdited(false); // name is not edited
        }
    }

    const editProfileContainer = () => {
        return (
            <div className="relative flex flex-col items-center">
                <IconComponent
                    size={"null"}
                    className={"absolute top-0 right-3 hover:bg-c2"}
                    icon={<IoClose size={20} />}
                    onClick={() => setEditProfile(false)}
                />
                <div className="relative group cursor-pointer">
                    <AvatarComponent size={"xxlarge"} user={currentUser} />
                    <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex">

                        <label htmlFor="fileUpload">
                            {currentUser.photoURL ? (
                                <MdPhotoCamera size={34} />
                            ) : (
                                <MdAddAPhoto size={34} />
                            )}
                        </label>

                        <input
                            id="fileUpload"
                            type="file"
                            onChange={(e) => { }}
                            style={{ display: "none" }}
                        />
                    </div>

                    {currentUser.photoURL && (<div className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute right-0 bottom-0">
                        <MdDeleteForever size={20} />
                    </div>)}
                </div>

                <div className="flex flex-col items-center mt-5">
                    <div className="flex items-center gap-4">

                        <div
                            contentEditable
                            className="bg-transparent text-center border-none outline-none"
                            id="displayNameEdit"
                            onKeyUp={onkeyup}
                            onKeyDown={onkeydown}
                        >
                            {currentUser.username}
                        </div>

                        {!nameEdited && <BiEdit className="text-c3" />}
                        {nameEdited && <BsFillCheckCircleFill
                            className="text-c4 cursor-pointer"
                            onClick={() => {
                                // edit name logic
                            }}
                        />}
                    </div>

                    <span className="text-c3 text-sm">
                        {currentUser.email}
                    </span>
                </div>

                <div className="grid grid-cols-5 gap-4 mt-5">

                    {profileColors.map((color, index) => (
                        <span
                            key={index}
                            className="w-8 h-8 rounded-full cursor-pointer items-center justify-center transition-transform hover:scale-125"
                            style={{ backgroundColor: color }}
                        >
                            {color === currentUser.color && (<BiCheck size={32} />)}
                        </span>
                    ))}
                </div>

            </div>
        );
    };

    return (
        <>
            <div
                className={`${editProfile ? "w-[350px]" : "w-[80px] items-center"
                    } flex flex-col justify-between shrink-0 py-5 transition-all`}
            >
                <ToastMessage />

                {editProfile ? (
                    editProfileContainer()
                ) : (
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => {
                            setEditProfile(true);
                        }}
                    >
                        <AvatarComponent size={"large"} user={currentUser} />
                        <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 justify-center items-center hidden group-hover:flex">
                            <BiEdit size={18} />
                        </div>
                    </div>
                )}

                <div
                    className={`flex gap-5 ${editProfile ? "ml-5" : "flex-col items-center"
                        }`}
                >
                    <IconComponent
                        size={"large"}
                        className={"bg-green-500 hover:bg-gray-600"}
                        icon={<FiPlus size={24} />}
                        onClick={(e) => { }}
                    />

                    <IconComponent
                        size={"large"}
                        className={"hover:bg-c2"}
                        icon={<IoLogOutOutline size={24} />}
                        onClick={signOut}
                    />
                </div>
            </div>
        </>
    );
};

export default LeftNavComponent;
