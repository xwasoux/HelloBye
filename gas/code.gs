/////////////////////////////////////////////////////////////////////
// Entry/Exit Management System                                    //
// version alfa test                                               //
//                                                                 //
//       __________   __________  ____    _____      __________    //
//      /  _______/  /  _______/ /   |   /    |     /  _____  /    //
//     /  /______   /  /______  /    |  / /|  |    /  /____'-'     //
//    /  _______/  /  _______/ /  /| | / / |  |   /_______  /      //
//   /  /______   /  /______  /  / | |/ /  |  |  ,-,_____/ /       //
//  /_________/  /_________/ /__/  |___/   |__| /_________/        //
//                                                                 //
/////////////////////////////////////////////////////////////////////


//////////////////////////////////
//     Slack API Setting        //
//////////////////////////////////
const postUrl_test = "https://hooks.slack.com/services/******************";
const post_general = "https://hooks.slack.com/services/******************";


//////////////////////////////////
//        create message        //
//////////////////////////////////
function createMessage(){
  //get the sheet from  spreadsheet
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = activeSpreadsheet.getActiveSheet();
  
  const spreadSheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/***********************/edit#gid=0");
  const sheet = spreadSheet.getSheetByName("test_wks");
  
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
  
  // message setting
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


/////////////////////////////////
//       POST TO SLACK         //
/////////////////////////////////
function slack_notification(){
  const sendMessage = createMessage();
  
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
  
  var response = UrlFetchApp.fetch(postUrl_test, options);
  //var response = UrlFetchApp.fetch(post_general, options);
  
  Logger.log("response code = " + response.getResponseCode()); // return error code:400
  Logger.log("response body = " + response.getContentText());  // will return the cuse of error
}

/////////////////////////////////
//       POST TO GMAIL         //
/////////////////////////////////
function mail_notification() {
  // main setting (you must discribe in this scope
  const recipient_gp19c001 = 'gp19c001@oecu.jp'; // send to
  const recipient_gp18a063 = 'gp18a063@oecu.jp';
  
  const subject = '本日の入退室記録'; // mail title
  const recipientName = '管理者';
  
  const sendMessage = createMessage();
  
  const body = `以下に本日の入退室管理システムのログを示します．\n\n${sendMessage}\n\n以上`;
  const options = {name: 'Entry/Exit Management System'};
  
  GmailApp.sendEmail(recipient_gp19c001, subject, body, options);
  
  
}


function doGet(e){
  var page = e.parameter["p"];

  if(page == "index" || page == null){
    return HtmlService.createTemplateFromFile("index").evaluate();
  
  } else if(page == "member"){
    return HtmlService.createTemplateFromFile("member").evaluate();
  
  }
  //return HtmlService.createTemplateFromFile("index").evaluate()
}