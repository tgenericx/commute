import { type User } from "@/graphql/graphql"

export type UserProfileCardData = Pick<
  User,
  "id" | "avatar" | "name" | "username" | "bio" | "_count"
> & {
  isFollowing?: boolean
  bannerUrl?: string
}

export interface UserProfileCardProps {
  name: string
  username: string
  avatarUrl?: string
  bannerUrl?: string
  bio?: string
  followers?: number
  following?: number
  posts?: number
  isFollowing?: boolean
  onFollow?: () => void
  onMessage?: () => void
}

