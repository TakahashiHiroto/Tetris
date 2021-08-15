const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const mysql = require('mysql');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));  //trueにしてみた。


//mysqlの時の設定。

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hirohiro0724',
  database: 'tetris'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM user',
    (error, results) => {
      console.log(results);
      res.render('top.ejs');
    }
  );
});

//以下はdbにdataを入力をするためだけのサーバーを立てている感じ。

app.post('/post', (req, res) => {
  var result = {
    name: req.body.name ,
    score:req.body.score
  };
  console.log(result);
  connection.query(
      'insert into user set ?',result,(err, results) => {
        if (err) throw err;
        res.redirect('/');
      });
});
// ↑の？の部分の引数を後ろ二つで定義している。

app.get('/tetris', (req, res) => {
  connection.query(
    'SELECT * FROM user',
    (error, results) => {
      const returndata = results;
      res.render('tetris.ejs',{data:returndata});
    }
  );
});

app.get('/ranking', (req, res) => {
  connection.query(
    'SELECT name,score FROM USER order by score desc',
    (error, results) => {
      const returndata = results;
      res.render('ranking.ejs',{data:returndata});
    }
  );
});

app.listen(process.env.PORT || 8000);


//sqliteの時の設定。

// app.get('/', (req, res) => {
//   const db = new sqlite3.Database('db.sqlite3');
//   db.serialize(function() {
//     db.all('SELECT name,score FROM USER', function(err, rows) {
//       const returndata = rows;
//       console.log(returndata);
//       res.render('top.ejs',{data:returndata});  //top.ejs内でのdataの定義。
//     });
//   });
//   db.close();
// });

// app.post('/post', (req, res) => {
//   const db = new sqlite3.Database('db.sqlite3');  
//   const name = req.body['name'];
//   const score = req.body['score'];
//   db.run(
//       'insert into user (name,score) values (?,?)',
//       name,
//       score
//   );
//   res.redirect('/');
// });

// app.get('/tetris', (req, res) => {
//   const db = new sqlite3.Database('db.sqlite3');
//   db.serialize(function() {
//     db.all('SELECT name,score FROM USER order by score desc', function(err, rows) {
//       const returndata = rows; //↑にクエリ文を書いてソートする。(種類分け)
//       res.render('tetris.ejs',{data:returndata});  //tetris.ejs内でのdataの定義。
//     });
//   });
//   db.close();
// });

// app.get('/ranking', (req, res) => {
//   const db = new sqlite3.Database('db.sqlite3');
//   db.serialize(function() {
//     db.all('SELECT name,score FROM USER order by score desc', function(err, rows) {
//       const returndata = rows; //↑にクエリ文を書いてソートする。(種類分け)
//       res.render('ranking.ejs',{data:returndata});  //ranking.ejs内でのdataの定義。
//     });
//   });
//   db.close();
// });