var list = document.querySelector('.list');
let cartItems = localStorage.getItem("cart");
let productNumber = parseInt(localStorage.getItem('cartNumber'))
const cart_empty = document.getElementById('cart_empty')
cartItems = JSON.parse(cartItems) || {};
cartItems = Object.values(cartItems) || [];
const ADD="ADD"
const SUB="SUB"


function getTotal(){
    let total = cartItems.reduce((acc, cum) => acc + parseInt(cum.price * cum.quantity), 0)
    document.getElementById('total').textContent = total;
}

function showItems(){
    if(productNumber >= 0){
        cart_empty.classList.add('cart_empty');
    }
}


function getQuantity() {
    let quantity = 0;
   if(cartItems){
    cartItems.map(item => quantity += item.quantity);
   }
   document.getElementById('your_cart').textContent = `You have ${quantity || 0} items in your cart` 
   localStorage.setItem("cartNumber", quantity);
    return quantity;
}

function changeQuantity(method, id){  
    let newCart;
    if(method == SUB ){
        if (cartItems.length === 1) {
            localStorage.setItem("cartNumber", 0);
            document.getElementById('total').textContent = 0;
            document.getElementById('your_cart').textContent = `You have 0 items in your cart`
        }      
        newCart = cartItems.map(item => {
            if(item.id == id){
                if(item.quantity == 1){
                    return null
                }else{
                    return {...item, quantity: item.quantity - 1}
                }
            }else{
                return item
            }
        })
    }else{        
        newCart = cartItems.map(item => item.id === id ? {...item, quantity: item.quantity + 1} : item)
    }
    newCart = newCart.filter(i => i != null);
    cartItems = [...newCart];
    newCart = newCart.reduce((a,b)=> (a[b.id] = b,a), {})

    localStorage.setItem('cart' ,JSON.stringify(newCart))
    
    displayCartItem()
}


function clearCart() {
    localStorage.removeItem('cart');
    localStorage.removeItem('cartNumber');
    displayCartItem();
}

function displayCartItem(){
    list.innerHTML = ''
    cartItems = localStorage.getItem("cart");
    cartItems = JSON.parse(cartItems) || {};  
    cartItems = Object.values(cartItems);
    let row = '';
   cartItems.map(item =>{
    let image = `img-${item.id}`
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
                    <button type="button" id="add-${item.id}" class="btn"><i class="fas fa-plus icon_button"
                        ></i></button>
                    </div>
                </td>
                <td>${item.price}</td>
                <td>${item.price * item.quantity}</td>
              </tr>
              `
        list.innerHTML += row;
        document.querySelector(`.${image}`).style.backgroundImage = `url(${item.image})`
        document.getElementById("sub-" + item.id).setAttribute("onclick", `changeQuantity(${SUB},"${item.id}")`)
        document.getElementById("add-" + item.id).setAttribute("onclick", `changeQuantity(${ADD},"${item.id}")`)
        getQuantity()
        getTotal()
        showItems() 
   })
}

displayCartItem();
getQuantity();