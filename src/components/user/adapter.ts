import { UserProfileCardData } from "./types";

export function adaptUserToProfileCard(user: UserProfileCardData) {
  return {
    name: user.name ?? user.username,
    username: user.username,
    avatarUrl: user.avatar ?? undefined,
    bio: user.bio ?? undefined,
    followers: user._count?.followers ?? 0,
    following: user._count?.following ?? 0,
    posts: user._count?.posts ?? 0,
    bannerUrl: user.bannerUrl ?? undefined,
    isFollowing: user.isFollowing ?? false,
  }
}
