import React from "react";

import { EditorState, TextSelection } from "prosemirror-state";
import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { Schema } from "prosemirror-model";
import { ProseMirror } from "@nytimes/react-prosemirror";

import type { BodyRef } from "./types/body.types";

import "./styles/body.css";

enum Key {
    EMPTY = "",
    SPACE = " ",
    BACK_TICK = "`",
}

const schema = new Schema({
    nodes: {
        doc: {
            content: "editor",
        },
        editor: {
            content: "div+",
            group: "block",
            parseDOM: [{ tag: "div.lili-editor" }],
            toDOM() {
                return ["div", { class: "lili-editor" }, 0];
            },
        },
        div: {
            content: "inline*",
            group: "block",
            parseDOM: [{ tag: "div.lili-line" }],
            toDOM() {
                return ["div", { class: "lili-line" }, 0];
            },
        },
        code: {
            content: "text*",
            group: "inline",
            inline: true,
            parseDOM: [{ tag: "span.lili-code" }],
            toDOM() {
                return ["span", { class: "lili-code" }, 0];
            },
        },
        text: {
            group: "inline",
            inline: true,
        },
    },
});

const Body = React.forwardRef<BodyRef>((_, bodyRef) => {
    React.useImperativeHandle(bodyRef, () => ({
        focusBody: () => {},
    }));

    return <ProseMirrorEditor />;
});

export function ProseMirrorEditor() {
    const [mount, setMount] = React.useState<HTMLElement | null>(null);
    const [state, setState] = React.useState(() =>
        EditorState.create({ schema, plugins: [history()] })
    );

    const handleKeyDown = (s: EditorState, e: KeyboardEvent) => {
        const keyIsBackTick = e.key === Key.BACK_TICK;

        const nonBreakingSpace = "\u00A0"; // &nbsp;
        const spaceCharacter = [nonBreakingSpace, Key.SPACE];

        const lastCharacter = s.doc.textContent.at(-1);

        let isPrevCharSpace = lastCharacter
            ? spaceCharacter.includes(lastCharacter)
            : false;

        if (keyIsBackTick && isPrevCharSpace) {
            e.preventDefault();

            let currentAnchorPos = s.selection.anchor;

            let t1 = s.tr.insert(
                currentAnchorPos,
                schema.nodes.code.create(
                    null,
                    schema.text(Key.BACK_TICK + Key.BACK_TICK)
                )
            );
            let tr = t1.setSelection(
                TextSelection.create(t1.doc, currentAnchorPos + 2)
            );

            setState((s) => {
                let ns = s.apply(tr);
                return ns;
            });
        }
    };

    return (
        <div className="*:outline-none leading-relaxed">
            <ProseMirror
                mount={mount}
                state={state}
                plugins={[
                    keymap(baseKeymap),
                    keymap({
                        "Mod-z": undo,
                        "Mod-y": redo,
                        "Mod-Shift-z": redo,
                    }),
                ]}
                handleKeyDown={(view, event) => {
                    handleKeyDown(view.state, event);
                }}
                dispatchTransaction={(tr) => {
                    setState((s) => s.apply(tr));
                }}
            >
                <div ref={setMount} />
            </ProseMirror>
        </div>
    );
}

export default Body;
