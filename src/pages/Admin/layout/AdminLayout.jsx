import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className="admin-content">
        <Header />
        <div className="container-fluid p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
