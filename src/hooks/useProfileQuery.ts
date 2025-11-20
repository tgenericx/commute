import {
  ProfileDocument,
  ProfileQuery,
  ProfileQueryVariables,
} from "@/graphql/graphql";
import { useQuery } from "@apollo/client/react";

export const useProfileQuery = () => {
  const { data, loading, error, refetch } = useQuery<
    ProfileQuery,
    ProfileQueryVariables
  >(ProfileDocument);

  return {
    profile: data?.profile,
    loading,
    error,
    refetch,
    // Helper computed properties
    isVerified: data?.profile?.emailIsVerified || false,
    hasProfilePicture: !!data?.profile?.avatar,
  };
};
