const checkAdmin = () => {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  if (userLogin.role.admin) {
    if (window.location.pathname === "/admin/") {
      window.location.pathname = "./admin/dashboard";
      return;
    }
  } else {
    window.location.pathname = "../";
  }
};
checkAdmin();
