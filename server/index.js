const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors')
const tmi = require('tmi.js');
const { Server } = require('socket.io');
const http = require('http');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();


app.use(express.json())
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        transports: ['websocket']
    }
})





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
            // console.log(result, "IM INSIDE SERVER CREATE")
            clientUpdate()
            res.send({
                id: result.insertId, 
                username: userName})
        }
    })
})

app.delete('/delete', (req, res) => {

    const userName = req.query.userName
        const id = req.query.id
        console.log(twitchUsernames, "tw usernames before mod")
    const index = twitchUsernames.indexOf(userName)
    twitchUsernames.splice(index, 1)
    console.log(twitchUsernames, "tw usernames after mod")
    client.disconnect()
    console.log("just disconnected from client, working")
 

    db.query("DELETE FROM messages WHERE id = ?", id, (err, result) => {
        if (err) {
          console.log(err);
        } else {
            console.log("Successfully deleted message from ")
        }
      });

      db.query("DELETE FROM username WHERE id = ?", id, (err, result) => {
        if (err) {
          console.log(err);
        } else {
            console.log("Successfully deleted user")
            setTimeout(() => {
                console.log("about to try to reconnect")
                client.connect()
            }, 1000
            )
        }
      });
    
    console.log("server del", userName, id)
    res.send(true)
})

app.get('/singlemessage', (req, res) => {
    const id = req.query.id

    // returns latest message with the matching ID
     db.query('SELECT * FROM `messages` WHERE `id` = ? ORDER BY `messages_id` DESC LIMIT 1', [id], (err, results) => {
        if (err) console.log(err)
            
        else {
            // console.log("/MESSAGES SERVER RESULTS",results)
    
            res.send(results)
            
        }
            
    })
  
})
  
app.get('/messages', (req, res) => {
   const id = req.query.id
    console.log("server id sent", id)
    // returns all of the users messages with the matching ID
     db.query('SELECT * FROM `messages` WHERE `id` = ?', [id], (err, results) => {
        if (err) console.log(err)
            
        else {
            // console.log("/MESSAGES SERVER RESULTS",results)
    
            res.send(results)
            
        }
            
    })
  
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
    
        channels: twitchUsernames,
        options: {
            joinInterval: 2000
        }
      });
     
      client.connect();
     
     
      
      client.on('message', (channel, tags, message, self) => {
          
        console.log(`${tags['display-name']}: ${message} ${channel}`);
        let currentUser = channel.slice(1)
        let msgSentiment = sentiment.analyze(message).score
        let currentFk;
        db.query('SELECT * FROM `username` WHERE `username` = ?', [currentUser], (err, results) => {
            if (err) console.log(err)
            else console.log(results[0].id)
            currentFk=results[0].id

            
        })
    //    console.log("TMI CLIENT USER / ID / MESSAGE", currentUser, currentFk, message)
        setTimeout(() => {
            db.query("INSERT INTO messages (`message`, `id`, `sentiment`) VALUES (?,?,?)", [message, currentFk, msgSentiment], (err, result) => {
                
            if (err) console.log("I hit an error", err, "currentFk", currentFk)
            else {
                io.emit(currentUser)
    
                // console.log("Success in TMI CLIENT, result, msg, id", result, message, currentFk)
            }
        })}, "1000")
      });

    

      const clientUpdate = () => {
          console.log("Trying to update the client")
          client.channels = twitchUsernames
          console.log(client.channels)
          client.disconnect()
          setTimeout(() => {
              client.connect()
          }, 1000
          )
      }


server.listen(3001, () => {
    console.log("Server running on port 3001")
})