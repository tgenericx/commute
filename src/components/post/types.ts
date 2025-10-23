import { Post, User } from "@/graphql/graphql"

export type AdaptedPost = Pick<Post, "id" | "textContent" | "createdAt" | "_count" | "postMedia"> & {
  author: Pick<User, "id" | "username" | "name" | "avatar">
}
