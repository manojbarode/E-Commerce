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