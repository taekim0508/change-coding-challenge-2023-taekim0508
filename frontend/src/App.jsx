import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Title from './components/Title'
import Game from './components/Game'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Title />
      <Game />
    </>
  )
}

export default App
