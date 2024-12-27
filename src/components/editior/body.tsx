import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import { EditorContent, useEditor } from "@tiptap/react";

import React from "react";

import type { BodyRef } from "./body.types";

import "./body.css";

const extensions = [
    Document,
    Paragraph,
    Text,
    History,
    OrderedList,
    BulletList,
    ListItem,
];

const Body = React.forwardRef<BodyRef>((_, bodyRef) => {
    const editor = useEditor({
        extensions,
        content: "",
    });

    React.useImperativeHandle(bodyRef, () => ({
        focusBody() {
            editor?.commands.focus("start");
        },
    }));

    return (
        <EditorContent editor={editor} className="*:outline-none editor-body leading-relaxed" />
    );
});

export default Body;
