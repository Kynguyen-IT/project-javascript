const checkAdmin = () => {
    const userLogin = JSON.parse(localStorage.getItem("userLogin"));

    if(userLogin.role.admin){
        window.location.pathname = './admin/dashboard'
    } else {
        window.location.pathname = '../'
    }
}
checkAdmin()