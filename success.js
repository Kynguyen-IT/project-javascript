window.onload = function () {
  var url_string = window.location.href;
  var url = new URL(url_string);
  fetch("https://shynn.works/foody/users?role.admin=true")
    .then((res) => res.json())
    .then((listAdmin) => {
      const admins = listAdmin.map((admin) => {
        return admin.email;
      });
      onSuccess(url.searchParams.get("session_id"), admins);
    });
};

let cartItems = JSON.parse(localStorage.getItem("cart")) || {};
let userData = JSON.parse(localStorage.getItem("userLogin")) || {};
cartItems = Object.values(cartItems) || [];

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

const onSuccess = (sid, admins) => {
  fetch(`https://shynn.works/foody/checkout-success?session_id=${sid}`, {
    method: "POST",
    body: JSON.stringify({ admins }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then(({ session, body }) => {
      console.log(body);
      if (session.payment_status !== "paid") {
        return;
      } else {
        const { shipping, customer_email, amount_total } = session;
        if (userData.phone) {
          var order = {
            fullName: shipping.name,
            email: customer_email,
            total: amount_total,
            phone: userData.phone,
            address: `${shipping.address.line1} - ${shipping.address.city} - Việt Nam`,
            status: "pending",
            date: new Date().toLocaleString(),
            cart: cartItems,
          };
          fetch(`https://shynn.works/foody/orders`, {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(order),
          })
            .then((r) => r.json())
            .then((res) => {
              localStorage.removeItem("cart");
              localStorage.removeItem("cartNumber");
              showAlert("Order Successfully!!!", "success");
            });
          console.log(session);
        }
      }
    });
};
