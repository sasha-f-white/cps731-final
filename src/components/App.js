import React from "react"
import Signup from "./Signup"
import { Container, Navbar } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"
import './home.css';

function App() {
  return (
    <>
    <body className="bg">
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
              <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>}></Route>
              <Route path="/signup" element={<Signup></Signup>} />
              <Route path="/login" element={<Login></Login>} />
              <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>}></Route>
            </Routes>
          </AuthProvider>
        </Router>
        </body>
    </>
  )
}

export default App
