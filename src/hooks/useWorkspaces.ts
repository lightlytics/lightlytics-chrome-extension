import { gql, useQuery } from '@apollo/client'

function useWorkspaces() {
  const { data, loading, error } = useQuery(QUERY, {
    context: {
      headers: {
        customer: false,
      },
    },
  })

  return {
    workspaces: data?.workspaces,
    loading,
    error,
  }
}

export async function getWorkspaces(client: any) {
  const data = await client.query({
    query: QUERY,
  })

  return data?.data.workspaces
}

const QUERY = gql`
  query Workspaces {
    workspaces {
      customer_id
      customer_name
    }
  }
`

export default useWorkspaces
