# HelloBye
----
### 更新履歴
Date|Discription
--|--
2021.04.01|システムの名前を「EntryExit-Management-System」から「HelloBye」に変更しました
2020.12.17|開発版を公開

----

HelloBye（以下 システム）は，大阪電気通信大学 情報通信工学部のハッカソン企画で開発した入退室管理システムです．

このシステムの利用にはRaspberry PiとPasori, そしてGoogle Accountが必要です．Raspberry Pi と Pasori はカードの読み取り制御とデータ転送に，Google Account はGoogle Cloud Platformを用いてデータベースと外部連携による通知の機能を実装するのに必要です．
 
# DEMO
 
"hoge"の魅力が直感的に伝えわるデモ動画や図解を載せる
 
# Features
![system constitution figure](https://github.com/xwasoux/image/blob/master/EEMS/systemConstitutionFigure.png)

 
# Requirement

The necessary equipment is as follows.
+ Raspberry pi 4 (Raspberry Pi OS)
+ Pasori
+ USB Speaker


The necessary library is as follows.
* Python 3.7 
* nfcpy

 
# Installation
 
Install nfcpy to use Pasori.
 
```bash
pip install -U nfcpy
```

# Google Apps Script
Access to Google Drive and create a new Spreadsheet, and select Tools > Script Editor in the menu bar.

# Webhooks
You need to set to use nofication via Slack.
 
# Usage
 
```bash
git clone https://github.com/xwasoux/EntryExit-Management-System.git
cd EntryExit-Management-System
python3 main.py
```
 
# Note
 
現状，Felicaに対応しているカードであればなんでも情報を取得してしまうので，学生証以外を用いないことを注意すべきである．
