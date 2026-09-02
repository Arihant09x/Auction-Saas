"use client";

import dynamic from "next/dynamic";
import type { BlogEditorProps } from "./BlogEditor";

const BlogEditor = dynamic(
    () => import("./BlogEditor").then((mod) => mod.BlogEditor),
    { ssr: false }
);

export function DynamicBlogEditor(props: BlogEditorProps) {
    return <BlogEditor {...props} />;
}