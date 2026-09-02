"use client";

import React from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { customSchema } from "./react-schema.js";
import { parseBlockNoteContent } from "./parse.js";

// ─────────────────────────────────────────────────────────────────────────────
// BlogRenderer — shared read-only BlockNote renderer.
//
// Single source of truth for rendering saved BlockNote documents in every
// consuming app (dashboard split/live preview, web public blog pages).
// Uses the same customSchema as BlogEditor, so every block type the editor
// can create (tables, images, lists, stat, statsGroup, button, …) renders
// identically here.
// ─────────────────────────────────────────────────────────────────────────────

export interface BlogRendererProps {
    /** Raw blockContent from the API (BlockNote block array or JSON string). */
    blockContent: unknown;
}

function BlockNoteReadOnlyRenderer({ blocks }: { blocks: any[] }) {
    const editor = useCreateBlockNote({
        schema: customSchema,
        initialContent: blocks as any,
    });

    return (
        <BlockNoteView
            editor={editor as any}
            editable={false}
            theme="light"
        />
    );
}

export function BlogRenderer({ blockContent }: BlogRendererProps) {
    // Safe parse — returns validated block array or null; never throws
    const blocks = parseBlockNoteContent(blockContent);

    if (!blocks || blocks.length === 0) {
        return null; // Caller falls back to its own empty/Markdown view
    }

    return (
        <div className="blocknote-renderer">
            <BlockNoteReadOnlyRenderer blocks={blocks} />
        </div>
    );
}

export default BlogRenderer;