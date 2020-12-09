var image_member = document.getElementById("img_member");
var name_title = document.getElementById("name_member");
var name_show = document.getElementById("name_show");
var email_show = document.getElementById("email_show");
var address_show = document.getElementById("address_show");
var phone_show = document.getElementById("phone_show");
var userLogin = JSON.parse(localStorage.getItem("userLogin"));
// file input
var imageFile = document.getElementById("avatarInp");
// form data
var name_ip = document.getElementById("name_ip");
var email_ip = document.getElementById("email_ip");
var phone_ip = document.getElementById("phone_ip");
var address_ip = document.getElementById("addesss_ip");

let userData = {};

const showAlert = (message, status) => {
  var x = document.getElementById("snackbar");
  x.innerHTML = message;

  if (status == "success") {
    x.classList.add("bg-success");
  } else {
    x.classList.add("bg-danger");
  }

  x.classList.add("show");
  setTimeout(function () {
    x.classList.remove("show");
  }, 3000);
};

$("#avatarInp").change(function () {
  $("#avatarForm").submit();
});

const avatarSubmit = (e) => {
  e.preventDefault();
  console.log(e);
  var formData = new FormData();
  formData.append("avatar", imageFile.files[0]);
  fetch(`https://shynn.works/foody/upload-image`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      fetch(`https://shynn.works/foody/users/${userLogin.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          image: `https://shynn.works/foody/images/${res.image}`,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          localStorage.setItem("userLogin", JSON.stringify(responseJson));
          displayData();
        });
    });
};

// function previewFile() {
//   const file = imageFile.files[0];
//   const reader = new FileReader();

//   reader.addEventListener(
//     "load",
//     function () {
//       imgSrc = reader.result;
//       image_member.style.backgroundImage = `url(${reader.result})`;

//       console.log(userLogin.id);
//       fetch(`https://shynn.works/foody/users/${userLogin.id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-type": "application/json; charset=UTF-8",
//         },
//         body: JSON.stringify({
//           image: imgSrc,
//         }),
//       })
//         .then((response) => response.json())
//         .then((responseJson) => {
//           localStorage.setItem("userLogin", JSON.stringify(responseJson));
//         });
//     },
//     false
//   );

//   if (file) {
//     reader.readAsDataURL(file);
//   }
// }

function displayData() {
  fetch(`https://shynn.works/foody/users/${userLogin.id}`)
    .then((res) => res.json())
    .then((user) => {
      if (user["image"] !== null && user["image"] !== undefined) {
        image_member.style.backgroundImage = `url(${user.image})`;
      } else {
        image_member.style.backgroundImage =
          "url(https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSteItzPyeDKBxyWiOA8xrPZXIlxOYv1b1VVg&usqp=CAU)";
      }

      userData = user;

      if (
        user["name"] != undefined ||
        user["phone"] != undefined ||
        user["address"] != undefined
      ) {
        // show data in page
        name_title.innerHTML = user.name;
        name_show.innerHTML = user.name;
        email_show.innerHTML = user.email;
        phone_show.innerHTML = user.phone;
        address_show.innerHTML = user.address;

        name_ip.value = user.name;
      } else {
        name_title.innerHTML = "";
        name_show.innerHTML = "";
        email_show.innerHTML = user.email;
        phone_show.innerHTML = "";
        address_show.innerHTML = "";
      }
    });
}

function openEdit() {
  fetch(`https://shynn.works/foody/users/${userLogin.id}`)
    .then((res) => res.json())
    .then((user) => {
      if (
        user["name"] != undefined ||
        user["phone"] != undefined ||
        user["address"] != undefined
      ) {
        name_ip.value = user.name;
        email_ip.value = user.email;
        address_ip.value = user.address;
        phone_ip.value = user.phone;
      } else {
        name_ip.value = "";
        email_ip.value = user.email;
        address_ip.value = "";
        phone_ip.value = "";
      }
    });
}

function update() {
  let nameValue = name_ip.value.trim();
  let emailValue = email_ip.value.trim();
  let phoneValue = phone_ip.value.trim();
  let addressValue = address_ip.value.trim();

  if (
    nameValue !== "" &&
    emailValue !== "" &&
    phoneValue !== "" &&
    addressValue !== ""
  ) {
    var data = {
      name: nameValue,
      email: emailValue,
      phone: phoneValue,
      address: addressValue,
    };

    fetch(`https://shynn.works/foody/users/${userLogin.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        localStorage.setItem("userLogin", JSON.stringify(responseJson));
        displayData();
      });
    showAlert("Update information successfully!!!", "success");
    $("#editModal").modal("hide");
  } else {
    showAlert("Error when update your information!!!", "error");
  }
}

const openEditPassword = () => {
  // console.log(userData);
};

const updatePassword = () => {
  const old_pass = document.getElementById("old_pass");
  const new_pass = document.getElementById("new_pass");
  const renew_pass = document.getElementById("renew_pass");

  if (new_pass.value === "" && renew_pass.value === "") {
    alert("Input must not empty!");
  } else if (userData && old_pass.value === userData.password) {
    if (new_pass.value === renew_pass.value) {
      const newData = {
        password: new_pass.value,
        etpassword: renew_pass.value,
      };
      fetch(`https://shynn.works/foody/users/${userData.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(newData),
      }).then((res) => {
        if (res.status === 200) {
          alert("Password Changed!");
          $("#editPassword").modal("hide");
          old_pass.value = "";
          new_pass.value = "";
          renew_pass.value = ""
        }
      });
    }
  } else {
    console.log("WRong pass");
  }
};

displayData();
