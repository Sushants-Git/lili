import React from "react";

import type { BodyRef } from "./types/body.types";

import "./styles/body.css";

enum Key {
    EMPTY = "",
    SPACE = " ",
    BACK_TICK = "`",
}

const Body = React.forwardRef<BodyRef>((_, bodyRef) => {
    const decoratorKeyPress = React.useRef(Key.EMPTY);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === Key.BACK_TICK) {
            decoratorKeyPress.current = Key.BACK_TICK;
        }
    };

    React.useImperativeHandle(bodyRef, () => ({
        focusBody: () => {},
    }));

    return <></>;
});

export default Body;
