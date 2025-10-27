import { FC } from "react";
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
} from "@/components/bottom-sheet";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useUserPreviewSheet } from "@/contexts/user-preview-sheet";
import { UserAvatar } from "./avatar";
import { useQuery } from "@apollo/client/react";
import { GetUserProfileDocument } from "@/graphql/graphql";

interface UserPreviewSheetProps {
  onFollow?: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
}

export const UserPreviewSheet: FC<UserPreviewSheetProps> = ({
  onFollow,
  onViewProfile,
}) => {
  const { open, userRef, closeSheet } = useUserPreviewSheet();

  const { data, loading, error } = useQuery(GetUserProfileDocument, {
    variables: { username: userRef?.username ?? "" },
    skip: !userRef?.username && !userRef?.id,
  });

  if (!open) return null;

  if (loading)
    return (
      <BottomSheet open={open} onClose={closeSheet}>
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
        </div>
      </BottomSheet>
    );

  if (error)
    return (
      <BottomSheet open={open} onClose={closeSheet}>
        <div className="py-8 text-center text-red-500">{error.message}</div>
      </BottomSheet>
    );

  const user = data?.user;
  if (!user)
    return (
      <BottomSheet open={open} onClose={closeSheet}>
        <div className="py-8 text-center text-muted-foreground">
          User not found.
        </div>
      </BottomSheet>
    );

  const { id, name, username, bio, _count, campusProfile } = user;
  const followers = _count?.followers;
  const posts = _count?.posts;
  const department = campusProfile?.department?.code;
  const level = campusProfile?.level;

  const handleFollow = () => onFollow?.(id);
  const handleViewProfile = () => {
    onViewProfile?.(id);
    closeSheet();
  };

  return (
    <BottomSheet open={open} onClose={closeSheet}>
      <BottomSheetBody>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <UserAvatar user={user} size={64} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-bold text-lg truncate">{name}</h2>
              <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground truncate mb-1">
              @{username}
            </p>
            {(department || level) && (
              <p className="text-xs text-muted-foreground">
                {department}
                {department && level ? " • " : ""}
                {level}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <div className="mb-6">
            <p className="text-sm text-foreground leading-relaxed">{bio}</p>
          </div>
        )}

        {/* Stats */}
        {(followers !== undefined || posts !== undefined) && (
          <div className="flex gap-6 mb-6">
            {followers !== undefined && (
              <div className="text-center">
                <div className="font-bold text-lg">
                  {followers.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {followers === 1 ? "Follower" : "Followers"}
                </div>
              </div>
            )}
            {posts !== undefined && (
              <div className="text-center">
                <div className="font-bold text-lg">
                  {posts.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {posts === 1 ? "Post" : "Posts"}
                </div>
              </div>
            )}
          </div>
        )}
      </BottomSheetBody>

      <BottomSheetFooter>
        <div className="flex gap-3">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={handleFollow}
          >
            Follow
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
        </div>
      </BottomSheetFooter>
    </BottomSheet>
  );
};
