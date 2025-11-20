<<<<<<< HEAD
import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup"; 

// AuthContext import
import AuthProvider from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};
=======
import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/profile" element={<Profile />} />  {/* ✅ Added */}
  </Route>
</Routes>
    </Router>
  );
}
>>>>>>> origin/main

export default App;
