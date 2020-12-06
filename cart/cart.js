var stripe = Stripe(
  "pk_test_51HpaMfDXe7CZVgBqiIgpeMqMNVmDBr5QyKd1nfrmpqpjXzqqjkAj1FbpeV0Uf609BuYPh9ukKNTqoicusZ7laNag00Snv3xF30"
);
var list = document.querySelector(".list");
let cartItems = localStorage.getItem("cart");
let productNumber = parseInt(localStorage.getItem("cartNumber"));
const cart_empty = document.getElementById("cart_empty");
cartItems = JSON.parse(cartItems) || {};
cartItems = Object.values(cartItems) || [];
const ADD = "ADD";
const SUB = "SUB";
// form shipping
var fullName = document.getElementById("full_name");
var email = document.getElementById("email");
var phone = document.getElementById("phone");
var address = document.getElementById("address");

function getTotal() {
  let total = cartItems.reduce(
    (acc, cum) => acc + parseInt(cum.price * cum.quantity),
    0
  );
  document.getElementById("total").textContent = total;
  return total;
}

// function showItems() {
//   if (productNumber >= 0) {
//     cart_empty.classList.add("cart_empty");
//   }
// }

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

function getQuantity() {
  let quantity = 0;
  if (cartItems) {
    cartItems.map((item) => (quantity += item.quantity));
  }
  // document.getElementById("your_cart").textContent = `You have ${
  //   quantity || 0
  // } items in your cart`;
  document.getElementById("your-cart").innerHTML = quantity || 0;
  localStorage.setItem("cartNumber", quantity);
  return quantity;
}

function changeQuantity(method, id) {
  let newCart;
  if (method == SUB) {
    if (cartItems.length === 1) {
      localStorage.setItem("cartNumber", 0);
      document.getElementById("total").textContent = 0;
      document.getElementById(
        "your_cart"
      ).textContent = `You have 0 item in your cart`;
    }
    newCart = cartItems.map((item) => {
      if (item.id == id) {
        if (item.quantity == 1) {
          return null;
        } else {
          return { ...item, quantity: item.quantity - 1 };
        }
      } else {
        return item;
      }
    });
  } else {
    newCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }
  newCart = newCart.filter((i) => i != null);
  cartItems = [...newCart];
  newCart = newCart.reduce((a, b) => ((a[b.id] = b), a), {});

  localStorage.setItem("cart", JSON.stringify(newCart));

  displayCartItem();
}

function clearCart() {
  localStorage.removeItem("cart");
  localStorage.removeItem("cartNumber");
  document.getElementById("your-cart").innerHTML = 0;
  displayCartItem();
}

function displayCartItem() {
  list.innerHTML = "";
  cartItems = localStorage.getItem("cart");
  cartItems = JSON.parse(cartItems) || {};
  cartItems = Object.values(cartItems);
  let row = "";
  if (cartItems.length > 0) {
    cartItems.map((item) => {
      let image = `img-${item.id}`;
      row = `<tr>
                <td class="images">
                    <div class="box_img ${image}"   ></div>
                </td>
                <td class="text-capitalize">${item.name}</td>
                <td>
                    <div class="row justify-content-center">
                    <button type="button" class="btn" id="sub-${item.id}"><i
                        class="fas fa-minus icon_button"></i></button>
                    <span class="text_quantity">${item.quantity}</span>
                    <button type="button" id="add-${
                      item.id
                    }" class="btn"><i class="fas fa-plus icon_button"
                        ></i></button>
                    </div>
                </td>
                <td>${item.price}đ</td>
                <td>${item.price * item.quantity}đ</td>
              </tr>
              `;
      list.innerHTML += row;
      document.querySelector(
        `.${image}`
      ).style.backgroundImage = `url(${item.image})`;
      document
        .getElementById("sub-" + item.id)
        .setAttribute("onclick", `changeQuantity(${SUB},"${item.id}")`);
      document
        .getElementById("add-" + item.id)
        .setAttribute("onclick", `changeQuantity(${ADD},"${item.id}")`);
      getQuantity();
      getTotal();
    });
  } else {
    document.querySelector(".checkout-btn").disabled = true;
    document.querySelector(".clear_cart").disabled = true;
    list.innerHTML =
      "<tr><td colspan='5'><h3 class='text-center'>No thing in your cart</h3></td></tr>";
  }
}

