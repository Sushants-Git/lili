import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import {
    Editor,
    EditorContent,
    useEditor,
    useEditorState,
} from "@tiptap/react";

import React from "react";

import type { BodyRef } from "./types/body.types";

import "./styles/body.css";

const extensions = [
    Document,
    Paragraph,
    Text,
    History,
    OrderedList,
    BulletList,
    ListItem,
];

const editorOptions = {
    extensions,
    content: "",
};

enum Key {
    EMPTY = "",
    SPACE = " ",
    BACK_TICK = "`",
}

const Body = React.forwardRef<BodyRef>((_, bodyRef) => {
    const editor = useEditor(editorOptions);
    const decoratorKeyPress = React.useRef(Key.EMPTY);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === Key.BACK_TICK) {
            decoratorKeyPress.current = Key.BACK_TICK;
        }
    };

    useEditorState({
        editor,
        selector: ({ editor }) => {
            if (!editor) return;

            handleCodeStyling(editor, decoratorKeyPress);
        },
    });

    React.useImperativeHandle(bodyRef, () => ({
        focusBody: () => editor?.commands.focus("start"),
    }));

    return (
        <>
            <EditorContent
                editor={editor}
                className="*:outline-none editor-body leading-relaxed"
                onKeyDown={handleKeyDown}
            />
        </>
    );
});

const handleCodeStyling = (
    editor: Editor,
    decoratorKeyPress: React.MutableRefObject<Key>
) => {
    if (decoratorKeyPress.current !== Key.BACK_TICK) return;

    decoratorKeyPress.current = Key.EMPTY;

    // Hello| -> H = 1, textCursor = 6  (according to Tiptap)
    // Hello| -> H = 0, textCursor = 5  (their indexes)

    // We are looking for -> " `" (i.e SPACE followed by BACK_TICK)

    const textCursorIndex = editor.state.selection.to - 1;
    const spaceBeforeApostrophe =
        editor.getText().at(textCursorIndex - 2) === Key.SPACE;

    if (spaceBeforeApostrophe) {
        editor.commands.insertContent(Key.BACK_TICK);
        editor.commands.focus(textCursorIndex + 1);
    }
};

export default Body;
