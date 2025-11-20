import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from '../src/pages/Home'
import Login from './pages/Login';
let App=()=>{
  return(
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}
export default App