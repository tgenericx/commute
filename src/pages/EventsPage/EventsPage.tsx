import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateEventForm } from "@/components/events/CreateEventForm";
import { EventFilters } from "@/components/events/EventFilters";
import { EventListItem, EventsGrid } from "@/components/events/EventsGrid";
import { useEvents } from "@/hooks/events/useEvents";
import { EventStatus } from "@/graphql/graphql";
import { toast } from "sonner";

export const EventsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<EventStatus | undefined>(
    EventStatus.Published,
  );

  const { events, loading, error, refetch } = useEvents({
    status: statusFilter,
    isPublic: true,
  });

  const handleCreateSuccess = () => {
    refetch();
    setIsCreateModalOpen(false);
    toast.success("Event created successfully!");
  };

  const handleEventClick = (event: EventListItem) => {
    // Navigate to event details page
    console.log("View event details:", event.id);
    toast.message("coming soon!");
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <Header onCreateEvent={() => setIsCreateModalOpen(true)} />

        <EventFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <ErrorState error={error} onRetry={refetch} />

        <EventsGrid
          events={events}
          loading={loading}
          onEventClick={handleEventClick}
        />

        <CreateEventForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
};

const Header = ({ onCreateEvent }: { onCreateEvent: () => void }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h1 className="text-3xl font-bold">Events</h1>
      <p className="text-muted-foreground">
        Discover and join amazing events in your community
      </p>
    </div>
    <Button onClick={onCreateEvent}>
      <Plus className="w-4 h-4 mr-2" />
      Create Event
    </Button>
  </div>
);

const ErrorState = ({
  error,
  onRetry,
}: {
  error?: Error;
  onRetry: () => void;
}) => {
  if (!error) return null;

  return (
    <div className="text-center py-12">
      <p className="text-destructive">Failed to load events</p>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
        Try Again
      </Button>
    </div>
  );
};
