const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())


const orders = []

const checkOrderId = (request, response, next) => {
    const { id }= request.params

    const index = orders.findIndex(order => order.id === id)

    if( index < 0) {
        return response.status(404).json({ error: "User not found"})
    }
  
    request.orderIndex = index
    request.orderId = id

    next()
}

const checkOrderRequest = (request, response, next) => {
    const method = request.method
    const url = request.url

    console.log(` [${method} - ${url}]`)

    next()
}

app.get('/order', checkOrderRequest, (request, response) => {
    return response.json(orders)
    
})


app.post("/order", checkOrderRequest, (request, response) => {
    const { order, clientName, price, orderStatus } = request.body

    const orderNew = { id: uuid.v4(), order, clientName, price, orderStatus }
   
    orders.push(orderNew)
  
    return response.status(201).json(orderNew)
})


app.put('/order/:id', checkOrderId, checkOrderRequest, (request, response) => {
    const { order, clientName, price, orderStatus } = request.body
    
    const index = request.orderIndex
    const id = request.orderId 

    const updatedOrder = { id, order, clientName, price, orderStatus}
   
    orders[index] = updatedOrder

    return response.json(updatedOrder)

})

app.delete("/order/:id", checkOrderId, checkOrderRequest, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})


app.patch("/order/:id", checkOrderId, checkOrderRequest,(request, response) => {
    const index = request.orderIndex

    orders[index].orderStatus = "Pronto"
    
    return response.json(orders[index])
})


app.get('/order/:id', checkOrderId, checkOrderRequest, (request, response) => {
    const index = request.orderIndex

    const orderFixed= orders[index]

    return response.json(orderFixed)
    
})

app.listen(port, () => {

    console.log(`Server started on port ${port} 🚀 `)

})