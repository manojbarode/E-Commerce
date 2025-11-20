import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
let App=()=>{
  return(
    <Routes>
        <Route element={<Layout />}/>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login/>}/>
      
    </Routes>
  );
}
export default App