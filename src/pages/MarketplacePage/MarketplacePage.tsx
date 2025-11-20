import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, MapPin } from "lucide-react";

export const MarketplacePage = () => {
  const listings = [
    {
      id: 1,
      title: "Vintage Camera",
      price: 120,
      location: "Downtown",
      rating: 4.8,
      reviews: 24,
      image: "/api/placeholder/300/200",
      category: "Electronics",
    },
    {
      id: 2,
      title: "Mountain Bike",
      price: 350,
      location: "Westside",
      rating: 4.5,
      reviews: 12,
      image: "/api/placeholder/300/200",
      category: "Sports",
    },
    {
      id: 3,
      title: "Designer Watch",
      price: 200,
      location: "Uptown",
      rating: 4.9,
      reviews: 31,
      image: "/api/placeholder/300/200",
      category: "Fashion",
    },
  ];

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">
              Buy and sell within your community
            </p>
          </div>
          <Button>
            <ShoppingBag className="w-4 h-4 mr-2" />
            Sell Item
          </Button>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {["All", "Electronics", "Fashion", "Home", "Sports", "Books"].map(
            (category) => (
              <Button
                key={category}
                variant="outline"
                className="h-16 flex-col"
              >
                <div className="text-lg">{getCategoryEmoji(category)}</div>
                <div className="text-xs">{category}</div>
              </Button>
            ),
          )}
        </div>

        {/* Listings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="h-48 bg-linear-to-br from-green-400 to-blue-500" />
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="text-2xl font-bold text-green-600">
                    ${item.price}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {item.rating} ({item.reviews})
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  {item.location}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Buy Now
                  </Button>
                  <Button size="sm" variant="outline">
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

function getCategoryEmoji(category: string) {
  const emojis: Record<string, string> = {
    All: "🛍️",
    Electronics: "📱",
    Fashion: "👕",
    Home: "🏠",
    Sports: "⚽",
    Books: "📚",
  };
  return emojis[category] || "📦";
}
