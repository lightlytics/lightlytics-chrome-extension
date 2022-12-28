import { gql, useApolloClient } from '@apollo/client'
import { useEffect, useState } from 'react'
import { getWorkspaces } from './useWorkspaces'

export default function useAWSAccounts() {
  const [customerIdMap, setCustomerIdMap] = useState<any>({})
  const [awsAccounts, setAWSAccounts] = useState<any[]>([])
  const client = useApolloClient()

  useEffect(() => {
    updateAccounts()

    async function updateAccounts() {
      const { list, map } = await getAWSAccounts(client)
      setAWSAccounts(list)
      setCustomerIdMap(map)
    }
  }, [client])

  return {
    awsAccounts,
    customerIdMap,
  }
}

export async function getAWSAccounts(client: any) {
  const map: any = {}
  const workspaces: any[] = await getWorkspaces(client)
  const promises = workspaces?.map((w: any) => {
    return getAccountsByWorkspace(client, w).then(accounts => {
      for (const account of accounts) {
        map[account.aws_account_id] = w.customer_id
      }
      return accounts
    })
  })
  const data: any[] = promises && (await Promise.all(promises))
  return { list: data?.flat(), map }
}

async function getAccountsByWorkspace(client: any, workspace: any) {
  const data = await client.query({
    query: gql`
            query Accounts_${workspace.customer_id} {
                accounts {
                    aws_account_id
                    display_name
                }
            }
        `,
    fetchPolicy: 'no-cache',
    context: {
      headers: {
        customer: workspace.customer_id,
      },
    },
  })

  return data?.data.accounts
}
