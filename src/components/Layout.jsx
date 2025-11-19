<<<<<<< HEAD
import Navbar from "./Navbar"
import { Outlet } from "react-router-dom";
let Layout = ()=>{
    return(
       <div>
        <Navbar/>
        <div className="pt-16 flex"> 
        <Footer/>
        <main>
          <Outlet />
        </main>
      </div>
       </div>
    )
}
export default Layout
=======
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet /> {/* This renders the page component (like Test) */}
      </main>

      <Footer/>
    </div>
  );
}
>>>>>>> 1984b119c70a14336744bcf964d0061bdaeb811e
