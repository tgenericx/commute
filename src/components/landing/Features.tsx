import {
  Calendar,
  MapPin,
  MessageSquare,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Calendar,
    title: "Events, simplified",
    description:
      "Find or create events in seconds. No more scattered WhatsApp groups or random flyers.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "Buy, sell, and trade within your community. A secure marketplace that connects buyers and sellers with easy listings, payments, and reviews.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: MapPin,
    title: "Venues, organized",
    description:
      "Know what's available, what's booked, and what fits your needs.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Sparkles,
    title: "Personalized experience",
    description: "See what matters most to you. Your campus, your way.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: MessageSquare,
    title: "Social engagement",
    description:
      "Posts, reactions, and discussions to keep the community buzzing.",
    gradient: "from-green-500 to-emerald-500",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What It Does
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stay connected with your campus community,
            all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={cn(
                  "p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-fade-in",
                  "bg-card hover:bg-card/80",
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl bg-linear-to-br flex items-center justify-center mb-6",
                      feature.gradient,
                    )}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
