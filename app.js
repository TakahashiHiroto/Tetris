const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));  //trueにしてみた。


app.get('/', (req, res) => {
  const db = new sqlite3.Database('db.sqlite3');
  db.serialize(function() {
    db.all('SELECT name,score FROM USER', function(err, rows) {
      const returndata = rows;
      console.log(returndata);
      res.render('top.ejs',{data:returndata});  //top.ejs内でのdataの定義。
    });
  });
  db.close();
});

app.post('/post', (req, res) => {
  const db = new sqlite3.Database('db.sqlite3');  
  const name = req.body['name'];
  const score = req.body['score'];
  db.run(
      'insert into user (name,score) values (?,?)',
      name,
      score
  );
  res.redirect('/');
});

app.get('/tetris', (req, res) => {
  const db = new sqlite3.Database('db.sqlite3');
  db.serialize(function() {
    db.all('SELECT name,score FROM USER order by score desc', function(err, rows) {
      const returndata = rows; //↑にクエリ文を書いてソートする。(種類分け)
      res.render('tetris.ejs',{data:returndata});  //tetris.ejs内でのdataの定義。
    });
  });
  db.close();
});

app.get('/ranking', (req, res) => {
  const db = new sqlite3.Database('db.sqlite3');
  db.serialize(function() {
    db.all('SELECT name,score FROM USER order by score desc', function(err, rows) {
      const returndata = rows; //↑にクエリ文を書いてソートする。(種類分け)
      res.render('ranking.ejs',{data:returndata});  //ranking.ejs内でのdataの定義。
    });
  });
  db.close();
});

app.listen(process.env.PORT || 8000);