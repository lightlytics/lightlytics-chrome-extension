import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import './Popup.css'
import { Box, Divider } from '@mui/material'
import Settings from './Settings'
import Search from './Search'

function Popup() {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className="popup">
      <Tabs centered value={value} onChange={handleChange}>
        <Tab label="Settings" />
        <Tab label="Search" />
      </Tabs>
      <Divider />
      {[<Settings />, <Search />].map((c, i) => (
        <TabPanel key={i} value={value} index={i}>
          {c}
        </TabPanel>
      ))}
    </div>
  )
}

interface TabPanelProps {
  value: number
  index: number
  children: JSX.Element | JSX.Element[]
}

function TabPanel({ value, index, children }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default Popup
