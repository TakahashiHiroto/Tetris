# mysqlの設定・接続
[参照記事はこちら](https://www.dbonline.jp/mysql/)

参照記事よりmysqlをインストールして環境変数設定をしてコマンドラインツール(CMD)に繋げた後、CMDから
```bash
mysql -u root -p
```
と入力する。その後にpasswordを入力することでmysql内に入ることが出来る。
sqliteはファイルベースのdbということでかなり特殊であり、ファイルを作ることがデータベースの作成に値するが、mysqlみたいな普通のwebサーバベースのdbは
```bash
CREATE DATABASE db_name;
```
で作成できる。作成したら、
```bash
use db_name;
```
で扱うデータベース内に入ることが出来る。

あとは自由にテーブルを操作したり確認したりする。

```bash
show tables;
show columns from user; //これらはdb内で入力すると、db内にあるtableが見れたり、あるテーブルのカラムの情報を見れたりする。
```

## dataの操作
基本的にsqlite3と変わらない。sqliteのmemoとか、参照記事を見て慣れる。


