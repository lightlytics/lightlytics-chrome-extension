import { gql, useQuery } from "@apollo/client";

interface Props {
  resourceId: String | null;
}

function useResource({ resourceId }: Props) {
  const { data, loading, error } = useQuery(
    gql`
      query Resource($resourceId: ID) {
        resource(resource_id: $resourceId, all: true) {
          display_name
        }
      }
    `,
    {
      skip: !resourceId,
      variables: {
        resourceId,
      },
    }
  );

  const notFound = error?.graphQLErrors?.[0]?.extensions?.code === "NOT_FOUND";

  return {
    resource: data?.resource,
    loading,
    error: notFound ? null : error,
    notFound,
  };
}

export default useResource;
