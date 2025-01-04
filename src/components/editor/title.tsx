import React from "react";

import type { TitleProps, TitleRef } from "./types/title.types";

const title = "Untitled";

const Title = React.forwardRef<TitleRef, TitleProps>(
    ({ handleEnter }, titleRef) => {
        React.useImperativeHandle(titleRef, () => ({
            toSinglePara() { },
        }));

        return <></>;
    }
);

export default Title;
