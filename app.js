// Connection to database
const mysql = require('mysql')

const connection = mysql.createConnection({
    host:'localhost',
    database:'login',
    user:'yashwant',
    password:'password'
});

connection.connect((error)=>{
    if(error)
    {
        console.log("ERROR CONNECTING TO DATABSE!!!")
    }
    else
    {
        console.log("CONNECTED TO DATABASE!!!")
    }
})

// Express

const express = require('express')
const path = require('path')
const session = require('express-session');
var bodyParser = require('body-parser');

const exp = express()

// middlewear
exp.use(bodyParser.urlencoded())

exp.use(express.json())

exp.use(session({
    secret:'yashwant',
    resave:'true',
    saveUninitialized:'true'
}))


exp.set('views',path.join(__dirname,'views'))
exp.set('view engine','ejs')


// serving

exp.get('/',(req,res)=>{
    res.render('home')
})


exp.get('/index',(req,res)=>{
    res.render('index',{session: req.session})
})

exp.get('/register',(req,res)=>{
    res.render('register')
})

// login

exp.post('/login',(request,response)=>{
    user_email = request.body.user_email;
    user_password = request.body.user_password;
    if(user_email && user_password)
    {
        var query=`
            select * from login.info
            where user_email = "${user_email}";
        `
        connection.query(query,(func,data)=>{
            if(data.length > 0)
            {
                for(var count=0;count<data.length;count++)
                { 
                    if(data[count].user_password == user_password)
                    {
                        request.session.user_id=data[count].user_id
                        response.redirect("/")
                    }
                    else
                    {
                        response.send("INCORRECT PASSWORD")
                    }
                }
            }
            else
            {
                response.send("INCORRECT EMAIL")
            }
            response.end()
        })
    }
    else
    {
        response.send("PLEASE ENTER EMAIL AND PASSWORD")
        response.end()
    }
})

// register

exp.post('/register',(req,res)=>{
    email = req.body.email;
    password = req.body.password;
    console.log(`EMAIL = ${email}\nPASSWORD = ${password}`)
    if(email && password)
    {
        var query = `
            INSERT INTO info(user_email,user_password)
            values('${email}','${password}');
        `
        connection.query(query,(err,data)=>{
            if(err)
            {   
                throw err
            }
            else
            {
                res.redirect('/')
            }
        })
    }
    else
    {
        res.send("Both fields are important")
        res.redirect('/')
    }
})

// logout

exp.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect("/")
})

exp.listen(80,()=>{
    console.log("CONNECTED TO SERVER")
})