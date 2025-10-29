export interface SheetPropsMap {
  auth: { page?: "signin" | "signup" };
  "media-lightbox": { media: any[]; startIndex?: number };
  "user-preview": { id: string };
  "create-post": void;
  "create-event": {};
  "create-listing": {};
}
