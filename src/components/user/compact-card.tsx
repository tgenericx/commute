import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UserCompactCardProps {
  name: string
  username: string
  avatarUrl?: string
  isFollowing?: boolean
  onFollow?: () => void
  onClick?: () => void
  showAction?: boolean
}

export function UserCompactCard({
  name,
  username,
  avatarUrl,
  isFollowing = false,
  onFollow,
  onClick,
  showAction = true,
}: UserCompactCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between w-full gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-tight">{name}</span>
          <span className="text-xs text-muted-foreground">@{username}</span>
        </div>
      </div>

      {showAction && (
        <Button
          variant={isFollowing ? "secondary" : "outline"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onFollow?.()
          }}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      )}
    </div>
  )
}
