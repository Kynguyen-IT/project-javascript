checkAdmin();

window.onload = function () {
  fetch(`https://shynn.works/foody/db`)
    .then((res) => res.json())
    .then((res) => {
      document.getElementById("totalUsers").innerHTML = res.users.length || 0;
      document.getElementById("totalProducts").innerHTML = res.products.length || 0;
      document.getElementById("totalOrders").innerHTML = res.orders.length || 0;
      document.getElementById("totalCategories").innerHTML = res.categories.length || 0;
    });
};
