var list = document.getElementById("list");
var categories = JSON.parse(localStorage.getItem("categories"));
var nameEditIp = document.getElementById("nameEdit");
var nameAddIp = document.getElementById("nameAdd");
var imageFile = document.getElementById("file");
var edit_success = document.getElementById("edit_success");
var add_success = document.getElementById("add_success");
var imgSrc;

function previewFile() {
  const file = imageFile.files[0];
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      imgSrc = reader.result;
      document.querySelector(
        `.box_img`
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

function onFileSelected(event) {
  if (event.target.files.length > 0) {
    var src = URL.createObjectURL(event.target.files[0]);
    imageFile.src = src;
    document.querySelector(
      `.box_img`
    ).style.backgroundImage = `url(${imageFile.src})`;
  }
}

function displayTable() {
  var cate = JSON.parse(localStorage.getItem("categories"));
  list.innerHTML = "";
  var item = "";
  cate.map((category) => {
    let image = `img-${category.id}`;
    item = `
      <tr>
        <td class="images">
            <div class="box_img_cate ${image}"></div>
        </td>
        <td class="text-capitalize">${category.name}</td>
        <td>
         <button class="btn text-success" data-toggle="modal" data-target="#exampleModal" id="openEditModal${category.id}"><i class="far fa-edit"></i></button>
         /
        <button class="btn text-danger" id="delete${category.id}"><i class="fa fa-trash"></i></button> 
        </td>
      </tr>  
    `;
    list.innerHTML += item;
    document.querySelector(
      `.${image}`
    ).style.backgroundImage = `url(${category.image})`;
    document
      .getElementById("openEditModal" + category.id)
      .setAttribute("onclick", `openEditModal("${category.id}")`);
    document
    .getElementById("delete" + category.id)
    .setAttribute("onclick", `deleteCate("${category.id}")`);
  });
}

function loadData(id) { 
  var cate = JSON.parse(localStorage.getItem("categories"));
  cate.map((cate) => {
    if (cate.id == id) {
      nameEditIp.value = cate.name;
      document.querySelector(
        `.box_img`
      ).style.backgroundImage = `url(${cate.image})`;
    }
  });
}

// edit cate
function editCategory(id) {
  var nameValue = nameEditIp.value.trim();

  var cateNew = categories.map((cate) =>
    cate.id === id ? { ...cate, name: nameValue, image: imgSrc } : cate
  )
  localStorage.setItem("categories", JSON.stringify(cateNew))
  edit_success.style.visibility = "visible";
  displayTable();
}

// delete cate
function deleteCate (id){
 var cateNew = categories.filter(cate => cate.id != id)
 localStorage.setItem("categories", JSON.stringify(cateNew))
 alert('You have delete catetory success!')
  displayTable();
}

// open modal edit
function openEditModal(id) {
  loadData(id);
  document
  .getElementById("editCategory")
  .setAttribute("onclick", `editCategory("${id}")`);
}

// add cate
function addCate() {
  var nameValue = nameAddIp.value.trim();

  data = {
    id: Date.now(),
    name: nameValue,
    image: imgSrc
  }
  categories = [...categories, {...data}]
  localStorage.setItem("categories", JSON.stringify(categories));
  add_success.style.visibility = "visible";
  displayTable();
}
displayTable();