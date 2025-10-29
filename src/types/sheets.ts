import { SheetKey, SheetRenderFn } from "@/contexts/sheet-manager";

export interface SheetPropsMap {
  auth: { page?: "signin" | "signup" };
  "media-lightbox": { media: any[]; startIndex?: number };
  "user-preview": { id: string };
  "create-post": { parentId?: string; mention?: string };
  "create-event": void;
  "create-listing": void;
}

export type SheetProps<K extends SheetKey> = Parameters<SheetRenderFn<K>>[0];
