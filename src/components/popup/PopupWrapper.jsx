import React from "react";
import IconComponent from "../Icon";
import { IoClose } from "react-icons/io5";

const PopupWrapper = (props) => {
    return (
        <div className="fixed top-0 left-0 z-20 w-full h-full flex items-center justify-center">
            <div className="w-full h-full absolute glass-effect" onClick={props.onHide}>
                {/* If you dont want popup to be close when clicked outise of the box then remove onclick from here */}
                {/* glass-effect is a custom class -> https://hype4.academy/tools/glassmorphism-generator*/}
            </div>

            <div className={`flex flex-col w-[500px] max-h-[80%] bg-c2 z-10 relative rounded-3xl ${props.shortHeight ? "" : "min-h-[600px]"}`}>
                {!props.noHeader && <div className="shrink-0 p-6 flex items-center justify-between">
                    <div className="text-lg font-semibold">{props.title || " "}</div>
                    <IconComponent
                        size='small'
                        icon={<IoClose size={20} />}
                        onClick={props.onHide}
                    />
                </div>}
                <div className="grow flex flex-col p-6 pt-0">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default PopupWrapper;
