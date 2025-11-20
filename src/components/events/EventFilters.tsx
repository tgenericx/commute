import { Button } from "@/components/ui/button";
import { EventStatus } from "@/graphql/graphql";

interface EventFiltersProps {
  statusFilter: EventStatus | undefined;
  onStatusFilterChange: (status: EventStatus | undefined) => void;
}

export const EventFilters = ({
  statusFilter,
  onStatusFilterChange,
}: EventFiltersProps) => {
  const filters = [
    { label: "All Events", value: undefined },
    { label: "Published", value: EventStatus.Published },
    { label: "Draft", value: EventStatus.Draft },
    { label: "Completed", value: EventStatus.Completed },
  ];

  return (
    <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <Button
          key={filter.label}
          variant={statusFilter === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusFilterChange(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
