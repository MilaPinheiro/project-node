const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())


const orders = []

const checkUserId = (request, response, next) => {
    const { id }= request.params

    const index = orders.findIndex(order => order.id === id)

    if( index < 0) {
        return response.status(404).json({ error: "User not found"})
    }
  
    request.userIndex = index
    request.userId = id

    next()
}

app.get('/order', (request, response) => {
    return response.json(orders)
    
})

app.post("/order", (request, response) => {
    const { order, clientName, price, orderStatus } = request.body

    const orderNew = { id: uuid.v4(), order, clientName, price, orderStatus }
   
    orders.push(orderNew)
  
    return response.status(201).json(orderNew)
})


app.put('/order/:id', checkUserId, (request, response) => {
    const { order, clientName, price, orderStatus } = request.body
    const index = request.userIndex
    const id = request.userId 

    const updatedOrder = { id, order, clientName, price, orderStatus}
   
    orders[index] = updatedOrder

    return response.json(updatedOrder)

})

app.delete("/order/:id", checkUserId, (request, response) => {
    const index = request.userIndex

    orders.splice(index, 1)

    return response.status(204).json()
})


app.patch("/order/:id", checkUserId,(request, response) => {
    const index = request.userIndex

    orders[index].orderStatus = "Pronto"
    
    return response.json(orders[index])
})


app.listen(port, () => {

    console.log(`Server started on port ${port} 🚀 `)

})