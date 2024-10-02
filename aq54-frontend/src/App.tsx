import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Main from './pages/Main'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/security/auth" element={<Auth />}></Route>
          <Route path="/app" element={<Main />}></Route>
          <Route path="/" element={<Navigate to={"/app"} />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
