import { Button } from '@mui/material'
import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button variant="contained">Hello World</Button>
    </>
  )
}

export default App
