import { useQuery, useMutation } from "@apollo/client/react";
import {
  GetEventsDocument,
  GetEventsQuery,
  GetEventsQueryVariables,
  GetEventDocument,
  GetEventQuery,
  GetEventQueryVariables,
  GetMyEventsDocument,
  GetMyEventsQuery,
  GetMyEventsQueryVariables,
  CreateEventDocument,
  CreateEventMutation,
  CreateEventMutationVariables,
  UpdateEventDocument,
  UpdateEventMutation,
  UpdateEventMutationVariables,
  UpdateEventStatusDocument,
  UpdateEventStatusMutation,
  UpdateEventStatusMutationVariables,
  DeleteEventDocument,
  DeleteEventMutation,
  DeleteEventMutationVariables,
  EventFilterInput,
  PaginationInput,
  OrganizerRole,
} from "@/graphql/graphql";

// ============= QUERIES =============

export const useEvents = (
  filter?: EventFilterInput,
  pagination?: PaginationInput,
) => {
  const { data, loading, error, refetch } = useQuery<
    GetEventsQuery,
    GetEventsQueryVariables
  >(GetEventsDocument, {
    variables: {
      filter,
      pagination,
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

export const useEvent = (id: string) => {
  const { data, loading, error, refetch } = useQuery<
    GetEventQuery,
    GetEventQueryVariables
  >(GetEventDocument, {
    variables: { id },
    skip: !id,
    fetchPolicy: "cache-and-network",
  });

  return {
    event: data?.event,
    loading,
    error,
    refetch,
  };
};

export const useMyEvents = (role?: OrganizerRole) => {
  const { data, loading, error, refetch } = useQuery<
    GetMyEventsQuery,
    GetMyEventsQueryVariables
  >(GetMyEventsDocument, {
    variables: { role },
    fetchPolicy: "cache-and-network",
  });

  return {
    events: data?.myEvents || [],
    loading,
    error,
    refetch,
  };
};

// ============= MUTATIONS =============

export const useCreateEvent = () => {
  const [mutate, { loading, error, data }] = useMutation<
    CreateEventMutation,
    CreateEventMutationVariables
  >(CreateEventDocument, {
    refetchQueries: ["GetEvents", "GetMyEvents"],
  });

  const createEvent = async (variables: CreateEventMutationVariables) => {
    return await mutate({ variables });
  };

  return {
    createEvent,
    loading,
    error,
    data,
  };
};

export const useUpdateEvent = () => {
  const [mutate, { loading, error, data }] = useMutation<
    UpdateEventMutation,
    UpdateEventMutationVariables
  >(UpdateEventDocument, {
    refetchQueries: ["GetEvent", "GetEvents", "GetMyEvents"],
  });

  const updateEvent = async (
    id: string,
    input: UpdateEventMutationVariables["input"],
  ) => {
    return await mutate({ variables: { id, input } });
  };

  return {
    updateEvent,
    loading,
    error,
    data,
  };
};

export const useUpdateEventStatus = () => {
  const [mutate, { loading, error, data }] = useMutation<
    UpdateEventStatusMutation,
    UpdateEventStatusMutationVariables
  >(UpdateEventStatusDocument, {
    refetchQueries: ["GetEvent", "GetEvents", "GetMyEvents"],
  });

  const updateEventStatus = async (
    id: string,
    status: UpdateEventStatusMutationVariables["status"],
  ) => {
    return await mutate({ variables: { id, status } });
  };

  return {
    updateEventStatus,
    loading,
    error,
    data,
  };
};

export const useDeleteEvent = () => {
  const [mutate, { loading, error }] = useMutation<
    DeleteEventMutation,
    DeleteEventMutationVariables
  >(DeleteEventDocument, {
    refetchQueries: ["GetEvents", "GetMyEvents"],
  });

  const deleteEvent = async (id: string) => {
    return await mutate({ variables: { id } });
  };

  return {
    deleteEvent,
    loading,
    error,
  };
};
