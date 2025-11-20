import {
  AddOrganizerDocument,
  AddOrganizerMutation,
  AddOrganizerMutationVariables,
  OrganizerRole,
  RemoveOrganizerDocument,
  RemoveOrganizerMutation,
  RemoveOrganizerMutationVariables,
} from "@/graphql/graphql";
import { useMutation } from "@apollo/client/react";

export const useAddOrganizer = () => {
  const [mutate, { loading, error, data }] = useMutation<
    AddOrganizerMutation,
    AddOrganizerMutationVariables
  >(AddOrganizerDocument, {
    refetchQueries: ["GetEvent"],
  });

  const addOrganizer = async (
    eventId: string,
    userId: string,
    role: OrganizerRole,
  ) => {
    return await mutate({ variables: { eventId, userId, role } });
  };

  return {
    addOrganizer,
    loading,
    error,
    data,
  };
};

export const useRemoveOrganizer = () => {
  const [mutate, { loading, error }] = useMutation<
    RemoveOrganizerMutation,
    RemoveOrganizerMutationVariables
  >(RemoveOrganizerDocument, {
    refetchQueries: ["GetEvent"],
  });

  const removeOrganizer = async (eventId: string, userId: string) => {
    return await mutate({ variables: { eventId, userId } });
  };

  return {
    removeOrganizer,
    loading,
    error,
  };
};
