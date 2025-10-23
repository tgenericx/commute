import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserProfileCardProps } from "./types"

export function UserProfileCard({
  name,
  username,
  avatarUrl,
  bannerUrl,
  bio,
  followers,
  following,
  posts,
  isFollowing,
  onFollow,
  onMessage,
}: UserProfileCardProps) {
  return (
    <Card className="w-full max-w-md overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all">
      {/* Banner */}
      <div className="relative h-32 bg-muted">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={`${name}'s banner`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-primary/20 to-primary/10" />
        )}

        {/* Avatar overlay */}
        <div className="absolute -bottom-10 left-6">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* User info */}
      <CardHeader className="mt-12 px-6 pb-2">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-sm text-muted-foreground">@{username}</p>
      </CardHeader>

      {bio && (
        <CardContent className="px-6 pb-2">
          <p className="text-sm text-muted-foreground">{bio}</p>
        </CardContent>
      )}

      {/* Stats */}
      {(followers || following || posts) && (
        <CardContent className="px-6 pb-4">
          <div className="flex gap-6 text-sm text-muted-foreground">
            {followers !== undefined && (
              <div>
                <span className="font-semibold text-foreground">{followers}</span>{" "}
                Followers
              </div>
            )}
            {following !== undefined && (
              <div>
                <span className="font-semibold text-foreground">{following}</span>{" "}
                Following
              </div>
            )}
            {posts !== undefined && (
              <div>
                <span className="font-semibold text-foreground">{posts}</span>{" "}
                Posts
              </div>
            )}
          </div>
        </CardContent>
      )}

      {/* Actions */}
      <CardFooter className="flex justify-between gap-3 px-6 pb-6">
        <Button
          variant={isFollowing ? "secondary" : "default"}
          onClick={onFollow}
          className="flex-1"
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
        <Button variant="outline" onClick={onMessage} className="flex-1">
          Message
        </Button>
      </CardFooter>
    </Card>
  )
}
