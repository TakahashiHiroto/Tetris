# sqlite3導入法
[参照記事はこちら](https://www.dbonline.jp/sqlite/)

## 1.sqlite3インストール
## 2.sqlite3の移動＆環境変数設定
sqlite3のフォルダをCドライブ直下に作ってそこにインストールしたものをぶち込む。そしたら環境変数でPath設定。またnodeを立ち上げるためのファイル(自分はapp.js)に、
```js
const sqlite3 = require('sqlite3')
```
## 3.データベースのフォルダ(今回はdb.sqlite3)の作成
プロジェクトのルートディレクトリ内にdb.sqlite3を作る。(データベースの名称は~
でも、~.dbでも、~.sqliteでも、~.sqlite3でもいいらしい。)
## 4.データベースの接続
```bash
 sqlite3 db.sqlite3
 ```
 でsqlite3に接続する(SQliteのコマンドラインツールにつなげる)。そこで
 ```bash
 select * from テーブル名;　//;(セミコロン)はつけること。

 ※
 .header on
.mode column　//これでselect * from テーブル名　をすると綺麗に整えてくれる。
 ```
 (SQL文)を打ち込むとデータベース内がのぞける。(データベースは直接読むものではない。一文字でもずれるとエラーになるためあまりいじらない。またSQL文は分割可能であるため、;を忘れても次の行に;を打てば問題なしの模様。)また、
 ```bash
 .exit
 ```
 でデータベースから抜けられる。(その他クエリ文は参照記事に書いてある。)
 ## 5.テーブル作成
 ```bash
 CREATE TABLE テーブル名(カラム名1 データ型, カラム名2 データ型, ...);
 ```
 で作成可能。(今回は
```bash
CREATE TABLE user (
    id          INTEGER NOT NULL PRIMARY KEY, 　//not null制約はnullを格納できないようにしてる。
    name        TEXT    NOT NULL,　　　　　　　　//primary key制約は格納されたデータの重複を防いでいる。
    description TEXT
);
```
 )でやった。データ型は参照記事の「SQliteで利用可能なデータ型」に書いてある。また、
 ```bash
 .schema
 ```
 でスキーマ情報を表示できる。(スキーマはデータベースが格納されている鞄的存在(?)) また、
 ```bash
 INSERT INTO テーブル名 VALUES(値1, 値2, ...); // <= このかっこ内はカラムの要素に対応。
 UPDATE テーブル名 SET カラム名1 = 値1, カラム名2 = 値2, ... WHERE 条件式;
 DELETE FROM テーブル名 WHERE 条件式;
 ```
 これらで、上から順にデータの追加、更新、削除が可能。条件式は id>1 とか   name=~ とかである。
 ## 6.webサーバー構築用ファイル(今回はapp.js)に色々追記する
 まず今回のコードを以下に張り付ける。
 ```js
 const express = require('express');
const app = express();
//追加
const sqlite3 = require('sqlite3');

app.use(express.static('public'));
//追加
app.use(express.urlencoded({extended: true}));　//URLエンコードを読み取るための何か。

//追加(今まではres.render~しかなかったが、ここでデータベースを定義づけるようにする)
app.get('/', (req, res) => {
  const db = new sqlite3.Database('db.sqlite3'); //データベース選択
  db.serialize(function() {
    db.all('SELECT id,name FROM USER', function(err, rows) {
      const returndata = rows;
      console.log(returndata);
      res.render('top.ejs',{data:returndata});  //top.ejs内でのdataの定義。プロジェクトのルートディレクトリに関するビュー、テンプレートをレンダリングしている。
    });
  });
  db.close();
});


//追加(ここら一体。データの入力を担う場所)
app.post('/post', (req, res) => {
  const db = new sqlite3.Database('db.sqlite3');  
  const id = req.body['id'];
  const name = req.body['name'];
  db.run(
      'insert into user (id,name) values (?,?)',
      id,
      name
  );
  res.redirect('/'); //ルートディレクトリに強制移動
});

app.get('/tetris', (req,res) => {
  res.render('tetris.ejs');
})

app.listen(process.env.PORT || 8000);
 ```
 ###### ※少なくとも2021/5/06以降は最新にしていれば、bodyParser　(HTML(ejs)のformのinputに入力された値を受け取れるようにするもの)　がexpressに標準搭載されているため別途インストールは不要。
 また、入力場所に関するコードは以下をmainタグ内に追加。(今回はtop.ejs)
 ```js
<form action="http://localhost:8000/post" method="post" enctype="application/x-www-form-urlencoded">
    <label for="name">id  </label>                         ↑※
    <input type="number" name="id"></input><br>
    <label for="name">name</label>
    <input type="text" name="name"></input>
    <button type="submit">送信</button>
    //2021/6/10 ps 
    //http://localhost:8000/post　→　https://tetris-application.herokuapp.com/post
</form>
 ```
 
 ### ※注意　データベースにデータを送信する時にデータ形式がマルチパート(inputタグで言うとenctype属性がmultipart/form-data)だと、body-parser(今ではexpressに標準搭載されているHTML(ejs)のformのinputに入力された値を受け取れるようにするもの)では処理できない！だからデータ形式はURLエンコードにすること。

 ## クエリ文(実際に使ってみたやつ)
 ```bash
 ALTER TABLE テーブル名 ADD COLUMN カラム名 データ型; //データベースのcolumn追加 (ちなみにcolumnの削除は対応していないため、削除したい場合はテーブルを作り直す必要がある。)
 DELETE FROM テーブル名 WHERE 条件式; //データベースのデータ消去
 DROP TABLE テーブル名; //　テーブルの削除
 ```
 