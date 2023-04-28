const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Temp
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: "john@gmail.com",
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sallu',
            email: "Sallu@gmail.com",
            password: 'apples',
            entries: 0,
            joined: new Date()
        },

    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    // bcrypt.compare("oranges", database.users[2].password, function (err, passRes) {
    //     if (req.body.email === database.users[2].email && passRes) {
    //         return res.json('Success')
    //     }
    //     else {
    //         return res.status(400).json('Error logging in')
    //     }
    // });
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        console.log(`Email: ${req.body.email} \nPassword: ${req.body.password}`)
        return res.json(database.users[0])
    }
    else {
        return res.status(400).json('Error logging in')
    }

})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body

    bcrypt.hash(password, null, null, function (err, hash) {
        database.users.push({
            id: '125',
            name: name,
            email: email,
            password: hash,
            entries: 0,
            joined: new Date()
        })
        res.json(database.users[database.users.length - 1]);
    });


})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })

    if (!found) {
        res.status(404).json(`no user`);
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            res.json(user.entries);
        }
    })

    if (!found) {
        res.status(400).json(`no user`);
    }
})

app.listen(3000, () => {
    console.log('App is running....');
})