import { gql } from './__generated__'

export const WORKSPACES_QUERY = gql(`
  query Workspaces {
    workspaces {
      customer_id
      customer_name
    }
  }
`)

export const ACCOUNTS_QUERY = gql(`
query Accounts {
    accounts {
        aws_account_id
        display_name
    }
}
`)
