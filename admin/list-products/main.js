var list = document.getElementById("list");
var products = JSON.parse(localStorage.getItem("products"));
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
  var products = JSON.parse(localStorage.getItem("products"));
  list.innerHTML = "";
  var item = "";
  products.map((product) => {
    let image = `img-${product.id}`;
    item = `
    <tr>
      <td class="images">
          <div class="box_img_td ${image}"></div>
      </td>
      <td class="text-capitalize">${product.name}</td>
      <td class="text-capitalize">${product.price}đ</td>
      <td>
       <button class="btn text-success" data-toggle="modal" data-target="#editModal" id="openEditModal${product.id}"><i class="far fa-edit"></i></button>
       /
      <button class="btn text-danger" id="delete${product.id}"><i class="fa fa-trash"></i></button> 
      </td>
    </tr>  
  `;
    list.innerHTML += item;
    document.querySelector(
      `.${image}`
    ).style.backgroundImage = `url(${product.image})`;
    document
      .getElementById("openEditModal" + product.id)
      .setAttribute("onclick", `openEditModal("${product.id}")`);
    document
    .getElementById("delete" + product.id)
    .setAttribute("onclick", `deleteProduct("${product.id}")`);
  });
}

// load data in edit modal
function loadData(id){
  var products = JSON.parse(localStorage.getItem("products"));
  products.map((product) =>{
    if(product.id === id){
      nameEdit.value = product.name;
      priceEdit.value = product.price
      imageEdit.style.background = `url(${product.image})`
      nameItem.textContent = product.name
      priceItem.textContent = product.price + "đ"
    }
  })
  showCategory(select_cate_edit)
}
// show category in selete
function showCategory(select) {
  select.innerHTML = '';
  var options = '';
  var categories = JSON.parse(localStorage.getItem("categories"));
  select.innerHTML = '';
  var options = '';
  categories.map(cate =>{
    options += '<option value="' + cate.id+ '">' + cate.name + '</option>';
    select.innerHTML = options
  })
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
    console.log(nameValue, priceValue, optionValue, imgSrc)
    var productNew = products.map(
      (product) =>product.id === id 
      ? {...product, name: nameValue,price:priceValue,idCategory:optionValue,image:imgSrc}
      :product
    )
    localStorage.setItem('products',JSON.stringify(productNew))
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
      id: Date.now(),
      name: nameValue,
      price: priceValue,
      idCategory: optionValue,
      image: imgSrc
    }

    products = [...products, {...data}]
    localStorage.setItem('products',JSON.stringify(products))
    alert('You have Add product, Success!!!')
   
  }else{
   console.log(nameValue,priceValue,optionValue,imgSrc)
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
  var productNew = products.filter(product => product.id != id)

  localStorage.setItem('products',JSON.stringify(productNew))
  alert('You have Delete product, Success!!!')
  displayTable() 
}

showCategory(select_cate_add);
displayTable() 