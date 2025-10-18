import React from 'react';
import { UpcomingEventsQuery } from '../graphql/graphql';

type Event = UpcomingEventsQuery['events'][number];

const EventCard: React.FC<{ event: Event }> = ({ event }) => (
  <div
    style={{
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: '1rem',
      background: '#fff',
      minWidth: 200,
    }}
  >
    <div style={{ fontWeight: 600 }}>{event.title}</div>
    <div style={{ fontSize: 12, opacity: 0.7 }}>{event.startTime}</div>
  </div>
);

export default EventCard;
