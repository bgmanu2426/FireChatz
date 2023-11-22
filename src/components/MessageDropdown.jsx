import React, { useEffect, useRef } from "react";
import ClickAwayListener from "react-click-away-listener";

const MessageDropdownComponent = (props) => {
    const { showMenu, setShowMenu, self, deleteMsgPopupHandle } = props;

    const handleClickAway = () => {
        setShowMenu(false);
    }

    const ref = useRef();

    useEffect(() => {
        ref?.current?.scrollIntoViewIfNeeded({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest"
        })
    }, [showMenu]);

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div ref={ref} className={`w-[200px] absolute bg-c0 z-10 rounded-md overflow-hidden top-8 ${self ? "right-0" : "left-0"}`}>
                <ul className="flex flex-col py-2">
                    {self && <li className="flex items-center py-3 px-5 hover:bg-black cursor-pointer">Edit Message</li>}
                    <li
                        className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
                            deleteMsgPopupHandle(true);
                        }}
                    >
                        Delete Message
                    </li>
                </ul>
            </div>
        </ClickAwayListener>
    );
};

export default MessageDropdownComponent;