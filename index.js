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
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null,Date.now()  + '-' + file.originalname)
  }
});
var upload = multer({storage: storage});
app.use(express.static('public'));
app.use(express.static('./public/uploads/'));
app.use(express.static('./public/static/'));
app.set('views', './public/views')
app.set('view engine', 'pug')

app.get('/home', (req, res, next)=> {
    const path = 'public/uploads/';
    fs.readdir(path, function(err, items) {  
        console.log(items);   
        items.sort(function(a, b) {
            return fs.statSync(path + b).mtime.getTime() - 
                   fs.statSync(path + a).mtime.getTime();
        });   
        res.render('index', { 
            title: 'Kenziegram', 
            images: items
        });
    });
  })

app.post('/upload', upload.single('myfile'), function (req, res, next) {
    // req.file is the `myfile` file
    // req.body will hold the text fields, if there were any
  console.log("Uploaded: " + req.file.filename);
  uploaded_files.push(req.file.filename);
  res.render('uploadsuccess',{image:req.file.filename});
})  
app.listen(port);