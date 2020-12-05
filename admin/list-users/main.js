var list = document.getElementById("list");
var accountEdit = document.getElementById('editAccount') 
var passwordEdit = document.getElementById('editPassword') 
var accessAdminEdit = document.getElementById('editMakeAdmin')
var accountAdd = document.getElementById('addAccount') 
var passwordAdd = document.getElementById('addPassword') 
var accessAdminAdd = document.getElementById('addMakeAdmin')
var a;

function displayTable() {
    fetch(`https://shynn.works/foody/users`)
      .then((res) => res.json())
      .then((data) => {
        list.innerHTML = "";
         var item = "";
        data.map((user)=>{
            console.log(user.role.admin)
            if (user.role.admin == true) {
              a = 'admin'
            }else {
               a = 'member'  
            }    
      item = `
      <tr>
        <td class="text-capitalize">${user.email}</td>
        <td class="text-capitalize">${user.password}</td>
        <td class="text-capitalize">${a}<td>
         <button class="btn text-success" data-toggle="modal" onclick= "openEditUser('${user.id}')" data-target="#editModal" id="openEditModal${user.id}"><i class="far fa-edit"></i></button>
         /
        <button class="btn text-danger" onclick = "deleteProduct('${user.id}')" id="delete${user.id}"><i class="fa fa-trash"></i></button> 
        </td>
      </tr>  
    `;
      list.innerHTML += item;
        })
      });
  }
  //add user
  function addUser() {
    var accountValue = accountAdd.value.trim();
    var passwordValue = passwordAdd.value.trim();
    var adminValue = accessAdminAdd.checked;
    if(accountValue != '' && passwordValue != ''){
        
      data = {
        email: accountValue,
        password: passwordValue,
        role: {
            admin: adminValue,
          }
      }
      
      fetch(`https://shynn.works/foody/users`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((responseJson) => console.log(responseJson));
      alert('You have Add user, Success!!!')
    }else{
     alert('You have not Add user, Error!!!')
    }
    displayTable() 
  }
  // load Data
  function openEditUser(id){
      document.getElementById("editUser")
      .setAttribute("onclick", `editUser("${id}")`);
    fetch(`https://shynn.works/foody/users?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      data.map((user)=>{
        accountEdit.value = user.email;
        passwordEdit.value = user.password;
        accessAdminEdit.checked = user.role.admin;
      })
    })
    
  }

  //edit
  function editUser(id){
    var accountValue = accountEdit.value.trim();
    var passwordValue = passwordEdit.value.trim();
    var adminValue = accessAdminEdit.checked;
    if(accountValue != '' && passwordValue != ''){
      fetch(`https://shynn.works/foody/users/${id}`, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        email: accountValue ,
        password:passwordValue,
        role : {
            admin : adminValue
        }
        
    }),
    })
      .then((response) => response.json())
      .then((responseJson) => console.log(responseJson));
      alert('You have edit User, Success!!!')
    } else{
      alert('You have not edit User, Error!!!')
    }
    displayTable();
  }

  function deleteProduct(id){
    fetch(`https://shynn.works/foody/users/${id}`, {
      method: 'DELETE'
    })
    alert('You have Delete user, Success!!!')
    displayTable() 
  }
  
  displayTable()