import "./App.css";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import React, { forwardRef } from "react";

type BodyTiptapRef = {
    focusBody: () => void;
};

type TitleTiptapRef = {
    toSinglePara: () => void;
};

function App() {
    const bodyRef = React.useRef<BodyTiptapRef>(null);
    const titleRef = React.useRef<TitleTiptapRef>(null);

    const handleEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            titleRef.current?.toSinglePara();
            bodyRef.current?.focusBody();
        }
    };

    return (
        <>
            <section className="font-excalifont mx-auto max-w-3xl px-6 pb-24 pt-24 text-base/[150%] sm:pb-32 lg:px-10">
                <h1 className="text-4xl">
                    <TitleTiptap handleEnter={handleEnter} ref={titleRef} />
                </h1>

                <br />

                <BodyTiptap ref={bodyRef} />
            </section>
        </>
    );
}

const title = "Untitled";

type TitleTiptapProps = {
    handleEnter: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

const TitleTiptap = forwardRef<TitleTiptapRef, TitleTiptapProps>(
    ({ handleEnter }, titleRef) => {
        const editor = useEditor({
            extensions: [Document, Paragraph, Text, History],
            content: title,
        });

        React.useImperativeHandle(titleRef, () => ({
            toSinglePara() {
                const editiorContent = editor?.getJSON().content;

                if (editiorContent && editiorContent.length > 1) {
                    const arr: string[] = [];
                    iterateObject(editiorContent, arr);
                    editor.commands.setContent(`<p>${arr.join("")}</p>`);
                }
            },
        }));

        return (
            <>
                <EditorContent
                    editor={editor}
                    className="*:outline-none"
                    onKeyDown={handleEnter}
                />
            </>
        );
    }
);

function iterateObject(obj: JSONContent, contentString: string[]) {
    for (const key in obj) {
        const isObject = typeof obj[key] === "object" && obj[key] !== null;
        const keyIsText = key === "text";

        if (isObject) {
            iterateObject(obj[key], contentString);
        } else if (keyIsText) {
            contentString.push(obj["text"] as string);
        }
    }
}

const BodyTiptap = React.forwardRef<BodyTiptapRef>((_, bodyRef) => {
    const editor = useEditor({
        extensions: [Document, Paragraph, Text, History],
        content: "",
    });

    React.useImperativeHandle(bodyRef, () => ({
        focusBody() {
            editor?.commands.focus("start");
        },
    }));

    return (
        <>
            <EditorContent editor={editor} className="*:outline-none" />
        </>
    );
});

export default App;
