import type { SheetKey, SheetRenderFn } from "@/contexts/sheet-manager";
import type { Post } from "@/graphql/graphql";

export interface SheetPropsMap {
  auth: { page?: "signin" | "signup" };
  "media-lightbox": { media: any[]; startIndex?: number };
  "user-preview": { id: string };
  "create-post": { parentId?: string; mention?: string };
  "create-event": void;
  "create-listing": void;

  /**
   * Post view sheet: shows a single post and optionally a limited set of direct replies.
   * The Post passed here will be used as the "main" post. If `replies` is provided
   * it will be used to display only that subset of direct replies.
   */
  "post-view": { post: Post; replies?: Post[] };
}

export type SheetProps<K extends SheetKey> = Parameters<SheetRenderFn<K>>[0];
