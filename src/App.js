import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
<<<<<<< HEAD
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from '../src/pages/Home'
let App=()=>{
  return(
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
=======
import Footer from './components/Footer';
import Home from './pages/Home.jsx';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
let App=()=>{
  return(
    <>
      <Routes>
      {/* Layout wraps all pages with Navbar + Footer */}
      <Route element={<Layout />}>
        {/* Add more routes as needed */}
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
    </>
>>>>>>> main
  )
}
export default App