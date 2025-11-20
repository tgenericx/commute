import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, TrendingUp } from "lucide-react";

export const DiscoverPage = () => {
  const trendingEvents = [
    {
      id: 1,
      title: "AI & Machine Learning Summit",
      category: "Technology",
      attendees: 320,
      location: "Tech Convention Center",
      trending: true
    },
    {
      id: 2,
      title: "Local Food Festival",
      category: "Food & Drink",
      attendees: 180,
      location: "Downtown Park",
      trending: true
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      category: "Business",
      attendees: 150,
      location: "Innovation Hub"
    },
  ];

  const popularCategories = [
    { name: "Technology", count: "45 events", emoji: "💻" },
    { name: "Networking", count: "32 events", emoji: "🤝" },
    { name: "Workshops", count: "28 events", emoji: "🎓" },
    { name: "Social Mixers", count: "25 events", emoji: "🎉" },
    { name: "Arts & Culture", count: "22 events", emoji: "🎨" },
    { name: "Sports & Fitness", count: "18 events", emoji: "⚽" },
  ];

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Search Header */}
        <Card className="bg-linear-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Discover Amazing Events</h1>
              <p className="opacity-90 mb-4">Find your next adventure in the community</p>
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search events, categories, or locations..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trending Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Trending Events
                </CardTitle>
                <CardDescription>Most popular events in your area</CardDescription>
              </div>
              <Button variant="outline">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {trendingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      {event.trending && (
                        <Badge variant="default" className="bg-orange-500">Trending</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="secondary">{event.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.attendees} attending
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <Button>View Event</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Browse Categories</CardTitle>
            <CardDescription>Find events by your interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {popularCategories.map((category) => (
                <Button
                  key={category.name}
                  variant="outline"
                  className="h-20 flex-col items-start p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-2xl">{category.emoji}</span>
                    <div className="text-left">
                      <div className="font-semibold">{category.name}</div>
                      <div className="text-xs text-muted-foreground">{category.count}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Communities */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Communities</CardTitle>
            <CardDescription>Join groups with similar interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Tech Enthusiasts", members: "2.4k", emoji: "💻", description: "For technology lovers and professionals" },
                { name: "Foodies United", members: "1.8k", emoji: "🍕", description: "Share recipes and restaurant reviews" },
                { name: "Startup Founders", members: "956", emoji: "🚀", description: "Network with fellow entrepreneurs" },
                { name: "Art & Design", members: "1.2k", emoji: "🎨", description: "Creative minds and art lovers" },
              ].map((community) => (
                <div key={community.name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="text-3xl">{community.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{community.name}</div>
                    <div className="text-sm text-muted-foreground">{community.members} members</div>
                    <div className="text-xs text-muted-foreground mt-1">{community.description}</div>
                  </div>
                  <Button size="sm">Join</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
