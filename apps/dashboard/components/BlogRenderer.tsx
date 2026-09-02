"use client";

// Thin re-export shim — the actual renderer lives in the shared package so
// dashboard and web always render identically.
export { BlogRenderer, BlogRenderer as default } from "@repo/blocknote-content/react";
export type { BlogRendererProps } from "@repo/blocknote-content/react";