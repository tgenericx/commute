import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/graphql/graphql";
import { useNavigate } from "react-router-dom";
import { useUserPreviewSheet } from "@/contexts/user-preview-sheet";
import { Button } from "../ui/button";

export interface UserAvatarProps {
  /** GraphQL User object */
  user: Pick<User, "id" | "name" | "username" | "avatar">;

  /** Size of the avatar (default: "md") */
  size?: "sm" | "md" | "lg" | number;

  /** Optional className override */
  className?: string;

  /**
   * Determines how profile should be shown when clicked.
   * - "navigate": go to `/profile/:username`
   * - "preview": open bottom sheet preview
   */
  viewMode?: "navigate" | "preview";

  /** Optional callback when avatar is clicked */
  onClick?: (user: UserAvatarProps["user"]) => void;
}

export function UserAvatar({
  user,
  size = "md",
  className,
  viewMode = "preview",
  onClick,
}: UserAvatarProps) {
  const { name = "", avatar, username } = user;
  const navigate = useNavigate();
  const { openSheet } = useUserPreviewSheet();

  const dimension =
    typeof size === "number"
      ? size
      : size === "sm"
        ? 32
        : size === "lg"
          ? 56
          : 40;

  const handleActivate = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();

    onClick?.(user);

    if (viewMode === "navigate") {
      navigate(`/profile/${username}`);
    } else {
      openSheet({ id: user.id });
    }
  };

  const getInitials = (fullname: string) => {
    if (!fullname) return "";
    return fullname
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Button
      type="button"
      onClick={handleActivate}
      className={cn(
        "relative cursor-pointer transition-transform hover:scale-105 active:scale-95 p-0 border-none bg-transparent",
        className,
      )}
      style={{ width: dimension, height: dimension }}
      aria-label={
        name ? `View ${name}'s profile` : `View @${username}'s profile`
      }
      title={name || `@${username}`}
    >
      <Avatar className="w-full h-full border-2 border-background">
        <AvatarImage
          src={avatar ?? undefined}
          alt={name || `@${username}`}
          className="object-cover"
        />
        <AvatarFallback className="bg-muted text-foreground">
          {name ? (
            <span className="text-xs font-medium">{getInitials(name)}</span>
          ) : (
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </AvatarFallback>
      </Avatar>
    </Button>
  );
}
