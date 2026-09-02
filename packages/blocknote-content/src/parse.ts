import { validateBlockNoteContent } from "./validate.js";
import { BlockNoteContent } from "./types.js";

export function parseBlockNoteContent(value: unknown): BlockNoteContent | null {
  if (!value) return null;

  if (Array.isArray(value)) {
    const res = validateBlockNoteContent(value);
    return res.success ? (value as BlockNoteContent) : null;
  }

  if (typeof value === "string" && value.trim() !== "") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        const res = validateBlockNoteContent(parsed);
        return res.success ? (parsed as BlockNoteContent) : null;
      }
    } catch {
      return null;
    }
  }

  return null;
}
