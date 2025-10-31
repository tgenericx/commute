import { FC } from "react";
import { useQuery } from "@apollo/client/react";
import { Loader2, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./avatar";
import { GetUserProfileDocument } from "@/graphql/graphql";
import { useRegisterSheet } from "@/hooks/use-register-sheet";

const UserPreviewContent: FC<{ userId: string; onClose: () => void }> = ({ 
  userId, 
  onClose 
}) => {
  const { data: queryData, loading } = useQuery(GetUserProfileDocument, {
    variables: { id: userId },
    skip: !userId,
  });

  const user = queryData?.user;
  const { name, username, bio, _count, campusProfile } = user ?? {};
  const followers = _count?.followers;
  const posts = _count?.posts;
  const department = campusProfile?.department?.code;
  const level = campusProfile?.level;

  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );

  if (!user) return null;

  return (
    <div className="w-full bg-background border rounded-lg">
      {/* Options button in top-right corner */}
      <div className="flex justify-end p-4 pb-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full"
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Centered content */}
      <div className="flex flex-col items-center px-6 pb-6">
        {/* Avatar */}
        <UserAvatar 
          user={user} 
          size={96} 
          className="mb-4"
        />

        {/* Name and verification */}
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-semibold text-foreground truncate">
            {name}
          </h2>
        </div>

        {/* Username */}
        <p className="text-sm text-muted-foreground mb-2">
          @{username}
        </p>

        {/* Department and level */}
        {(department || level) && (
          <p className="text-sm text-muted-foreground mb-4">
            {department}
            {department && level ? " • " : ""}
            {level}
          </p>
        )}

        {/* Bio */}
        {bio && (
          <div className="mb-6 text-center">
            <p className="text-sm text-foreground leading-relaxed">{bio}</p>
          </div>
        )}

        {/* Stats */}
        {(followers !== undefined || posts !== undefined) && (
          <div className="flex gap-8 mb-6">
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

        {/* Action buttons */}
        <div className="flex gap-3 w-full max-w-xs">
          <Button variant="default" size="sm" className="flex-1">
            Follow
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export const UserPreviewSheet: FC = () => {
  useRegisterSheet("user-preview", (props, onClose) => {
    const userId = props.id as string | undefined;
    
    if (!userId) return null;
    
    return <UserPreviewContent userId={userId} onClose={onClose} />;
  });

  return null;
};
