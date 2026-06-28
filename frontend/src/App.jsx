import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import PublicApp from "./pages/PublicApp"
import AdminApp from "./admin/AdminApp"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
