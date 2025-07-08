import { useState } from 'react'

import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./components/HomePage"
import ProcesoPage from "./components/ProcesoPage"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/proceso/:id" element={<ProcesoPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

