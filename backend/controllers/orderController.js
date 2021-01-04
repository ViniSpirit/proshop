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

export { addOrderItems }
