import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { PostMediaGrid, Lightbox } from "@/components/media";
import { samplePosts, Post } from "./sample-posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PostCard: React.FC<{ post: Post; maxMediaDisplay: number }> = ({
  post,
  maxMediaDisplay,
}) => {
  const [liked, setLiked] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [likeCount, setLikeCount] = useState(128);

  const handleMediaClick = (index: number) => {
    setLightboxIndex(index);
  };

  const handleViewAll = () => {
    setLightboxIndex(0);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full border-2 border-slate-700"
          />
          <div>
            <h3 className="font-semibold text-white text-lg">
              {post.author.name}
            </h3>
            <p className="text-sm text-slate-400">
              {post.author.username} • {post.timestamp}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <CardContent className="px-6 pb-4">
        <p className="text-white text-lg leading-relaxed">{post.content}</p>
      </CardContent>

      {/* Media Grid */}
      {post.media.length > 0 && (
        <div className="px-6 pb-4">
          <PostMediaGrid
            media={post.media}
            maxDisplay={maxMediaDisplay}
            onMediaClick={handleMediaClick}
            onViewAll={handleViewAll}
            className="rounded-xl"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between p-6 pt-4 border-t border-slate-800">
        <button
          onClick={handleLike}
          className={`flex items-center gap-3 transition-all ${
            liked ? "text-red-500" : "text-slate-400 hover:text-red-500"
          }`}
        >
          <Heart className="h-6 w-6" fill={liked ? "currentColor" : "none"} />
          <span className="font-medium">{likeCount}</span>
        </button>

        <button className="flex items-center gap-3 text-slate-400 hover:text-blue-500 transition-colors">
          <MessageCircle className="h-6 w-6" />
          <span className="font-medium">24</span>
        </button>

        <button className="flex items-center gap-3 text-slate-400 hover:text-green-500 transition-colors">
          <Share2 className="h-6 w-6" />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          media={post.media}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((prev) =>
              Math.min(prev! + 1, post.media.length - 1),
            )
          }
          onPrev={() => setLightboxIndex((prev) => Math.max(prev! - 1, 0))}
        />
      )}
    </Card>
  );
};

export const SocialMediaApp: React.FC = () => {
  const [maxDisplay, setMaxDisplay] = useState(4);
  const [activeTab, setActiveTab] = useState("all");

  const filteredPosts =
    activeTab === "all"
      ? samplePosts
      : samplePosts.filter((post) =>
          post.media.some((media) =>
            activeTab === "images"
              ? media.type === "image"
              : media.type === "video",
          ),
        );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Social Feed</h1>
          <p className="text-slate-400">
            Discover amazing content from our community
          </p>
        </div>

        {/* Controls */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Display Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">
                Media per post:
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    onClick={() => setMaxDisplay(num)}
                    variant={maxDisplay === num ? "default" : "outline"}
                    size="sm"
                    className={
                      maxDisplay === num
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-slate-800"
                    }
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">
                Filter content:
              </label>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-slate-800">
                  <TabsTrigger value="all" className="text-xs">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="images" className="text-xs">
                    Images
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="text-xs">
                    Videos
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} maxMediaDisplay={maxDisplay} />
          ))}
        </div>

        {/* Stats */}
        <Card className="bg-slate-900 border-slate-800 text-center">
          <CardContent className="p-6">
            <p className="text-slate-400">
              Showing {filteredPosts.length} of {samplePosts.length} posts •{" "}
              {maxDisplay} media items per post
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialMediaApp;
