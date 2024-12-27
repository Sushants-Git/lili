import "./app.css";
import React from "react";
import Title from "./components/editior/title";
import Body from "./components/editior/body";

import type { BodyRef } from "./components/editior/body.types";
import type { TitleRef } from "./components/editior/title.types";

function App() {
    const bodyRef = React.useRef<BodyRef>(null);
    const titleRef = React.useRef<TitleRef>(null);

    const handleEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            titleRef.current?.toSinglePara();
            bodyRef.current?.focusBody();
        }
    };

    return (
        <section className="font-lexend mx-auto max-w-3xl px-6 pb-24 pt-24 text-base/[150%] sm:pb-32 lg:px-10">
            <h1 className="text-4xl mb-6">
                <Title handleEnter={handleEnter} ref={titleRef} />
            </h1>

            <Body ref={bodyRef} />
        </section>
    );
}

export default App;
