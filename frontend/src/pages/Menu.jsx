import { useEffect, useState } from 'react'
import {
getCategories,
getMenuItems,
createOrder,
getCustomerOrder,
} from '../services/api'

function Menu() {
const [menuItems, setMenuItems] = useState([])
const [categories, setCategories] = useState([])
const [selectedCategory, setSelectedCategory] = useState('All')
const [cart, setCart] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

const [showCheckout, setShowCheckout] = useState(false)
const [customerName, setCustomerName] = useState('')
const [customerPhone, setCustomerPhone] = useState('')

const [placingOrder, setPlacingOrder] = useState(false)
const [orderSuccess, setOrderSuccess] = useState('')
const [orderedTotal, setOrderedTotal] = useState(0)

const [lookupOrderId, setLookupOrderId] = useState('')
const [lookupPhone, setLookupPhone] = useState('')
const [lookupOrder, setLookupOrder] = useState(null)
const [lookupLoading, setLookupLoading] = useState(false)
const [lookupError, setLookupError] = useState('')

useEffect(() => {
const loadData = async () => {
try {
setLoading(true)


    const menuResponse = await getMenuItems()
    const categoryResponse = await getCategories()

    setMenuItems(menuResponse.data || [])
    setCategories(categoryResponse.data || [])
  } catch (err) {
    setError('Failed to load menu. Please try again.')
  } finally {
    setLoading(false)
  }
}

loadData()


}, [])

const filteredItems =
selectedCategory === 'All'
? menuItems
: menuItems.filter(
(item) => item.category_id === Number(selectedCategory)
)

const addToCart = (item) => {
setCart((currentCart) => {
const existingItem = currentCart.find(
(cartItem) => cartItem.id === item.id
)


  if (existingItem) {
    return currentCart.map((cartItem) =>
      cartItem.id === item.id
        ? {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          }
        : cartItem
    )
  }

  return [
    ...currentCart,
    {
      ...item,
      quantity: 1,
    },
  ]
})


}

const increaseQuantity = (id) => {
setCart((currentCart) =>
currentCart.map((item) =>
item.id === id
? {
...item,
quantity: item.quantity + 1,
}
: item
)
)
}

const decreaseQuantity = (id) => {
setCart((currentCart) =>
currentCart
.map((item) =>
item.id === id
? {
...item,
quantity: item.quantity - 1,
}
: item
)
.filter((item) => item.quantity > 0)
)
}

const removeFromCart = (id) => {
setCart((currentCart) =>
currentCart.filter((item) => item.id !== id)
)
}

const cartTotal = cart.reduce(
(total, item) => total + Number(item.price) * item.quantity,
0
)

const handleCheckout = () => {
if (cart.length === 0) {
setError('Your cart is empty.')
return
}


setError('')
setOrderSuccess('')
setShowCheckout(true)


}

const handlePlaceOrder = async () => {
if (!customerName.trim() || !customerPhone.trim()) {
setError('Please enter your name and phone number.')
return
}


if (cart.length === 0) {
  setError('Your cart is empty.')
  return
}

setError('')
setOrderSuccess('')
setPlacingOrder(true)

try {
  const orderData = {
    customer_name: customerName,
    customer_phone: customerPhone,
    items: cart.map((item) => ({
      menu_item_id: item.id,
      quantity: item.quantity,
    })),
  }

  const response = await createOrder(orderData)

  if (response.success) {
    setOrderedTotal(cartTotal)

    setOrderSuccess(
      `Order placed successfully! Your order number is #${response.data.id}.`
    )

    setCart([])
    setCustomerName('')
    setCustomerPhone('')
  }
} catch (err) {
  setError(
    err.response?.data?.message ||
      'Failed to place order. Please try again.'
  )
} finally {
  setPlacingOrder(false)
}


}

const handleLookupOrder = async (event) => {
event.preventDefault()


setLookupError('')
setLookupOrder(null)

if (!lookupOrderId.trim() || !lookupPhone.trim()) {
  setLookupError(
    'Please enter your order number and phone number.'
  )
  return
}

setLookupLoading(true)

try {
  const response = await getCustomerOrder(
    lookupOrderId.trim(),
    lookupPhone.trim()
  )

  if (response.success) {
    setLookupOrder(response.data)
  }
} catch (err) {
  setLookupError(
    err.response?.data?.message ||
      'Failed to find your order. Please check your order number and phone number.'
  )
} finally {
  setLookupLoading(false)
}


}

const getStatusLabel = (status) => {
const labels = {
pending: 'Pending',
preparing: 'Preparing',
ready: 'Ready',
completed: 'Completed',
}


return labels[status] || status


}

if (loading) {
return ( <main className="restaurant"> <header className="restaurant-header"> <p className="restaurant-eyebrow">
FRESH • SIMPLE • DELICIOUS </p>


      <h1>Welcome to Our Restaurant</h1>

      <p>Loading our delicious menu...</p>
    </header>
  </main>
)


}

return ( <main className="restaurant"> <header className="restaurant-header"> <p className="restaurant-eyebrow">
FRESH • SIMPLE • DELICIOUS </p>

```
    <h1>Welcome to Our Restaurant</h1>

    <p>
      Explore our menu, build your order, and enjoy your meal.
    </p>
  </header>

  {error && <p className="error-message">{error}</p>}

  <nav className="category-buttons">
    <button
      className={selectedCategory === 'All' ? 'active' : ''}
      onClick={() => setSelectedCategory('All')}
    >
      All
    </button>

    {categories.map((category) => (
      <button
        key={category.id}
        className={
          selectedCategory === String(category.id)
            ? 'active'
            : ''
        }
        onClick={() =>
          setSelectedCategory(String(category.id))
        }
      >
        {category.name}
      </button>
    ))}
  </nav>

  <section className="menu-grid">
    {filteredItems.map((item) => (
      <div className="menu-card" key={item.id}>
        <h2>{item.name}</h2>

        <p>{item.description}</p>

        <p className="menu-price">
          {Number(item.price).toFixed(2)} ETB
        </p>

        <span className="menu-category">
          {item.category?.name}
        </span>

        <button
          className="add-cart-button"
          onClick={() => addToCart(item)}
        >
          Add to Cart
        </button>
      </div>
    ))}
  </section>

  <section className="cart-section">
    <h2>Your Cart</h2>

    {cart.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      <>
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <div>
              <h3>{item.name}</h3>
              <p>{Number(item.price).toFixed(2)} ETB</p>
            </div>

            <div className="cart-controls">
              <button
                onClick={() => decreaseQuantity(item.id)}
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => increaseQuantity(item.id)}
              >
                +
              </button>

              <button
                className="remove-button"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>

            <p>
              {(
                Number(item.price) * item.quantity
              ).toFixed(2)}{' '}
              ETB
            </p>
          </div>
        ))}

        <div className="cart-total">
          Total: {cartTotal.toFixed(2)} ETB
        </div>

        <button
          className="checkout-button"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </>
    )}
  </section>

  {showCheckout && (
    <section className="checkout-section">
      <h2>Checkout</h2>

      <div className="checkout-form">
        <label>
          Customer Name

          <input
            type="text"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
          />
        </label>

        <label>
          Phone Number

          <input
            type="tel"
            placeholder="Enter your phone number"
            value={customerPhone}
            onChange={(e) =>
              setCustomerPhone(e.target.value)
            }
          />
        </label>

        <div className="checkout-total">
          Order Total:{' '}
          {(orderedTotal > 0
            ? orderedTotal
            : cartTotal
          ).toFixed(2)}{' '}
          ETB
        </div>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {orderSuccess && (
          <p className="success-message">
            {orderSuccess}
          </p>
        )}

        <button
          className="place-order-button"
          onClick={handlePlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder
            ? 'Placing Order...'
            : 'Place Order'}
        </button>
      </div>
    </section>
  )}

  <section className="order-lookup-section">
    <h2>Check Your Order Status</h2>

    <p>
      Enter your order number and the phone number you used
      when placing your order.
    </p>

    <form
      className="order-lookup-form"
      onSubmit={handleLookupOrder}
    >
      <label>
        Order Number

        <input
          type="number"
          min="1"
          placeholder="Example: 5"
          value={lookupOrderId}
          onChange={(e) =>
            setLookupOrderId(e.target.value)
          }
        />
      </label>

      <label>
        Phone Number

        <input
          type="tel"
          placeholder="Example: 0900000000"
          value={lookupPhone}
          onChange={(e) =>
            setLookupPhone(e.target.value)
          }
        />
      </label>

      {lookupError && (
        <p className="error-message">{lookupError}</p>
      )}

      <button
        type="submit"
        className="lookup-button"
        disabled={lookupLoading}
      >
        {lookupLoading
          ? 'Checking Order...'
          : 'Check Order'}
      </button>
    </form>

    {lookupOrder && (
      <div className="order-result">
        <h3>Order #{lookupOrder.id}</h3>

        <p>
          <strong>Customer:</strong>{' '}
          {lookupOrder.customer_name}
        </p>

        <p>
          <strong>Status:</strong>{' '}
          <span
            className={`order-status ${lookupOrder.status}`}
          >
            {getStatusLabel(lookupOrder.status)}
          </span>
        </p>

        <p>
          <strong>Total:</strong>{' '}
          {Number(lookupOrder.total_amount).toFixed(2)} ETB
        </p>

        <h4>Ordered Items</h4>

        <ul>
          {lookupOrder.order_items?.map((item) => (
            <li key={item.id}>
              {item.menu_item?.name || 'Unknown Item'} ×{' '}
              {item.quantity} —{' '}
              {(
                Number(item.price) * item.quantity
              ).toFixed(2)}{' '}
              ETB
            </li>
          ))}
        </ul>
      </div>
    )}
  </section>
</main>


)
}

export default Menu
