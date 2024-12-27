import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import { EditorContent, useEditor } from "@tiptap/react";

import React from "react";

import type { BodyRef } from "./body.types";

const Body = React.forwardRef<BodyRef>((_, bodyRef) => {
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

export default Body;
