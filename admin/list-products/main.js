var list = document.getElementById("list");
var imageFile = document.getElementById("file")
var imgSrc;
// item data in edit modal
var nameEdit = document.getElementById('editName') 
var priceEdit = document.getElementById('editPrice') 
var imageEdit = document.getElementById('imageEdit') 
var select_cate_edit = document.getElementById('select_cate_edit')
var nameItem = document.getElementById('nameItem') 
var priceItem = document.getElementById('priceItem') 
// item data in add modal
var nameAdd = document.getElementById('addName') 
var priceAdd = document.getElementById('addPrice') 
var imageAdd = document.getElementById('imageAdd') 
var select_cate_add = document.getElementById('select_cate_add')



function previewFile() {
  const file = imageFile.files[0];
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      imgSrc = reader.result;

      document.querySelector(
        `.box_img_edit`
      ).style.backgroundImage = `url(${reader.result})`;
        
      document.querySelector(
        `.box_img_add`
      ).style.backgroundImage = `url(${reader.result})`;
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
}

function displayTable() {
  fetch(`https://fooddy-server.herokuapp.com/products`)
    .then((res) => res.json())
    .then((data) => {
      list.innerHTML = "";
       var item = "";
      data.map((product)=>{
        let image = `img-${product.id}`;
        item = `
        <tr>
          <td class="images">
              <div class="box_img_td ${image}"></div>
          </td>
          <td class="text-capitalize">${product.name}</td>
          <td class="text-capitalize">${product.price}đ</td>
          <td>
          <button class="btn text-success" onclick='openEditModal("${product.id}")' data-toggle="modal" data-target="#editModal" ><i class="far fa-edit"></i></button>
          /
          <button class="btn text-danger" onclick='deleteProduct("${product.id}")'><i class="fa fa-trash"></i></button> 
          </td>
        </tr>  
      `;
    list.innerHTML += item;
    document.querySelector(
      `.${image}`
    ).style.backgroundImage = `url(${product.image})`;
      })
    });
}

function edit(id){
  console.log(id)
}

// load data in edit modal
function loadData(id){
  fetch(`https://fooddy-server.herokuapp.com/products?id=${id}`)
  .then((res) => res.json())
  .then((data) => {
    data.map((product)=>{
      nameEdit.value = product.name;
      priceEdit.value = product.price
      imageEdit.style.background = `url(${product.image})`
      nameItem.textContent = product.name
      priceItem.textContent = product.price + "đ"
    })
  })
  showCategory(select_cate_edit)
}
// show category in selete
function showCategory(select) {
  fetch(`https://fooddy-server.herokuapp.com/categories`)
    .then((res) => res.json())
    .then((data) => {
      select.innerHTML = '';
      var options = '';
      data.map((cate)=>{
        options += '<option value="' + cate.id+ '">' + cate.name + '</option>';
        select.innerHTML = options
      })
    }
  )
}

// open Edit Modal
function openEditModal(id){
  loadData(id)
  document
  .getElementById("editProduct")
  .setAttribute("onclick", `editProduct("${id}")`);
}

// btn edit product
function editProduct(id){
  var nameValue = nameEdit.value.trim();
  var priceValue = priceEdit.value.trim();
  var optionValue = select_cate_edit.options[select_cate_edit.selectedIndex].value;

  if(nameValue != '' && priceValue != '' && optionValue != '' && imgSrc != undefined ){
    fetch(`https://fooddy-server.herokuapp.com/products/${id}`, {
    method: 'PUT',
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      name: nameValue,
      price:priceValue,
      idCategory:optionValue,
      image:imgSrc
  }),
  })
    .then((response) => response.json())
    .then((responseJson) => console.log(responseJson));
    alert('You have edit product, Success!!!')
  } else{
    alert('You have not edit product, Error!!!')
  }
  displayTable();
}

// add product 
function addProduct() {
  var nameValue = nameAdd.value.trim();
  var priceValue = priceAdd.value.trim();
  var optionValue = select_cate_add.options[select_cate_add.selectedIndex].value;
  if(nameValue != '' && priceValue != '' && optionValue != '' && imgSrc != undefined ){
    data = {
      name: nameValue,
      price: priceValue,
      idCategory: optionValue,
      image: imgSrc
    }
    
    fetch(`https://fooddy-server.herokuapp.com/products`, {
    method: 'POST',
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((responseJson) => console.log(responseJson));
    alert('You have Add product, Success!!!')
  }else{
   alert('You have not Add product, Error!!!')
  }
  cleatDateInput()
  displayTable() 
}

// clear data input 

function cleatDateInput(){
  nameAdd.value = ''
  priceAdd.value = ''
  document.querySelector(
    `.box_img_add`
  ).style.backgroundImage = `none`;
}

// detele product 
function deleteProduct(id){
  fetch(`https://fooddy-server.herokuapp.com/products/${id}`, {
    method: 'DELETE'
  })
  alert('You have Delete product, Success!!!')
  displayTable() 
}

showCategory(select_cate_add);
displayTable() 