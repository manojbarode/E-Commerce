import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home.jsx';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
let App=()=>{
  return(
    <>
      <Routes>
      {/* Layout wraps all pages with Navbar + Footer */}
        <Route element={<Layout />}/>
        {/* Add more routes as needed */}
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login/>}/>
      
    </Routes>
    </>
  )
}
export default App