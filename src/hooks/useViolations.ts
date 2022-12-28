import { gql, useQuery } from '@apollo/client'

interface Props {
  resourceId: String | null
}

function useViolations({ resourceId }: Props) {
  const { data, loading, error } = useQuery(
    gql`
      query RuleViolationGroups($resourceId: String) {
        ruleViolationGroups(
          filters: { resource_id: [$resourceId] }
          group_by: [severity]
        ) {
          severity
          count
        }
      }
    `,
    {
      skip: !resourceId,
      variables: {
        resourceId,
      },
    },
  )

  return {
    violations: data?.ruleViolationGroups,
    loading,
    error,
  }
}

export default useViolations
