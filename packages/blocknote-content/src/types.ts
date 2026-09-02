export interface StatItem {
  number: string;
  label: string;
}

export type BlockNoteContent = Block[];

export interface Block {
  id: string;
  type: string;
  props?: Record<string, any>;
  content?: InlineContent[];
  children?: Block[];
}

export interface InlineContent {
  type: "text" | "link";
  text?: string;
  href?: string;
  styles?: Record<string, any>;
}
