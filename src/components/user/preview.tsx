import { FC } from "react";
import { useQuery } from "@apollo/client/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./avatar";
import { GetUserProfileDocument } from "@/graphql/graphql";
import { useRegisterSheet } from "@/hooks/use-register-sheet";

export const UserPreviewSheet: FC = () => {
  useRegisterSheet("user-preview", ({ data, close }) => {
    const userId = data?.id as string | undefined;

    const { data: queryData, loading } = useQuery(GetUserProfileDocument, {
      variables: { id: userId || "" },
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
      <div className="p-6">
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

        {bio && (
          <div className="mb-6">
            <p className="text-sm text-foreground leading-relaxed">{bio}</p>
          </div>
        )}

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

        <div className="flex gap-3">
          <Button variant="default" size="sm" className="flex-1">
            Follow
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={close}
          >
            View Profile
          </Button>
        </div>
      </div>
    );
  });

  return null;
};
