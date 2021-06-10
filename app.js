const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));  //trueにしてみた。


app.get('/', (req, res) => {
  const db = new sqlite3.Database('db.sqlite3');
  db.serialize(function() {
    db.all('SELECT id,name FROM USER', function(err, rows) {
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
  const id = req.body['id'];
  db.run(
      'insert into user (id,name) values (?,?)',
      id,
      name
  );
  res.redirect('/');
});

app.get('/tetris', (req,res) => {
  res.render('tetris.ejs');
})

app.listen(process.env.PORT || 8000);