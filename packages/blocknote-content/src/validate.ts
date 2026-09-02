import { z } from "zod";
import { LIMITS } from "./limits.js";
import { StatItem } from "./types.js";

// Safe URL protocol validator
export function isValidUrl(urlStr: string): boolean {
  if (!urlStr) return true;
  const clean = urlStr.trim().toLowerCase();

  // Explicitly reject unsafe schemes
  if (
    clean.startsWith("javascript:") ||
    clean.startsWith("data:") ||
    clean.startsWith("vbscript:")
  ) {
    return false;
  }

  try {
    const parsed = new URL(urlStr);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    // Allow relative paths or page anchor links
    return clean.startsWith("/") || clean.startsWith("#") || clean.startsWith(".") || clean === "";
  }
}

// Zod Schema for Stat Item inside statsGroup
export const StatItemSchema = z.object({
  number: z.string().max(100),
  label: z.string().max(200),
});

// Inline text / link content schema
export const InlineContentSchema = z.object({
  type: z.enum(["text", "link"]),
  text: z.string().max(LIMITS.MAX_TEXT_NODE_LENGTH).optional(),
  href: z.string().max(LIMITS.MAX_URL_LENGTH).optional().refine((val) => {
    if (!val) return true;
    return isValidUrl(val);
  }, { message: "Unsafe URL protocol detected. Only http/https are allowed." }),
  styles: z.record(z.any()).optional(),
});

// Props for 'stat' custom block
const StatBlockPropsSchema = z.object({
  schemaVersion: z.number().default(1),
  number: z.string().max(100).optional(),
  label: z.string().max(200).optional(),
  backgroundColor: z.string().max(50).optional(),
  numberColor: z.string().max(50).optional(),
  labelColor: z.string().max(50).optional(),
  borderColor: z.string().max(50).optional(),
  borderWidth: z.number().max(50).optional(),
  radius: z.number().max(200).optional(),
  shadow: z.string().max(50).optional(),
  width: z.number().max(2000).optional(),
  height: z.number().max(2000).optional(),
  alignment: z.enum(["start", "center", "end"]).optional(),
}).passthrough();

// Props for 'statsGroup' custom block
const StatsGroupBlockPropsSchema = z.object({
  schemaVersion: z.number().default(1),
  stats: z.string().refine((val) => {
    try {
      const parsed: unknown = JSON.parse(val);
      if (!Array.isArray(parsed)) return false;
      if (parsed.length > LIMITS.MAX_STATS_ITEMS) return false;
      return parsed.every((item: any) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.number === "string" &&
        typeof item.label === "string"
      );
    } catch {
      return false;
    }
  }, { message: "Invalid stats group array serialized string." }),
  direction: z.enum(["horizontal", "vertical"]).optional(),
  alignment: z.enum(["start", "center", "end"]).optional(),
  gap: z.number().max(500).optional(),
  backgroundColor: z.string().max(50).optional(),
  numberColor: z.string().max(50).optional(),
  labelColor: z.string().max(50).optional(),
  borderColor: z.string().max(50).optional(),
  borderWidth: z.number().max(50).optional(),
  radius: z.number().max(200).optional(),
  shadow: z.string().max(50).optional(),
  width: z.number().max(2000).optional(),
  height: z.number().max(2000).optional(),
}).passthrough();

// Props for 'button' custom block
const ButtonBlockPropsSchema = z.object({
  schemaVersion: z.number().default(1),
  text: z.string().max(LIMITS.MAX_BUTTON_TEXT_LENGTH).optional(),
  url: z.string().max(LIMITS.MAX_URL_LENGTH).optional().refine((val) => {
    if (!val) return true;
    return isValidUrl(val);
  }, { message: "Unsafe button URL protocol. Only http/https are allowed." }),
  alignment: z.enum(["start", "center", "end"]).optional(),
  backgroundColor: z.string().max(50).optional(),
  textColor: z.string().max(50).optional(),
  hoverColor: z.string().max(50).optional(),
  borderColor: z.string().max(50).optional(),
  borderWidth: z.number().max(50).optional(),
  radius: z.number().max(200).optional(),
  shadow: z.string().max(50).optional(),
  width: z.number().max(2000).optional(),
  height: z.number().max(2000).optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  newTab: z.boolean().optional(),
}).passthrough();

// General Block Zod Schema with lazy child resolution for recursion
export const BlockSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.string(),
    props: z.record(z.any()).optional(),
    // `content` is an array of inline nodes for text blocks, but BlockNote
    // represents some blocks (e.g. `table`) with an OBJECT content shape
    // (`{ type: "tableContent", rows: [...] }`). Accept both so tables and
    // any future object-content block survive validation instead of failing
    // the whole document.
    content: z.union([z.array(InlineContentSchema), z.record(z.any())]).optional(),
    children: z.array(BlockSchema).optional(),
  }).superRefine((val, ctx) => {
    // Validate custom block properties strictly
    if (val.type === "stat" && val.props) {
      const result = StatBlockPropsSchema.safeParse(val.props);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid stat block properties: ${result.error.message}`,
        });
      }
    } else if (val.type === "statsGroup" && val.props) {
      const result = StatsGroupBlockPropsSchema.safeParse(val.props);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid statsGroup properties: ${result.error.message}`,
        });
      }
    } else if (val.type === "button" && val.props) {
      const result = ButtonBlockPropsSchema.safeParse(val.props);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid button properties: ${result.error.message}`,
        });
      }
    }
  })
);

export const DocumentSchema = z.array(BlockSchema);

// Deep validation function that checks depth and block counts
export function validateBlockNoteContent(value: unknown): { success: boolean; error?: string } {
  // 1. Root structure validation
  if (!Array.isArray(value)) {
    return { success: false, error: "Root content must be a JSON array." };
  }

  // 2. Serialized payload size check
  try {
    const payloadStr = JSON.stringify(value);
    const payloadBytes = new TextEncoder().encode(payloadStr).length;
    const maxBytes = LIMITS.MAX_SERIALIZED_PAYLOAD_SIZE_MB * 1024 * 1024;
    if (payloadBytes > maxBytes) {
      return { success: false, error: `Document exceeds maximum allowed size of ${LIMITS.MAX_SERIALIZED_PAYLOAD_SIZE_MB}MB.` };
    }
  } catch {
    return { success: false, error: "Content is not JSON serializable." };
  }

  // 3. Count blocks and check depth recursively
  let blockCount = 0;
  function traverse(blocks: any[], depth: number): { success: boolean; error?: string } {
    if (depth > LIMITS.MAX_NESTED_DEPTH) {
      return { success: false, error: `Document exceeds maximum nested depth of ${LIMITS.MAX_NESTED_DEPTH}.` };
    }

    for (const block of blocks) {
      blockCount++;
      if (blockCount > LIMITS.MAX_TOTAL_BLOCKS) {
        return { success: false, error: `Document exceeds maximum block limit of ${LIMITS.MAX_TOTAL_BLOCKS}.` };
      }

      if (block.children && Array.isArray(block.children) && block.children.length > 0) {
        const childRes = traverse(block.children, depth + 1);
        if (!childRes.success) return childRes;
      }
    }

    return { success: true };
  }

  const traversalRes = traverse(value, 1);
  if (!traversalRes.success) return traversalRes;

  // 4. Run full Zod schema validation
  const parseRes = DocumentSchema.safeParse(value);
  if (!parseRes.success) {
    return { success: false, error: parseRes.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join("; ") };
  }

  return { success: true };
}
