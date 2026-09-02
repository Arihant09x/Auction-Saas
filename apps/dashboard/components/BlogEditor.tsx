"use client";

import { useCallback, useEffect, useRef } from "react";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/mantine/style.css";

import {
  customSchema,
  CustomSuggestionMenu,
  type MyBlock,
} from "@repo/blocknote-content/react";

export interface BlogEditorProps {
  initialContent?: MyBlock[] | null;
  onChange: (blocks: MyBlock[]) => void;
  readOnly?: boolean;
}

export function BlogEditor({
  initialContent,
  onChange,
  readOnly = false,
}: BlogEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const safeInitialContent =
    Array.isArray(initialContent) && initialContent.length > 0
      ? initialContent
      : undefined;

  const editor = useCreateBlockNote({
    schema: customSchema,
    initialContent: safeInitialContent,
  });

  useEffect(() => {
    onChangeRef.current(editor.document);
  }, [editor]);

  const handleChange = useCallback(() => {
    onChangeRef.current(editor.document);
  }, [editor]);

  return (
    <div
      className="blocknote-editor-wrapper"
      style={{
        minHeight: "480px",
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      <BlockNoteView
        editor={editor}
        editable={!readOnly}
        onChange={handleChange}
        theme="light"
        slashMenu={false}
      >
        {!readOnly && (
          <CustomSuggestionMenu editor={editor} />
        )}
      </BlockNoteView>
    </div>
  );
}

export default BlogEditor;