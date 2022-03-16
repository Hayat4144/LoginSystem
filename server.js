// initailze all the module
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const model = require('./model/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const JWT_SECRET = "sdljfldsjffsuoiu23sf23#23423&@!()sdfjlkdj2384s23duewioru"




// connecting to the database

mongoose.connect('mongodb://localhost:27017/login-app-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log('connected')).catch(err => console.loge(err));


// static file serve 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))



app.get('/', (req, res) => {
    res.render('index');
});


// geting form data from the client and save to the database
app.post('/api-register', async (req, res) => {
    const { username, password: PlaintextPassword } = req.body;

    // console.log(`${username} and ${password}`);
    if (!username) {
        return res.json({ status: 'error', error: 'username cant be empty ' });
    }
    if (!PlaintextPassword) {
        return res.json({ status: 'error', error: 'password cant be empty ' });
    }

    const password = await bcrypt.hash(PlaintextPassword, 10)
    try {
        const response = await model.create({
            username,
            password
        });
        console.log(response);
        res.redirect('/login.html')
    } catch (err) {
        console.log(err);
    }


});


// login the user 
app.post('/api-login', async (req, res) => {

    try {
        const { username, password } = req.body;
        console.log(`${username} and ${password}`);

        const result = await model.findOne({ username }).lean();
        console.log(result);

        if (result && await bcrypt.compare(password, result.password)) {

            const token = jwt.sign({
                id: result._id,
                username: result.username
            }, JWT_SECRET);
            // res.json({status:200, data:token})
            res.cookie('Access_Token', token,{
                httpOnly:true,
                maxAge: 2 * 60 * 60 * 1000
            });


            res.redirect('/home.html')
        }
        else {
            res.json({ status: 'error', error: 'Invalid username/password' })
        }

    } catch (err) {
        console.log(err);
    }
})

app.listen(3000, () => {
    console.log('running at 3000 ');
})