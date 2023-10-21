import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import AvatarComponent from "./Avatar";
import { useAuth } from "../context/authContext";
import IconComponent from "./Icon";
import { FiPlus } from "react-icons/fi";
import { IoLogOutOutline, IoClose } from "react-icons/io5";
import { MdPhotoCamera, MdAddAPhoto, MdDeleteForever } from "react-icons/md";

const LeftNavComponent = () => {
    const { currentUser, signOut } = useAuth();

    const [editProfile, setEditProfile] = useState(false);

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
                            type="file"
                            onChange={(e) => { }}
                            style={{ display: "none" }}
                        />

                        {currentUser.photoURL &&
                            (<div className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute ring-0 bottom-0">
                                <MdDeleteForever size={14} />
                            </div>)}
                    </div>

                    <div className="mt-5 flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <div>
                                {currentUser.displayName}
                            </div>
                            <span className">{currentUser.email}</span>
                        </div>
                    </div>
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
