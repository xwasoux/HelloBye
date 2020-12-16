# EntryExit-Management-System
本システム（以下 EEMS）は，大阪電気通信大学 情報通信工学部のハッカソン企画で開発した入退室管理システムです．

Pasoriを用いて学生証（Felica）から学籍番号の情報を取得し，Google Spreadsheetにて情報を管理する．
また，Google Apps Scriptを利用することで，SlackやGmailでの通知も行う．

ユーザは学生証をカードリーダにかざすだけで良い．
 
# DEMO
 
"hoge"の魅力が直感的に伝えわるデモ動画や図解を載せる
 
# Features
![システム構成図](https://github.com/xwasoux/image/blob/master/systemFigure.png)
"hoge"のセールスポイントや差別化などを説明する
 
# Requirement

必要な機器は以下の通りである．
+ Raspberry pi 4 (Raspberry Pi OS)
+ Pasori
+ USB スピーカー


必要なライブラリは以下の通りである．
* Python 3.7 
* nfcpy
* hogehuga 1.0.2
 
# Installation
 
Pasoriを利用するためにnfcpyをインストールする
 
```bash
pip install -U nfcpy
```
 
# Usage
 
DEMOの実行方法など、"hoge"の基本的な使い方を説明する
 
```bash
git clone https://github.com/xwasoux/EntryExit-Management-System.git
cd EntryExit-Management-System
python3 main.py
```
 
# Note
 
現状，Felicaに対応しているカードであればなんでも情報を取得してしまうので，学生証以外を用いないことを注意すべきである．
