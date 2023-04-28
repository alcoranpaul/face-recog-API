const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')
const register = require('./constrollers/register')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'postgreadmin',
        database: 'smartbrain',
    }
});



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
    res.send('Success')
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const passValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (passValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => {
                        res.status(400).json('unable to get user')
                    })
            }
            else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => {
            res.status(400).json('wrong credentials')
        })
})

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    })
        .then(user => {
            if (user.length > 0) {
                res.json(user)
            }
            else {
                res.status(400).json('no user')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => res.status(400).json('unable to get count entries'))
})

app.listen(3000, () => {
    console.log('App is running....');
})