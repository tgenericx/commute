import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/graphql/graphql";
import { useNavigate } from "react-router-dom";
import { useSheetManager } from "@/contexts/sheet-manager";
import { Button } from "../ui/button";

export interface UserAvatarProps {
  user: Pick<User, "id" | "name" | "username" | "avatar">;
  size?: "sm" | "md" | "lg" | number;
  className?: string;
  viewMode?: "navigate" | "preview";
  onClick?: (user: UserAvatarProps["user"]) => void;
}

export function UserAvatar({
  user,
  size = "md",
  className,
  viewMode = "preview",
  onClick,
}: UserAvatarProps) {
  const { id, name = "", avatar, username } = user;
  const navigate = useNavigate();
  const { openSheet } = useSheetManager();

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

    if (viewMode === "navigate") navigate(`/user/${id}`);
    else openSheet("user-preview", { id });
  };

  const getInitials = (fullname: string) =>
    fullname
      ? fullname
          .split(" ")
          .filter(Boolean)
          .map((part) => part[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "";

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
