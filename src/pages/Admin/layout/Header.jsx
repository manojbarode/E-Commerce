const Header = () => {
  return (
    <div className="admin-header d-flex justify-content-between align-items-center px-4">
      <h5 className="mb-0">Admin Dashboard</h5>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
