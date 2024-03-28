const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const collection = require('./config')
const app = express()

app.use(express.json())

app.use(express.urlencoded({extended:false}))

app.set('view engine', 'ejs')

app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("Login")
})

app.get("/signup", (req, res) => {
    res.render("Signup")
})

app.post("/signup", async (req, res) => {
    const data = {
        name:req.body.username,
        password:req.body.password
    }

    const existingUser = await collection.findOne({name:data.name})

    if(existingUser) {
        res.send("User already exists. Please choose a different username.")
    } else {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(data.password, saltRounds)
        data.password = hashedPassword
        const userdata = await collection.insertMany(data)
        console.log(userdata)
    }
})

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({name:req.body.username})
        if(!check)
        {
            res.send("User name not found")
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
        if(isPasswordMatch) {
            res.render("Home")
        }
        else {
            res.send("Wrong Password")
        }
    }
    catch {
        res.send("Wrong Details")
    }
})


const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`)
})