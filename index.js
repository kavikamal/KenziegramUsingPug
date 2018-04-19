const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pug = require('pug')
const port = 3000;
const app = express();
const uploaded_files = [];
//var path    = require("path");
var storage = multer.diskStorage({
  
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/') 
  },
  filename: (req, file, cb) => {
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null,Date.now()  + '-' + file.originalname)
  }
});
var upload = multer({storage: storage});
app.use(express.static('public'));
app.use(express.static('./public/uploads/'));
app.use(express.static('./public/static/'));
app.use(express.json())
app.set('views', './public/views')
app.set('view engine', 'pug')

app.get('/', (req, res, next)=> {
    const path = 'public/uploads/';
    fs.readdir(path, function(err, items) {  
        //console.log(items);   
        items.sort(function(a, b) {
            return fs.statSync(path + b).mtime.getTime() - 
                   fs.statSync(path + a).mtime.getTime();
        });   
        
        res.render('index', { 
            title: 'Kenziegram', 
            images: items,
            after: fs.statSync(path + items[0]).mtime.getTime()
        });
    });
  })
  
app.post('/latest', (req, res, next)=> {
    const path = 'public/uploads/'; 
    fs.readdir(path, function(err, items) {        
        items=items.filter((a)=> {
            return fs.statSync(path + a).mtime.getTime() > req.body.after
        }); 
        if (items.length>1) {
          items.sort(function(a, b) {
            return fs.statSync(path + a).mtime.getTime() - 
                   fs.statSync(path + b).mtime.getTime();
        });
        }       
        res.send(items);
    });
  })  
app.post('/upload', upload.single('myfile'),  (req, res, next)=> {
    // req.file is the `myfile` file
    // req.body will hold the text fields, if there were any
  console.log("Uploaded: " + req.file.filename);
  uploaded_files.push(req.file.filename);
  res.render('uploadsuccess',{image:req.file.filename});
})  

app.listen(port);