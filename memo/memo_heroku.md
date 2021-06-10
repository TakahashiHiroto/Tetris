# nodejsで作ったアプリをherokuであげる方法

[参照記事はこちら](https://note.com/w0o0ps/n/n357f57db3e3e)

## 1.herokuアカウント作成
## 2.herokuCLIインストール 
※ [インストールの記事](https://devcenter.heroku.com/articles/heroku-cli) 参照
## 3.ターミナルでherokuにLogin

## 4.heroku上にアプリの名前空間を作成
```bash
heroku create [アプリ名]
```
で作る。heorku apps で確認可能。これで名前空間を作ると、自動的にgitのリモートリポジトリが追加されている。git remote -vでリモートリポジトリを確認可能。自分のソースコードは予めgtihubのリポジトリに入れておくこと。

## 5.package.json、nodeを立ち上げるためのやつ(自分はapp.js)の内容確認
package.jsonのscriptの中に
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    // 追記
    "start": "node"
}
```
立ち上げるためのやつ(app.jsとかindex.jsとか)"を書く。
また新たな項目として
```json
"engines": {
   "node": "v4.1.X",
   "npm": "2.14.X"
}
```
を追加。またnodeのlisten内を下記に変更。
```javascript
app.listen(process.env.PORT || 3000);
```

## 6.Procfileの作成
Procfileを作成してその中に、
```procfile
web: npm install
web: node app.js
```
を書く。
(Postbuildの追加とかやらなくちゃいけない時もあるけど今は略)

## 7.heroku用のリモートリポジトリにソースコードをpush
```bash
git push heroku main
```
でソースコードをherokuにpush出来る。その後に
```bash
heroku ps:scale web=0 or 1　
```
でon/off。
#### ※web=1をweb = 1と空白をつけると機能しない。
そしたら最後にheroku openで立ち上げれば完了。
### 2021/6/10 ps ※なぜかgit push heroku main をすると、node-gypがrebuild出来ないエラーが起きたが、package.jsonのnodeとnpmを最新のバージョンに合わせたらなぜか解消された。
[nodeとnpmのversionに関する参照記事はこちら](https://nodejs.org/ja/download/releases/)




