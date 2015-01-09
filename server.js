var express = require('express')

var app = express();

var names=[];
var rooms=[];
var times=[];

var cleanindex = 0;

function cleaner()
{
    var len=names.length;
    if (cleanindex < len)
    {
        var now = new Date().getTime();
        var delta = now - times[cleanindex];
        if (delta > 60000) {
            names.splice(cleanindex,1);
            rooms.splice(cleanindex,1);
            times.splice(cleanindex,1);
        } else {
            cleanindex++;
        }
        return;
    }
    cleanindex = 0;
}

app.set('view engine','ejs');

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: '25-8392-348-49'}));

app.get('/', function(req, res){
	console.log(req.url);
	res.render('login');
});

app.get('/list', function(req, res){
    console.log(req.url);
    cleaner()
	var name = req.query.name;
    var room = req.query.room;
    var index = names.indexOf(name);
    if (room == "0")
    {
        if (index != -1)
        {
            console.log("Erase previous entry");
            names.splice(index,1);
            rooms.splice(index,1);
            times.splice(index,1);
        }
    } else {
        var timestamp = new Date().getTime();
        if (index == -1)
        {
            names.push(name);
            rooms.push(room);
            times.push(timestamp);      
        } else {
            times[index]=timestamp;
            if (rooms[index] != room)
            {
                console.log("Room number changed");
                rooms[index]=room
            }   
        }     
    } 
    res.render('list',{name: name,names: names,room: room, rooms: rooms});
});


app.post('/start', function(req, res){
    console.log(req.url);
	var name = req.body.name;
    res.render('start',{name: name});
});




app.listen(4000);
