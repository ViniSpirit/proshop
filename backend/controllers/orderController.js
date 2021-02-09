import Order from "../models/orderModel.js"
import asyncHandler from "express-async-handler"

//@desc     Create new order
//@route    POST /api/orders
//@acess    private
const addOrderItems = asyncHandler(async (request, response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = request.body

  if (orderItems && orderItems.length === 0) {
    response.status(400)
    throw new Error("No order items")
    return
  } else {
    const order = new Order({
      orderItems,
      user: request.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    response.status(201).json(createdOrder)
  }
})

//@desc     Get order by ID
//@route    GET /api/orders/:id
//@acess    private
const getOrderById = asyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id).populate(
    "user",
    "name email"
  )

  if (order) {
    response.json(order)
  } else {
    response.status(404)
    throw new Error("Order not found")
  }
})

//@desc     Update order to paid
//@route    PUT /api/orders/:id/pay
//@acess    private
const updateOrderToPaid = asyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: request.body.id,
      status: request.body.status,
      update_time: request.body.update_time,
      email_address: request.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    response.json(updatedOrder)
  } else {
    response.status(404)
    throw new Error("Order not found")
  }
})

export { addOrderItems, getOrderById, updateOrderToPaid }
