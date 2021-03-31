# HelloBye
----
### 更新履歴
Date|Discription
--|--
2021.04.01|システムの名前を「EntryExit-Management-System」から「HelloBye」に変更しました
2020.12.17|開発版を公開

----

HelloBye（以下 システム）は，大阪電気通信大学 情報通信工学部のハッカソン企画で開発した入退室管理システムです．

After Raspberry Pi4 have gets the Student number with Pasori from student ID card, send to Google Spreadsheet with Google Spreadsheet API.

By using the Google Apps Script associated with Google Spreadsheet , notification via Slack and Gmail are also performed.

Users only need to hold their student ID card over the card reader.
 
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
