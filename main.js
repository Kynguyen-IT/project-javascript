var userStr = localStorage.getItem("userLogin");
var userLogin = JSON.parse(userStr);
var nav_login = document.getElementById("login");
var dropDown = document.getElementById("dropDown");
var storeProducts = JSON.parse(localStorage.getItem("products"));
var list = document.getElementById("list_product");
var pagination = document.getElementById("pagination");
var nav = document.getElementById("nav");
var dropdown_menu = document.getElementById("dropdown_menu");

window.onscroll = function () {
  if ($(window).scrollTop() >= 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
};

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

const getProduct = async () => {
  const res = await fetch("https://shynn.works/api/products");
  const products = await res.json();
  localStorage.setItem("products", JSON.stringify(products));
};

getProduct();

if (userLogin != null) {
  if (userLogin.role.admin) {
    let row = `<a class="dropdown-item" href="./admin">Admin</a>`;
    dropdown_menu.innerHTML += row;
  }

  nav_login.remove();
  document.getElementById("dropDown_link").innerHTML = userLogin.email;
} else {
  dropDown.remove();
}

function logout() {
  localStorage.removeItem("userLogin");
  window.location.pathname = "../";
  localStorage.removeItem('cart')
  localStorage.removeItem('cartNumber')
}

let current_page = 1;
let columns = 8;

function DisplayList(items, wrapper, columns_per_page, page) {
  wrapper.innerHTML = "";
  page--;
  let start = columns_per_page * page;
  let end = start + columns_per_page;
  let paginationItems = items.slice(start, end);
  let product = "";
  for (let i = 0; i < paginationItems.length; i++) {
    let item = paginationItems[i];
    let url = `./profile-product/index.html?id=${item.id}`;
    product = "<div class='col-lg-3 col-sm-4'>";
    product += "<div class='card box_card'>";
    product += "<div class='box_imges' >";
    product +=
      "<div style='background-image: url(" +
      item.image +
      ")' class='box_image_item'>";
    product += "</div>";
    product += "<div class='card-body card_body'>";
    product +=
      "<a href='" +
      url +
      "' class='card-title title_item'>" +
      item.name +
      "</a>";
    product += "<p class='card-text text_item'>" + item.price + "₫</p>";
    product +=
      "<button id='item" + item.id + "' class='btn btn_button'>Order</button>";
    product += "</div>";
    product += "</div>";
    product += "</div>";
    product += "</div>";
    wrapper.innerHTML += product;
    document
      .getElementById("item" + item.id)
      .setAttribute("onclick", `clickOrder("${item.id}")`);
  }
}

function setupPagination(items, wrapper, columns_per_page) {
  wrapper.innerHTML = "";
  let page_count = Math.ceil(items.length / columns_per_page);
  console.log(page_count)
  for (let i = 1; i < page_count + 1; i++) {
    let btn = PaginationBtn(i, items);
    wrapper.appendChild(btn);
  }
}

function PaginationBtn(page, items) {
  let btn = document.createElement("button");
  btn.innerText = page;
  if (current_page == page) {
    btn.classList.add("active");
  }
  btn.addEventListener("click", () => {
    current_page = page;
    DisplayList(items, list, columns, current_page);
  });
  return btn;
}

function onLoadCartNumber() {
  let productNumber = localStorage.getItem("cartNumber");
  if (productNumber) {
    document.querySelector(".numberCircle").textContent = productNumber;
  }
}

function clickOrder(id) {
  if (userLogin == null) {
    showAlert("You must be logged in to your account, Error!!!", "error");
  } else {
    let productNumber = parseInt(localStorage.getItem("cartNumber"));

    if (productNumber) {
      localStorage.setItem("cartNumber", productNumber + 1);
      document.querySelector(".numberCircle").textContent = productNumber + 1;
    } else {
      localStorage.setItem("cartNumber", 1);
      document.querySelector(".numberCircle").textContent = 1;
    }
    showAlert("Success, Product added!", "success");
    setItem(id);
  }
}

function setItem(id) {
  let cartItems = localStorage.getItem("cart");
  cartItems = JSON.parse(cartItems);

  fetch(`https://shynn.works/api/products?id=${id}`, {
    method: "GET",
  })
    .then((r) => r.json())
    .then((item) => {
      console.log(cartItems)
      if (cartItems != null) {
        if (cartItems[item[0].id] == undefined) {
          cartItems = {
            ...cartItems,
            [item[0].id]: item[0],
          };
        }
        cartItems[item[0].id].quantity += 1;
      } else {
        item[0].quantity = 1;
        cartItems = {
          [item[0].id]: item[0],
        };
      }
      localStorage.setItem("cart", JSON.stringify(cartItems));
    });
}

onLoadCartNumber();
DisplayList(storeProducts, list, columns, current_page);
setupPagination(storeProducts, pagination, columns);
