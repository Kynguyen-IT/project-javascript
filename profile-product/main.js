window.onload = function () {
  try {
    var url_string = window.location.href;
    var url = new URL(url_string);
    getProduct(url.searchParams.get("id"));
  } catch (err) {
    console.log("Issues with Parsing URL Parameter's - " + err);
  }
};

const getProduct = (id) => {
  fetch(`https://shynn.works/api/products?id=${id}`, {
    method: "GET",
  })
    .then((r) => r.json())
    .then((prod) => renderProduct(prod[0]));
};

const renderProduct = (product) => {
    var box = document.getElementById('box')
    var row =`
        <div class="row content_img">
        <div class="col-sm-6 box-img" style="background-image: url('${product.image}')">
        </div>
        <div class="col-sm-6 content_box">
            <h3 class="title">${product.name}</h3>
            <span class="text">${product.price}Đ</span>
            <button id='item' class="btn  btn_button">Order</button>
            <span class="delivery_hotline">
                Gọi giao hàng tận nơi
            <a href="#" title="Hotline: 0906573074">0906573074</a>
            </span>
        </div>
        </div>
    `
    box.innerHTML = row
    document.getElementById("item").setAttribute("onclick", `clickOrder("${product.id}")`)
}

function clickOrder(item) {
    let productNumber = localStorage.getItem('cartNumber')
    productNumber = parseInt(productNumber)
    if(productNumber){
      localStorage.setItem('cartNumber', productNumber + 1)
    }else{
      localStorage.setItem('cartNumber', 1)
    }
    setItem(item);
  alert('You have add to cart, Success!!!')
}

function setItem(item){
    let cartItems = localStorage.getItem("cart");
     cartItems = JSON.parse(cartItems);
  
    fetch(`https://shynn.works/api/products?id=${item}`,{
    method: "GET",
    }).then(r => r.json())
    .then(item => {
      if(cartItems != null){
        if(cartItems[item[0].id] == undefined){
          cartItems = {
            ...cartItems,
            [item[0].id]: item[0] 
           }
        }
        cartItems[item[0].id].quantity += 1
      }else {
        item[0].quantity = 1
       cartItems = {
         [item[0].id]: item[0] 
        }
      }   
      localStorage.setItem('cart' ,JSON.stringify(cartItems))
    }) 
  }