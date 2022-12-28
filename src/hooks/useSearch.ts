import { gql, useQuery } from '@apollo/client'

interface Props {
  phrase: String | null
}

function useSearch({ phrase }: Props) {
  const { data, loading, error } = useQuery(
    gql`
      query Search($phrase: String) {
        search(phrase: $phrase, limit: 100) {
          results {
            resource_id
            resource_type
            display_name
          }
        }
      }
    `,
    {
      skip: !phrase,
      variables: {
        phrase,
      },
    },
  )

  return {
    results: data?.search?.results,
    loading,
    error: error,
  }
}

export default useSearch
