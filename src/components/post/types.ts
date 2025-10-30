import { Media, PostMedia } from "@/graphql/graphql";

export const adaptPostMedia = (postMedia?: (PostMedia | null)[]): Media[] =>
  (postMedia ?? [])
    .filter((pm): pm is PostMedia & { media: Media } => !!pm?.media)
    .map(({ media }) => media);

export interface BaseActionProps {
  count?: number;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}
