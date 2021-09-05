const express = require('express')
const app = express()
const mongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017"

app.use(express.json())
mongoClient.connect(url, (err, db) =>{
    if(err){
        console.log("Error while connecting mongo client")
    }else{
        const nitishdb = db.db('nitishDb')
        const collection = nitishdb.collection('userTable')
        const collection2Food = nitishdb.collection('foodTable')

        app.post('/signup', (req, res) =>{
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }

            const query = { email: newUser.email}
            collection.findOne(query, (err, result) =>{
                if(result == null){
                    collection.insertOne(newUser, (err, result) =>{
                        res.status(200).send()
                    })
                }else{
                    res.status(400).send()
                }
            })
        })

        app.post('/login', (req, res) => {
            const query = {
                email: req.body.email,
                password: req.body.password
            }
            collection.findOne(query, (err, result) => {
                if(result != null){
                    const objToSend = {
                        name: result.name,
                        email: result.email
                    }
                    res.status(200).send(JSON.stringify(objToSend))
                }else{
                    res.status(404).send()
                }
            })
        })

        app.post('/addfood', (req, res) =>{
            const newFood = {
                food_name: req.body.food_name,
                food_price: req.body.food_price,
                category: req.body.category,
                food_description: req.body.food_description
            }

            const query = { food_name: newFood.food_name, food_price: newFood.food_price, category: newFood.category, food_description: newFood.food_description }
            collection2Food.findOne(query, (err, result) =>{
                if(result == null){
                    collection2Food.insertOne(newFood, (err, result) =>{
                        res.status(200).send()
                    })
                }else{
                    res.status(404).send()
                }
            })
        })

        app.post('/getfoodbycategories', (req, res) => {
            const query = {
                category: req.body.category
            }

            collection2Food.find({}).toArray(function(err, result){
                if(result != null){
                    console.log(result)
                    res.status(200).send(JSON.stringify(result))
                }else{
                    res.status(404).send()
                }
            })
           
        })

        app.post('/deletefood', (req, res) =>{
            const food = {
                food_name: req.body.food_name,
                food_price: req.body.food_price,
                category: req.body.category,
                food_description: req.body.food_description
            }

            const query = { food_name: food.food_name, food_price: food.food_price, category: food.category, food_description: food.food_description}
            collection2Food.deleteOne(query, function(err, result) {
                if(result != null){
                    res.status(200).send()
                }else{
                    res.status(400).send()
                }
            })
        })

    }
})
app.listen(3000, () => {
    console.log("Listening on port 3000...")
})