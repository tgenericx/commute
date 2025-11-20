import { EventCard } from "./EventCard";
import { Calendar } from "lucide-react";
import { GetEventsQuery } from "@/graphql/graphql";

export type EventListItem = GetEventsQuery["events"][number];

interface EventsGridProps {
  events: EventListItem[];
  loading?: boolean;
  onEventClick?: (event: EventListItem) => void;
}

export const EventsGrid = ({
  events,
  loading,
  onEventClick,
}: EventsGridProps) => {
  if (loading) {
    return <EventsLoading />;
  }

  if (events.length === 0) {
    return <EmptyEventsState />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onViewDetails={onEventClick} />
      ))}
    </div>
  );
};

const EventsLoading = () => (
  <div className="text-center py-12">
    <p className="text-muted-foreground">Loading events...</p>
  </div>
);

const EmptyEventsState = () => (
  <div className="text-center py-12">
    <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
    <h3 className="text-xl font-semibold mb-2">No events found</h3>
    <p className="text-muted-foreground mb-4">
      Be the first to create an event!
    </p>
  </div>
);
