import { useApolloClient } from "@apollo/client";
import { Box, CircularProgress, MenuItem, styled, TextField, Tooltip, Typography } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { useDispatcher } from "../context";
import useAWSAccounts from "../hooks/useAWSAccounts";
import useContent from "../hooks/useContent";
import useSearch from "../hooks/useSearch";
import ResourceDetails from "./ResourceDetails/ResourceDetails";


function Search() {
  const dispatch = useDispatcher()
  const client = useApolloClient()
  const { awsAccountId: contentAWSAccountId } = useContent();
  const [awsAccountId, setAWSAccountId] = useState(contentAWSAccountId)
  const { awsAccounts, customerIdMap } = useAWSAccounts()

  const handleAWSAccountChange = async (newAWSAccountId: any) => {
    setAWSAccountId(newAWSAccountId)
    const customer = customerIdMap[newAWSAccountId]
    if (customer) {
      client.cache.reset()
      dispatch({
        headers: {
          customer,
        }
      })
    }
  }
  const [ phrase, setPhrase, rawPhrase] = useDebouncedState('')
  const { results, loading } = useSearch({ phrase })
  return (
    <Box sx={{ "& > :not(style)": { mb: 1 } }}>
       <TextField 
        fullWidth 
        select
        variant="outlined" 
        value={awsAccountId} 
        InputLabelProps={{shrink: true}} 
        label="Account ID" 
        disabled={!!contentAWSAccountId}
        SelectProps={{
          displayEmpty: true
        }}
        onChange={ev => handleAWSAccountChange(ev.target.value)}
      >
        <MenuItem>
          <Typography color="textSecondary">Select AWS Account</Typography>
        </MenuItem>
        {awsAccounts?.map((w: any, i: number) => <MenuItem value={w.aws_account_id} key={i}>
          <Typography>{w.aws_account_id} - {w.display_name}</Typography>
        </MenuItem>)}
        </TextField>


      <TextField 
        fullWidth 
        variant="outlined" 
        value={rawPhrase} 
        disabled={!awsAccountId && !contentAWSAccountId}
        onChange={ev => setPhrase(ev.target.value)} placeholder="Search by name, ID, tags or IP" 
        InputProps={{
          endAdornment: loading && <CircularProgress size={15} />
        }}
      />
      {results?.map((result: any) => (
      <Tooltip placement="right" title={<ResourceDetails resourceId={result.resource_id} />}>
      <SearchReult>
        <Typography>{result.resource_type}</Typography>
        <Typography>{result.resource_id}</Typography>
        <Typography>{result.display_name}</Typography>
      </SearchReult></Tooltip>))}
    </Box>
  );
}

const SearchReult = styled('div')(( { theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}))

function useDebouncedState(defaultValue: any) {
  const ref = useRef<any>()
  const [ rawValue, setRawValue] = useState(defaultValue)
  const [ value, setValue] = useState(defaultValue)
  const update = useCallback((v) => {
    setRawValue(v)
    clearTimeout(ref.current)
    ref.current = setTimeout(() => {
      setValue(v)
    }, 1000)
  }, [])
  return [value, update, rawValue]
}

export default Search;
