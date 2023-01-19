import { createClient } from '../client'
import { ACCOUNTS_QUERY, WORKSPACES_QUERY } from '../queries'

const ACCOUNTS_CACHE: any = {}

export async function getCustomerByAccount({
  client,
  aws_account_id,
}: {
  client: ReturnType<typeof createClient>
  aws_account_id: string
}) {
  const { data: { workspaces } = {}, error } = await client.query({
    query: WORKSPACES_QUERY,
  })

  if (!workspaces) {
    throw error
  }
  for (const workspace of workspaces) {
    if (!workspace?.customer_id) continue

    const accounts = await getAccounts(client, workspace.customer_id)

    if (accounts) {
      for (const account of accounts) {
        if (account?.aws_account_id === aws_account_id) {
          return workspace.customer_id
        }
      }
    }
  }
}

async function getAccounts(
  client: ReturnType<typeof createClient>,
  customer: string,
) {
  if (ACCOUNTS_CACHE[customer]) {
    return ACCOUNTS_CACHE[customer]
  }

  const { data: { accounts } = {} } = await client.query({
    query: ACCOUNTS_QUERY,
    fetchPolicy: 'network-only',
    context: {
      headers: {
        customer,
      },
    },
  })

  return (ACCOUNTS_CACHE[customer] = accounts)
}
