import path = require('path')

var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.set('view engine', 'jade')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', render('index'))

function render(file: string):(req, res) => void {
    return function (req, res) {
        res.render(file)
    }
}

server.listen(3000)