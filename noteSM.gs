//////////////////////////////////////////////
// HelloBye version 1.0                     //
//                                          //
//     __  __     ____      ____            //
//    / / / /__  / / /___  / __ )__  _____  //
//   / /_/ / _ \/ / / __ \/ __  / / / / _ \ //
//  / __  /  __/ / / /_/ / /_/ / /_/ /  __/ //
// /_/ /_/\___/_/_/\____/_____/\__, /\___/  //
//                            /____/        //
//                                          //
//////////////////////////////////////////////


//////////////////////////////////
//     Slack API Setting        //
//////////////////////////////////
const postTo = "";  //slack imcoming webhooks api

//--------------------------------------------- Common Function ----------------------------------------------------
function sendToSlack(sendMessage){
  var jsonData = {
    "text": sendMessage
  };
  
  var payload = JSON.stringify(jsonData);
  
  var options = {
    "method" : "post", 
    "contentType" : "application/json",
    "payload" : payload,
    muteHttpExceptions: true, //never happen an exception when it return an error
    
  };
  
  var response = UrlFetchApp.fetch(postTo, options);
  
  Logger.log("response code = " + response.getResponseCode()); // return error code:400
  Logger.log("response body = " + response.getContentText());  // will return the cuse of error
}

function referenceStudentName(){
  //get the sheet from  spreadsheet
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = activeSpreadsheet.getActiveSheet();
  
  const spreadSheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/**************/edit#gid=0");
  const sheet = spreadSheet.getSheetByName("student_dict");
  
  // column setting
  const idColumn = 1;
  const nameColumn = 2;

  // sheet
  const columnFValues = sheet.getRange("A:A").getValues();
  const startRow = 2;
  const lastRow = columnFValues.filter(String).length;
  Logger.log(columnFValues);
  Logger.log(lastRow);

  //set dict
  let student_dict = [];

  //load student dictionaly from student_dict
  for (row = startRow; row <= lastRow; row++) {
    //get information fron each cells
    var key_student_id = sheet.getRange(row, idColumn).getValue();  Logger.log(key_student_id);
    var val_student_name = sheet.getRange(row, nameColumn).getValue();  Logger.log(val_student_name);
    
    // add dict
    student_dict.push({key:key_student_id, val:val_student_name});
    Logger.log(student_dict);
  }  // end of for
  
  return student_dict;
}

//----------------------------------------------- Realtime post ----------------------------------------------------
function createRealtimeMessage(){
  //get the sheet from  spreadsheet
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = activeSpreadsheet.getActiveSheet();
  
  const spreadSheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/****************/edit#gid=0");
  const sheet = spreadSheet.getSheetByName("log_data");
  
  // get date & time
  const dateObject = new Date();
  const today = Utilities.formatDate(dateObject, "Asia/Tokyo", "yyyy/MM/dd");
  
  // column setting
  const dateColumn = 1;
  const timeColumn = 2;
  const studentIdColumn = 3;
  const statusColumn = 4;
  const situationColumn = 5;
  
  // sheet
  const columnFValues = sheet.getRange("C:C").getValues();
  const startRow = 2;
  const lastRow = columnFValues.filter(String).length;
  Logger.log(columnFValues);
  Logger.log(lastRow);

  // load dict from referenceStudentName()
  const stu_dict = referenceStudentName();      Logger.log(stu_dict);

  // message setting
  var realtimeMessage = "";
  var exitMessage = "";
  var stayList = "";  
  var output = "";
  const errorMessage = "この学生の本名は登録されていません．";
  
  // create message 
  for (row = startRow; row <= lastRow; row++) {
    //get information fron each cells
    var workDate = sheet.getRange(row, dateColumn).getValue();
    var workTime = sheet.getRange(row, timeColumn).getValue();
    var studentId = sheet.getRange(row, studentIdColumn).getValue();
    var status = sheet.getRange(row, statusColumn).getValue();
    var studentName;      //今後の課題：辞書に登録した学生番号と紐付けした名前を取り出してポストしたい
    if(status){
      var situation = 1;  //1=>stay, 2=>left
    }

    //select today's log
    if (today == workDate) {
      //latest man
      if(row == lastRow){
        Logger.log(workTime); Logger.log(studentId);  Logger.log(" is last man!");
        realtimeMessage = `${workDate} ${workTime} ${studentId}`;
        Logger.log(realtimeMessage);

        if(status == "entry"){
          Logger.log(studentId);  Logger.log(" is here!");
          realtimeMessage = `${realtimeMessage}` + " enterd!";
          Logger.log(realtimeMessage);

        }else if(status == "exit"){
          Logger.log(" left!");
          realtimeMessage = `${realtimeMessage}` + " left!";
          Logger.log(realtimeMessage);

        }
      }
      //make stayList
      if(studentId != "null" && status == "entry"){
        
      }
      
    }
  }
  
  output = `${realtimeMessage}`;

  //  output realtime message
  return output;
}

function realtimePostToSlack(){
  const sendMessage = createRealtimeMessage();

  sendToSlack(sendMessage);
}
//------------------------------------------------ Daily post ----------------------------------------------------
function createDailyMessage(){
  //get the sheet from  spreadsheet
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = activeSpreadsheet.getActiveSheet();
  
  const spreadSheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/**********************/edit#gid=0");
  const sheet = spreadSheet.getSheetByName("log_data");
  
  // get date & time
  const dateObject = new Date();
  const today = Utilities.formatDate(dateObject, "Asia/Tokyo", "yyyy/MM/dd");
  
  // column setting
  const dateColumn = 1;
  const timeColumn = 2;
  const studentIdColumn = 3;
  const statusColumn = 4;
  
  // sheet
  const columnFValues = sheet.getRange("C:C").getValues();
  const startRow = 2;
  const lastRow = columnFValues.filter(String).length;
  Logger.log(columnFValues);
  Logger.log(lastRow);

  // message list setting
  var eeList = "";  
  var output = "";
  
  // create message 
  for (row = startRow; row <= lastRow; row++) {
    //var detail = sheet.getRange(row, detailColumn).getValue() + " ";
    
    //get information fron each cells
    var workDate = sheet.getRange(row, dateColumn).getValue();
    var workTime = sheet.getRange(row, timeColumn).getValue();
    var studentId = sheet.getRange(row, studentIdColumn).getValue();
    var status = sheet.getRange(row, statusColumn).getValue();

    //select today's log and make eeList
    if (today == workDate) {
      if(studentId == "null"){
        studentId = "";
      }
      eeList = `${eeList}  ${workDate}  ${workTime}  ${studentId}  ${status}` + "\n";
    }
  }
    
  if (eeList == "") {
    output = `${today}は誰も来ていません`;
  } else {
    output = `${today}のログです\n${eeList}`;
  }
  
  // message output
  return output;
}

function dailyPostToSlack(){
  const sendMessage = createDailyMessage();

  sendToSlack(sendMessage);
}


function dailyMail(){
  const sendMessage = createDailyMessage();  

  // main setting (you must discribe in this scope
  const subject = '本日の入退室記録'; // mail title
  const recipientName = '管理者';
  
  const body = `以下に本日の入退室管理システムのログを示します．\n\n${sendMessage}\n\n以上`;
  const options = {name: 'Entry/Exit Management System'};
  
  const recipient = '******@xxx.jp'; // send to
  GmailApp.sendEmail(recipient, subject, body, options);

} //end of  dailyMail()
