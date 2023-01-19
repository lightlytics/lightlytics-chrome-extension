import { useQuery } from '@apollo/client'
import { WORKSPACES_QUERY } from '../queries'

function useWorkspaces() {
  const { data, loading, error } = useQuery(WORKSPACES_QUERY, {
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

export default useWorkspaces
