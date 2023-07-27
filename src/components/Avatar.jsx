import Image from "next/image";
import React from "react";

const AvatarComponent = (props) => {
    const { size, user, onClick } = props;
    const s = size === "small" ? 32 : size === "medium" ? 36 : size === "xlarge" ? 56 : size === "xxlarge" ? 96 : 40;
    const c = size === "small" ? "w-8 h-8" : size === "medium" ? "w-9 h-9" : size === "large" ? "w-10 h-10" : size === "xlarge" ? "w-14 h-14" : "w-24 h-24";
    const f = size === "xlarge" ? "text-2xl" : size === "xxlarge" ? "text-4xl" : "text-base";
    return (
        <>
            <div className={`${c} rounded-full flex justify-center items-center text-base shrink-0 relative`}
                style={{ backgroundColor: user?.color }} onClick={onClick}>
                <div>
                    {user?.photoURL
                        ?
                        <div className={`${c} overflow-hidden rounded-full`}>
                            <Image src={user?.photoURL} width={s} height={s} alt="Avatar" className="rounded-full" />
                        </div>
                        :
                        <div className={`${f} uppercase font-semibold`}>
                            {user.username.charAt(0)}
                        </div>
                    }
                </div>
            </div>
        </>
    )
};

export default AvatarComponent;
