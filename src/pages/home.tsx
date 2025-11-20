import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Heart,
  Share,
  MoreHorizontal,
  Users,
  Calendar,
} from "lucide-react";

export const SocialPage = () => {
  const posts = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/40/40",
        initial: "SJ",
        isEventOrganizer: true,
      },
      content:
        "🚀 Just announced: AI & Machine Learning Summit next month! Early bird tickets are now available. This is going to be our biggest event yet with speakers from Google, OpenAI, and more!",
      time: "2 hours ago",
      likes: 24,
      comments: 8,
      shares: 3,
      event: {
        title: "AI & Machine Learning Summit",
        date: "2024-02-15",
        attendees: 320,
      },
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        avatar: "/api/placeholder/40/40",
        initial: "MC",
      },
      content:
        "Looking for React developers interested in collaborating on a community project! We're building an open-source event management tool. DM me if you'd like to join the team! 💻",
      time: "5 hours ago",
      likes: 12,
      comments: 15,
      shares: 2,
      tags: ["React", "OpenSource", "Collaboration"],
    },
    {
      id: 3,
      user: {
        name: "Community Events",
        avatar: "/api/placeholder/40/40",
        initial: "CE",
        isOfficial: true,
      },
      content:
        "🎉 Don't forget about our monthly community meetup this Friday! We'll have food, drinks, and great conversations about the future of our platform. Special guest speaker from the development team!",
      time: "1 day ago",
      likes: 45,
      comments: 12,
      shares: 8,
      event: {
        title: "Monthly Community Meetup",
        date: "2024-01-19",
        attendees: 85,
      },
    },
  ];

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Welcome Header */}
        <Card className="bg-linear-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Community Feed</h1>
            <p className="opacity-90">
              Connect, share, and discover with your community
            </p>
          </CardContent>
        </Card>

        {/* Create Post */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src="/api/placeholder/40/40" />
                <AvatarFallback>YU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  Share what's happening in the community...
                </Button>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="ghost" size="sm" className="flex-1">
                📷 Photo
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                🎉 Event
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                💬 Poll
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback>{post.user.initial}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{post.user.name}</span>
                      {post.user.isEventOrganizer && (
                        <Badge variant="secondary" className="text-xs">
                          Event Organizer
                        </Badge>
                      )}
                      {post.user.isOfficial && (
                        <Badge
                          variant="default"
                          className="text-xs bg-blue-500"
                        >
                          Official
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {post.time}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="whitespace-pre-line">{post.content}</p>

                {/* Event Card */}
                {post.event && (
                  <Card className="mt-3 border-l-4 border-l-blue-500">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">
                            {post.event.title}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(post.event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {post.event.attendees} attending
                            </div>
                          </div>
                        </div>
                        <Button size="sm">RSVP</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tags */}
                {post.tags && (
                  <div className="flex gap-2 mt-3">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-4">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex border-t pt-3">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