const openCheckout = () => {
  document.getElementById("cartNum").innerHTML = getQuantity();
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = "";
  cartItems = localStorage.getItem("cart");
  cartItems = JSON.parse(cartItems) || {};
  cartItems = Object.values(cartItems);
  let row = "";
  cartItems.map((item) => {
    row = `
          <li
          class="list-group-item d-flex justify-content-between text-capitalize"
          >
              <span>${item.quantity} * ${item.name}</span>
              <span>${item.quantity * Number(item.price)}đ</span
              >
          </li>
          `;
    cartList.innerHTML += row;
  });
  document.getElementById("totalShowOrder").innerHTML = getTotal() + "đ";
};

const post = (endpoint, payload) => {
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(payload),
  });
};

const checkout = async () => {
  const user = JSON.parse(localStorage.getItem("userLogin"));
  var shipping = {
    email: user.email,
    total: getTotal(),
    status: "pending",
    cart: cartItems,
  };
  if (!user.phone) {
    return showAlert("Update your mobile phone in profile page first", "error");
  }
  // post(`https://shynn.works/foody/create-session`, shipping)
  post(`https://shynn.works/foody/create-session`, shipping)
    .then((res) => res.json())
    .then((session) => {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then((result) => {
      if (result.error) {
        showAlert(result.error.message, "error");
      }
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
};

function save() {
  let nameInp = fullName.value.trim();
  let emailInp = email.value.trim();
  let phoneInp = phone.value.trim();
  let addressInp = address.value.trim();
  var d = new Date();

  var date = d.toLocaleString();

  var newCustomer = {
    fullName: nameInp,
    email: emailInp,
    phone: phoneInp,
    address: addressInp,
  };

  if (
    nameInp != "" &&
    emailInp != "" &&
    phoneInp != "" &&
    addressInp != "" &&
    cartItems != []
  ) {
    post(`https://shynn.works/foody/create-customer`, newCustomer)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        return post(`https://shynn.works/foody/create-session`, {
          total: getTotal(),
          status: "pending",
          date: date,
          cart: cartItems,
          customer: res.id,
        });
      })
      .then((res) => res.json())
      .then((session) => {
        // console.log(session);
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then((result) => {
        if (result.error) {
          showAlert(result.error.message, "error");
        }
        console.log(result);
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
    // fetch(`https://shynn.works/foody/orders`, {
    // const fetchOrder = post(`https://shynn.works/foody/orders`, shipping);
    // const fetchCheckout = post(
    //   `https://shynn.works/foody/create-session`,
    //   shipping
    // );

    // Promise.all([fetchOrder, fetchCheckout])
    //   .then((res) => res[1].json())
    //   .then((session) => {
    //     return stripe.redirectToCheckout({ sessionId: session.id });
    //   })
    //   .then((result) => {
    //     if (result.error) {
    //       showAlert(result.error.message, "error");
    //     }
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.error("Error: ", err);
    //   });

    // fetch(`https://shynn.works/foody/create-session`, {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8",
    //   },
    //   body: JSON.stringify(shipping),
    // })
    //   .then((response) => response.json())
    //   .then((session) => {
    //     console.log(session);
    //     return stripe.redirectToCheckout({ sessionId: session.id });
    //   })
    //   .then(function (result) {
    //     if (result.error) {
    //       showAlert(result.error.message, "error");
    //     }
    //   })
    //   .catch(function (error) {
    //     console.error("Error:", error);
    //   });

    // localStorage.removeItem("cart");
    // localStorage.removeItem("cartNumber");
    // document.getElementById("your_cart").textContent = `You have ${
    //   getQuantity() || 0
    // } items in your cart`;
    // showAlert("Order Successfully!!!", "success");
    // displayCartItem();
    // getQuantity();
    // document.getElementById("total").innerHTML = 0;
  } else {
    showAlert("Error when create order!!!", "error");
  }
}

displayCartItem();
getQuantity();
