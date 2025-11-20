import { useQuery, useMutation } from "@apollo/client/react";
import {
  GetEventsDocument,
  GetEventsQuery,
  GetEventsQueryVariables,
  CreateEventDocument,
  CreateEventMutation,
  CreateEventMutationVariables,
  UpdateEventDocument,
  DeleteEventDocument,
  EventStatus,
} from "@/graphql/graphql";

export const useEvents = (filters?: {
  status?: EventStatus;
  isPublic?: boolean;
}) => {
  const { data, loading, error, refetch } = useQuery<
    GetEventsQuery,
    GetEventsQueryVariables
  >(GetEventsDocument, {
    variables: {
      filter: {
        status: filters?.status,
        isPublic: filters?.isPublic,
      },
      pagination: {
        take: 20,
        skip: 0,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    events: data?.events || [],
    loading,
    error,
    refetch,
  };
};

export const useCreateEvent = () => {
  const [mutate, { loading, error }] = useMutation<
    CreateEventMutation,
    CreateEventMutationVariables
  >(CreateEventDocument);

  const createEvent = async (variables: CreateEventMutationVariables) => {
    return await mutate({ variables });
  };

  return {
    createEvent,
    loading,
    error,
  };
};

export const useUpdateEvent = () => {
  const [mutate, { loading, error }] = useMutation(UpdateEventDocument);
  return { updateEvent: mutate, loading, error };
};

export const useDeleteEvent = () => {
  const [mutate, { loading, error }] = useMutation(DeleteEventDocument);
  return { deleteEvent: mutate, loading, error };
};
