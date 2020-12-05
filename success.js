window.onload = function () {
  var url_string = window.location.href;
  var url = new URL(url_string);
  onSuccess(url.searchParams.get("session_id"));
};

let cartItems = JSON.parse(localStorage.getItem("cart")) || {};
cartItems = Object.values(cartItems) || [];

const onSuccess = (sid) => {
  fetch(`http://localhost:3001/checkout-success?session_id=${sid}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then(({ session }) => {
      // console.log(res);
      if (session.payment_status !== "paid") {
        return;
      } else {
        const { shipping, customer_email, amount_total } = session;
        var order = {
          fullName: shipping.name,
          email: customer_email,
          total: amount_total,
          address: `${shipping.address.line1} - ${shipping.address.city} - Việt Nam`,
          status: "pending",
          date: new Date().toLocaleString(),
          cart: cartItems,
        };
        fetch(`http://localhost:3001/orders`, {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify(order),
        })
          .then((r) => r.json())
          .then((res) => console.log(res));
        console.log(session);
      }
    });
};
