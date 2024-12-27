import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";

import React from "react";

import type { TitleProps, TitleRef } from "./title.types";

const title = "Untitled";

const Title = React.forwardRef<TitleRef, TitleProps>(
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

export default Title;
