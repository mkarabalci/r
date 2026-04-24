import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home"
import Snacks from "./Snacks"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/snacks" element={<Snacks />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App