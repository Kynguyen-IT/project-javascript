var list_show_cate = document.getElementById("list_item");
var list_show_product = document.getElementById("list_product");
var box_loading = document.getElementById("box_loading");

window.onload = function () {
  try {
    var url_string = window.location.href;
    var url = new URL(url_string);
    getProduct(url.searchParams.get("id"));
  } catch (err) {
    console.log("Issues with Parsing URL Parameter's - " + err);
  }
};

function loading() {
  box_loading.style.visibility = "visible";
  setTimeout(function () {
    box_loading.style.visibility = "hidden";
  }, 1000);
}

function getProduct(id) {
  loading();
  if (id == null) {
    DisPlayAllListProduct();
  } else {
    DisplayListProductById(id);
  }
}

function DisplayListCate() {
  list_show_cate.innerHTML = "";
  let row = "";
  fetch(`https://shynn.works/api/categories`)
    .then((res) => res.json())
    .then((data) => {
      data.map((cate) => {
        row = `<a class="list-group-item list-group-item-action text_item" href="./index.html?id=${cate.id}">${cate.name}</a>`;
        list_show_cate.innerHTML += row;
      });
          list_show_cate.innerHTML += `<a  class="list-group-item list-group-item-action text_item active" href="./" >all products</a>`
    });
}

function DisplayListProductById(id) {
  fetch(`https://shynn.works/api/products?idCategory=${id}`)
    .then((res) => res.json())
    .then((products) => {
      list_show_product.innerHTML = "";
      let product = "";
      products.map((item) => {
        let url = `./profile-product/index.html?id=${item.id}`;
        product = "<div class='col-lg-4 col-md-6 col-sm-12'>";
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
          "<button id='item" + item.id + "' class='btn_button'>Order</button>";
        product += "</div>";
        product += "</div>";
        product += "</div>";
        product += "</div>";
        list_show_product.innerHTML += product;
        document
          .getElementById("item" + item.id)
          .setAttribute("onclick", `clickOrder("${item.id}")`);
    });
  });
}

function DisPlayAllListProduct() {
  fetch(`https://shynn.works/api/products`)
  .then((res) => res.json())
  .then((products) => {
    list_show_product.innerHTML = "";
    let product = "";
    products.map((item) => {
      let url = `../profile-product/index.html?id=${item.id}`;
      product = "<div class='col-lg-4 col-md-6 col-sm-6'>";
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
        "<button id='item" + item.id + "' class='btn_button'>Order</button>";
      product += "</div>";
      product += "</div>";
      product += "</div>";
      product += "</div>";
      list_show_product.innerHTML += product;
      document
        .getElementById("item" + item.id)
        .setAttribute("onclick", `clickOrder("${item.id}")`);
  });
});
}

DisplayListCate();
