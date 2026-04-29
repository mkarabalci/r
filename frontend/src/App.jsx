import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home"
import Snacks from "./Snacks"
import Beverages from "./Beverages"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/snacks" element={<Snacks />} />
        <Route path="/drinks" element={<Beverages />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App