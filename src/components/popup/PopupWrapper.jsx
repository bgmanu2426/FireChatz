import React from "react";
import IconComponent from "../Icon";
import { IoClose } from "react-icons/io5";


const PopupWrapper = (props) => {
    return (
        <div className="fixed top-0 left-0 z-20 w-full h-full flex items-center justify-center">
            <div className="w-full h-full absolute glass-effect"></div> {/* glass-effect is a custom class -> https://hype4.academy/tools/glassmorphism-generator*/}
            <div className="flex flex-col w-[500px] max-h-[80%] min-h-[600px] bg-c2 z-10 relative rounded-3xl">
                <div className="shrink-0 p-6 flex items-center justify-between">
                    <div className="text-lg font-semibold">title</div>
                    <IconComponent
                        size='small'
                        icon={<IoClose size={20} />}
                        onClick={() => { }}
                    />
                </div>
                <div className="grow flex flex-col p-6 pt-0">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default PopupWrapper;
