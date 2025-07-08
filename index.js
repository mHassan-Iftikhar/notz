import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileLoader } from 'ejs';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set(express.static(path.join('public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    if(err) {
      console.log(`Error to reading files folder: ${err}`);
    } else {
      res.render("index", {files: files});
    }
  });
});

app.get('/files/:filename', (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, fileData) => {
    if(err) {
      console.log(`Failed to show file: ${err}`);
    } else {
      res.render('show', { filename: req.params.filename, fileData: fileData });
    }
  });
});

app.get('/edit/:filename', (req, res) => {
  res.render('edit', {filename: req.params.filename})
});

app.post('/edit', (req, res) => {
  fs.rename(`./files/${req.body.curr}`, `./files/${req.body.new}`, (err) => {
    if(err) {
      console.log(`Error to change file name": ${err}`);
    } else {
      res.redirect('/');
    }
  });
});

app.post('/create', (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.notes, (err) => {
    if(err) {
      console.log(`Error in writing file: ${err}`);
    }
  });
  res.redirect('/')
});

app.listen(3000);
