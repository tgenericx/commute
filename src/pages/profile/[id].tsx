import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GetUserProfileDocument } from "@/graphql/graphql";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { UserAvatar } from "@/components/user/avatar";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useQuery(GetUserProfileDocument, {
    variables: { id: id! },
    skip: !id,
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error.message}
      </div>
    );

  if (!data?.user)
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        User not found
      </div>
    );

  const { user } = data;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card className="p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-6">
          <UserAvatar
            user={{
              id: user.id,
              name: user.name,
              username: user.username,
              avatar: user.avatar,
            }}
          />

          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
          </div>
        </div>

        {user.campusProfile && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              {user.campusProfile.faculty?.name} •{" "}
              {user.campusProfile.department?.name} (
              {user.campusProfile.department?.code})
            </p>
            <p>Level: {user.campusProfile.level ?? "N/A"}</p>
          </div>
        )}

        <div className="mt-6 flex justify-around text-center text-sm">
          <div>
            <p className="font-semibold">{user._count.followers}</p>
            <p className="text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="font-semibold">{user._count.following}</p>
            <p className="text-muted-foreground">Following</p>
          </div>
          <div>
            <p className="font-semibold">{user._count.posts}</p>
            <p className="text-muted-foreground">Posts</p>
          </div>
        </div>
      </Card>

      {/* POSTS */}
      <div className="space-y-4">
        {user.posts?.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <p>{post.textContent}</p>
              {post.postMedia?.length ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {post.postMedia.map((pm) => (
                    <img
                      key={pm.media.id}
                      src={pm.media.secureUrl}
                      alt=""
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              ) : null}
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
