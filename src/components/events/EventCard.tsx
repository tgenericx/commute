import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { EventListItem } from "./EventsGrid";

interface EventCardProps {
  event: EventListItem;
  onViewDetails?: (event: EventListItem) => void;
}

export const EventCard = ({ event, onViewDetails }: EventCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500" />
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{event.status}</Badge>
          {event.category && (
            <Badge variant="outline">{event.category.name}</Badge>
          )}
        </div>

        <CardTitle className="text-lg mb-2">{event.title}</CardTitle>

        {event.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        <EventDetails event={event} />

        {onViewDetails && (
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onViewDetails(event)}
            >
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EventDetails = ({ event }: { event: EventListItem }) => (
  <div className="space-y-2 text-sm text-muted-foreground">
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4" />
      {format(new Date(event.startTime), "MMM dd, yyyy")}
    </div>
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4" />
      {format(new Date(event.startTime), "h:mm a")} -{" "}
      {format(new Date(event.endTime), "h:mm a")}
    </div>
    {event.location && (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        {event.location}
      </div>
    )}
    <div className="flex items-center gap-2">
      <Users className="w-4 h-4" />
      {event.organizers?.length || 0} organizer
      {event.organizers?.length !== 1 ? "s" : ""}
    </div>
  </div>
);
