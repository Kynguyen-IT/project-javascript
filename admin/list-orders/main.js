var list = document.getElementById("list");
var nameT = document.getElementById('nameSp')
var phone = document.getElementById('phoneSp')
var email = document.getElementById('emailSp')
var address = document.getElementById('addressSp')
var date = document.getElementById('dateSp')
var statusT = document.getElementById('statusSp')
var cartList = document.getElementById('cartList')

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

function displayTable() {
  fetch(`https://fooddy-server.herokuapp.com/orders`)
    .then((res) => res.json())
    .then((data) => {
      list.innerHTML = "";
      var item = "";
      data.map((order) => {
        item = `
        <tr id="processedOrder${order.id}"  data-toggle="modal" data-target="#orderModal">
        <td class="text-capitalize">${order.fullName}</td>
        <td class="text-capitalize">${order.phone}</td>
        <td class="text-capitalize">${order.date}</td>
        <td class="text-capitalize">${order.status}</td>
        </tr>  
      `;
        list.innerHTML += item;
        document
          .getElementById("processedOrder" + order.id)
          .setAttribute("onclick", `showProcessedOrder("${order.id}")`);
          document
          .getElementById("processed")
          .setAttribute("onclick", `processedOrder("${order.id}","${order.status}")`);
      });
    });
}
function showProcessedOrder(id){
  fetch(`https://fooddy-server.herokuapp.com/orders/${id}`)
  .then((res) => res.json())
  .then((data) => {
    nameT.innerHTML =  data.fullName
    email.innerHTML = data.email
    phone.innerHTML = data.phone
    address.innerHTML = data.address
    date.innerHTML = data.date
    statusT.innerHTML = data.status

    let row = "";
    data.cart.map((item)=>{
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
    })
    document.getElementById("totalShowOrder").innerHTML = data.total + "đ";
  })  
}

function processedOrder(id, status){

  if(status == "pending"){
    fetch(`https://fooddy-server.herokuapp.com/orders/${id}`, {
    method: 'PATCH',
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      status: 'approved'
    }),
    })
    .then((response) => response.json())
    .then((responseJson) => console.log(responseJson));
    showAlert('You have	Approved Order, Success!!!', "success")
    displayTable();
  }else{
    showAlert('You have Approved Order, Errorr!!!', "error")
  }
  
}

displayTable();
