const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors')
const tmi = require('tmi.js');
const res = require('express/lib/response');



app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'password',
    database: 'mydb',
})

let twitchUsernames = []
db.query("SELECT * FROM username", (err, result) => {
    if (err) console.log(err)
    else {
        result.forEach(el => {
            twitchUsernames.push(el.username)
        })
  
    }
})

app.post('/create', (req, res) => {
    const userName = req.body.userName
    twitchUsernames.push(userName)

    db.query('INSERT INTO username (username) VALUES (?)', [userName], (err, result) => {
        if (err) console.log(err);
        else {
            
            res.send("Username inserted")
        }
    })
})

app.get('/messages', (req, res) => {
    const user = req.query.user
    let userId;
    // finds the current users ID
    db.query('SELECT * FROM `username` WHERE `username` = ?', [user], (err, results) => {
        if (err) console.log(err)
        else console.log(results[0].id)
        userId = results[0].id
        
    })
    // returns all of the users messages with the matching ID
    setTimeout(() => {
        db.query('SELECT * FROM `messages` WHERE `id` = ?', [userId], (err, results) => {
            if (err) console.log(err)
            
            else res.send(results)
            
        })
    }, 1000)
})


app.get('/users', (req, res) => {
    db.query("SELECT * FROM username", (err, result) => {
        if (err) console.log(err)
        else {
           // console.log(twitchUsernames)
            res.send(result)
        }
    })
})

const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true
    },

    channels: twitchUsernames
  });
  
  client.connect();
  
  client.on('message', (channel, tags, message, self) => {
    console.log(`${tags['display-name']}: ${message} ${channel}`);
    console.log(message)
    let currentUser = channel.slice(1)
    console.log(currentUser)
    let currentFk;
    db.query('SELECT * FROM `username` WHERE `username` = ?', [currentUser], (err, results) => {
        if (err) console.log(err)
        else console.log(results[0].id)
        currentFk=results[0].id
        
    })
   console.log(currentFk)
    setTimeout(() => {
        db.query("INSERT INTO messages (`message`, `id`) VALUES (?,?)", [message, currentFk], (err, result) => {
        if (err) console.log("I hit an error", err, "currentFk", currentFk)
        else console.log("Success", result, message, currentFk)
    })}, "1000")
  });

app.listen(3001, () => {
    console.log("Server running on port 3001")
})