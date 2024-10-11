import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import Main from './pages/Main'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import { auth } from './firebase-config'

import "./App.css";
import { ProgressSpinner } from 'primereact/progressspinner'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col text-center space-y-3" style={{ color: "#6b7280", fontSize: "1.125rem" }}>
        <ProgressSpinner style={{ width: "50px", height: "50px" }} aria-label="Loading" strokeWidth="1" animationDuration=".7s" />
        <span>Chargement des données...</span>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/security/auth"
          element={isAuthenticated ? <Navigate to="/app" /> : <Auth />}
        />
        <Route
          path="/app"
          element={isAuthenticated ? <Main /> : <Navigate to="/security/auth" />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/app" : "/security/auth"} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
