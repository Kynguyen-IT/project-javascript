var userStr = localStorage.getItem("users");
var users = JSON.parse(userStr);
const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', e => {
	e.preventDefault();
  checkInputs();
});

function checkInputs(){
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    var data = {
        email: '',
        password: ''
    }
  
    if(emailValue === ''){
      setErrorFor(email,'Email cannot be blank');
    } else if(!isEmail(emailValue)){
      setErrorFor(email,'Incorrect email format');
    }else{
      setSuccessFor(email);
      data.email = emailValue
    }
  
    if(passwordValue === ''){
      setErrorFor(password,'Password cannot be blank');
    } else if(passwordValue.length <= 5){
      setErrorFor(password,'Password must be greater than 6');
    } else{
      setSuccessFor(password);
      data.password = passwordValue
    }


    fetch("http://localhost:3000/users")
    .then(response => response.json())
    .then(users.map(user => {
      if(data.email == user.email && data.password == user.password){
        console.log(user)
        localStorage.setItem("userLogin", JSON.stringify(user));
        document.getElementById('error_login').classList.add("not_show")
        window.location.pathname = '../'
      }
      else{
        document.getElementById('error_login').classList.add("show")
      }
    }))
  }
  
  function setSuccessFor(input){
    const formGroup = input.parentElement;
    formGroup.className = 'form-group form_group success';
  }

  function setErrorLogin(input){
    const formGroup = input.parentElement;
    formGroup.className = 'form-group form_group error';
  }
  
  function  setErrorFor(input, message){
    const formGroup = input.parentElement;
    const small = formGroup.querySelector('small');
    formGroup.className = 'form-group form_group error';
    small.innerText = message;
  }
  
  function isEmail(email) {
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  }