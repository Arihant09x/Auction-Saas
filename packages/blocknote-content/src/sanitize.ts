import { DEFAULTS } from "./schema-config.js";

function isEmptyParagraph(block: any) {
  return (
    block.type === "paragraph" &&
    (!Array.isArray(block.content) || block.content.length === 0) &&
    (!Array.isArray(block.children) || block.children.length === 0)
  );
}

function isDefaultParagraphProps(props: Record<string, unknown>) {
  return (
    props.backgroundColor === "default" &&
    props.textColor === "default" &&
    props.textAlignment === "left"
  );
}

function removeDefaultProps(
  props: Record<string, unknown>,
  defaults: Record<string, unknown>
) {
  Object.entries(defaults).forEach(([key, defaultValue]) => {
    // Keep schemaVersion even if it's the default
    if (key === "schemaVersion") return;
    if (props[key] === defaultValue) {
      delete props[key];
    }
  });
}

// Recursively strips undefined values while preserving structure.
// Used for structured (non-inline-array) block content such as the
// table block's `{ type: "tableContent", rows: [...] }` object, which
// was previously dropped entirely during sanitization.
function cleanStructuredContent(value: any): any {
  if (Array.isArray(value)) {
    return value.map((item) => cleanStructuredContent(item));
  }
  if (value && typeof value === "object") {
    const out: Record<string, any> = {};
    Object.entries(value).forEach(([key, val]) => {
      if (val !== undefined) {
        out[key] = cleanStructuredContent(val);
      }
    });
    return out;
  }
  return value;
}

export function cleanBlock(block: any): any | null {
  if (!block || typeof block !== "object") {
    return null;
  }

  if (isEmptyParagraph(block)) {
    return null;
  }

  const cleaned: Record<string, unknown> = {
    id: block.id,
    type: block.type,
  };

  if (block.props && typeof block.props === "object") {
    const props = { ...block.props };

    // Inject schemaVersion into custom blocks
    if (["stat", "statsGroup", "button"].includes(block.type)) {
      props.schemaVersion = 1;
    }

    if (block.type === "paragraph" && isDefaultParagraphProps(props)) {
      delete props.backgroundColor;
      delete props.textColor;
      delete props.textAlignment;
    }

    if (block.type === "stat") {
      removeDefaultProps(props, DEFAULTS.stat);
    }

    if (block.type === "statsGroup") {
      removeDefaultProps(props, DEFAULTS.statsGroup);
    }

    if (block.type === "button") {
      removeDefaultProps(props, DEFAULTS.button);
    }

    if (Object.keys(props).length > 0) {
      cleaned.props = props;
    }
  } else if (["stat", "statsGroup", "button"].includes(block.type)) {
    // Inject props with version if it was somehow missing entirely
    cleaned.props = { schemaVersion: 1 };
  }

  if (Array.isArray(block.content) && block.content.length > 0) {
    // Clean text inline nodes
    cleaned.content = block.content.map((item: any) => {
      if (item && typeof item === "object") {
        const cleanedItem: Record<string, any> = { ...item };
        // Clean undefined values
        Object.keys(cleanedItem).forEach(key => {
          if (cleanedItem[key] === undefined) {
            delete cleanedItem[key];
          }
        });
        return cleanedItem;
      }
      return item;
    });
  } else if (block.content && typeof block.content === "object") {
    // Preserve structured content objects (e.g. tables) instead of dropping them
    cleaned.content = cleanStructuredContent(block.content);
  }

  if (Array.isArray(block.children) && block.children.length > 0) {
    const children = block.children
      .map((child: any) => cleanBlock(child))
      .filter(Boolean);

    if (children.length > 0) {
      cleaned.children = children;
    }
  }

  return cleaned;
}

export function sanitizeBlockNoteDocument(blocks: any[]): any[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.map((block) => cleanBlock(block)).filter(Boolean);
}
