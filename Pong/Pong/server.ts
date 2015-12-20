import path = require('path')

var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var SerialPort = require("serialport").SerialPort
var serial1 = new SerialPort("/dev/ttyUSB0", {
    baudrate: 9600
});
var serial2 = new SerialPort("/dev/ttyUSB1", {
    baudrate: 9600
});

var bat1X: number = 0;
var bat2X: number = 0;

serial1.on("open", function () {
    console.log('Connected to USB 1 serial device!');
    serial1.on('data', function (data) {
        console.log(data);
        bat1X = data;
    });
});

serial2.on("open", function () {
    console.log('Connected to USB 2 serial device!');
    serial2.on('data', function (data) {
        console.log(data);
        bat2X = data;
    });
});

app.set('view engine', 'jade')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', render('pong'))

function render(file: string): (req, res) => void {
    return function (req, res) {
        res.render(file)
    }
}

io.on('connection', function (socket) {
    socket.on('getBatPos', function (bat: number) {
        var x = bat == 1 ? bat1X : bat2X;
        socket.emit("batPos", bat, x);  
    })
})

server.listen(3000)