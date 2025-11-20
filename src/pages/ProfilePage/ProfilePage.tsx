import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, Edit, Calendar, ShoppingBag, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  const userStats = [
    { label: "Events Attended", value: "12", icon: Calendar },
    { label: "Items Sold", value: "8", icon: ShoppingBag },
    { label: "Friends", value: "156", icon: Users },
  ];

  const recentActivity = [
    { action: "Registered for Tech Conference", time: "2 days ago" },
    { action: "Sold Vintage Camera", time: "1 week ago" },
    { action: "Posted in Community Group", time: "1 week ago" },
  ];

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/api/placeholder/96/96" />
                <AvatarFallback className="text-2xl">YU</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user?.email || 'Your Name'}</h1>
                  <Badge variant="secondary">Pro Member</Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  React Developer • Community Enthusiast • Event Organizer
                </p>
                <div className="flex gap-2 justify-center md:justify-start flex-wrap">
                  <Button>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {userStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions in the community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>My Events</CardTitle>
              <CardDescription>
                Events you're attending or hosting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="font-semibold">Tech Conference 2024</div>
                <div className="text-sm text-muted-foreground">
                  Jan 15, 2024 • Registered
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-semibold">React Workshop</div>
                <div className="text-sm text-muted-foreground">
                  Jan 25, 2024 • Hosting
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View All Events
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Marketplace Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Activity</CardTitle>
            <CardDescription>Your buying and selling history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold">Vintage Camera</div>
                  <div className="text-sm text-muted-foreground">
                    Sold • $120
                  </div>
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-semibold">Mountain Bike</div>
                  <div className="text-sm text-muted-foreground">
                    Listed • $350
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
