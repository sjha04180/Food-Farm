function moveSlider() {
  const track = document.querySelector('.carousel-img');
  const buttons = document.querySelectorAll('.slider_button');
  let currentIndex = 0;

  buttons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      console.log('clicked')
      currentIndex = index;
      let currentSlide = e.target;

      track.src = `/img/bgimg${currentIndex + 1}.png`;

      // Reset all buttons to their original src
      buttons.forEach(btn => {
        btn.src = '/img/circle.svg';
      });

      // Set clicked button to active icon
      currentSlide.src = '/img/disc.svg';
    });
  });
}
moveSlider();


// Get cart from localStorage or initialize
var cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));

}

// Add item to cart
function addToCart(item) {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(item);
  saveCart();
}

// Handle Add to Cart button click
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const item = {
      name: button.dataset.name,
      price: button.dataset.price,
      photo: button.dataset.photo,
      rating: button.dataset.rating,
      quantity: button.dataset.quantity,
    };
    addToCart(item);
    alert(`Added ${item.name} to cart!`);
  });
});

document.querySelectorAll('.product').forEach(product => {

  const addBtn = product.querySelector('.add');
  const subtractBtn = product.querySelector('.subtract');
  const quantityDisplay = product.querySelector('.quantity');
  const itemIndex = product.dataset.index; // assuming product has data-name

  const PRICE = parseInt(cart[itemIndex].price)

  // Add button logic
  addBtn.addEventListener('click', (e, item) => {

    subtractBtn.innerHTML = '';
    subtractBtn.innerHTML = '–';

    // Update the quantity of the item at the current index
    cart[itemIndex].quantity = parseInt(cart[itemIndex].quantity) + 1;

    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update only the quantity shown, not the full product
    const quantityDisplay = document.querySelectorAll('.quantity')[itemIndex];
    quantityDisplay.innerText = cart[itemIndex].quantity;

    // Update item count line
    updateItemCount(cart);

    // Optionally, recalculate total price and update UI
    updateTotalPrice();

  });

  // Subtract / Delete logic
  subtractBtn.addEventListener('click', () => {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      // Optionally, remove item from cart if quantity is 1
      cart.splice(itemIndex, 1);
      // Also remove from DOM
      document.querySelectorAll('.product')[itemIndex].remove();
      document.getElementById("total").remove();
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    const quantityDisplay = document.querySelectorAll('.quantity')[itemIndex];
    if (cart[itemIndex]) quantityDisplay.innerText = cart[itemIndex].quantity;

    updateTotalPrice();


  });

});

function updateItemCount(cart) {
  const itemCount = cart.length;
  const itemText = `Price (${itemCount} item${itemCount > 1 ? 's' : ''}) x `;
  const itemCountElement = document.getElementById("item-count");

  if (itemCountElement) {
    itemCountElement.textContent = itemText;
  }
}


function updateTotalPrice() {

  // Total MRP (before discount)
  let total_price = cart.reduce((sum, item) => sum + parseInt(item.price) * (item.quantity || 1), 0);

  // Calculate discount
  let discount = 0;
  if (total_price >= 3000) discount = 300;
  else if (total_price >= 2000) discount = 200;
  else if (total_price >= 1000) discount = 100;

  const convenienceFee = 9;
  let final = total_price - discount + convenienceFee;

  // Update the DOM
  let total = document.getElementById("total");
  total.classList.remove("hidden");
  total.innerHTML = ""
  total.innerHTML = `
    <p class="text-2xl text-[#878787]  pt-3 pl-5 border border-t-white border-x-white border-b-[#878787] ">Price
      Details</p>
    <div class="bill_amount flex flex-col gap-5 py-3 px-5">
      <div class="total_price flex justify-between">
        <p id="item-count">Price (${cart.length} item${cart.length > 1 ? 's' : ''}) </p> 
        <p class="font-bold">₹${total_price}</p>
      </div>
      <div class="discount flex justify-between"> 
        <p>Discount</p>
        <p class="text-[#388E3C] font-bold">-₹${discount}</p>
      </div>
      <div class="conFee flex justify-between">
        <p>Convenience Fee</p>
        <p>₹${convenienceFee}</p>
      </div>
      <div class="total_bill flex justify-between border border-dashed border-x-white border-y-[#878787] py-4 px-3 font-bold text-lg ">
        <p>Total Amount</p>
        <p>₹${final}</p>
      </div>
      <div class="msg font-bold text-[#388E3C]">
        <p>You will save ₹${discount} on this order</p>
      </div>
    </div>
    <button 
      id="pay-button" 
      data-amount="${final}" 
      class="order bg-[#388E3C] text-center text-amber-50 p-4 text-lg font-bold cursor-pointer">
      Place Order
    </button>
  `;


  document.getElementById("pay-button").addEventListener("click", handlePayment);

  async function handlePayment(e) {
    e.preventDefault();

    const amount = this.dataset.amount;

    const response = await fetch("/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    const order = await response.json();

    const options = {
      key: order.razorpay_key,
      amount: amount * 100,
      currency: "INR",
      name: "FoodFarm",
      description: "Test Order",
      order_id: order.id,
      handler: function (response) {
        alert("Payment Successful!");
        const total = document.getElementById("total");
        total.innerHTML = "";
        total.classList.toggle('hidden');
        localStorage.setItem("cart", JSON.stringify([]));
        window.location.href = `/payment-success?payment_id=${response.razorpay_payment_id}`;
      },
      prefill: {
        name: "Sachin",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: { color: "#388E3C" }
    };

    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      alert("Oops! Something went wrong. Payment Failed");
      console.log(response.error);
    });
  }

}


//For responsiveness
function open_menu(){
const moreButton = document.getElementById('more_button');
const options = document.getElementById('options');
console.log(options.classList);

if (moreButton && options) {
  moreButton.addEventListener('click', () => {

    console.log('clicked');
    options.classList.toggle('hidden');
    console.log(options.classList);
  });
}


}
open_menu();

