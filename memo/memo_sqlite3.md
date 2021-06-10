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
 select * from user;　//;(セミコロン)はつけること。
 ```
 (SQL文)を打ち込むとデータベース内がのぞける。(データベースは直接読むものではない。一文字でもずれるとエラーになるためあまりいじらない。またSQL文は分割可能であるため、;を忘れても次の行に;を打てば問題なしの模様。)また、
 ```bash
 .exit
 ```
 でデータベースから抜けられる。
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
 INSERT INTO テーブル名 VALUES(値1, 値2, ...);
 UPDATE テーブル名 SET カラム名1 = 値1, カラム名2 = 値2, ... WHERE 条件式;
 DELETE FROM テーブル名 WHERE 条件式;
 ```
 これらで、上から順にデータの追加、更新、削除が可能。条件式は id>1 とか   name=~ とかである。
 ###### ※これは無視してよい。bodyParserはexpressに標準搭載されているため不要。
 ### ※注意　データベースにデータを送信する時にデータ形式がマルチパート(inputタグで言うとenctype属性がmultipart/form-data)だと、body-parser(今ではexpressに標準搭載されているHTML(ejs)のformのinputに入力された値を受け取れるようにするもの)では処理できない！だからデータ形式はURLエンコードにすること。
 