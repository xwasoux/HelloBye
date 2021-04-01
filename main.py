#//////////////////////////////////////////////
#// HelloBye version 1.0                     //
#//                                          //
#//     __  __     ____      ____            //
#//    / / / /__  / / /___  / __ )__  _____  //
#//   / /_/ / _ \/ / / __ \/ __  / / / / _ \ //
#//  / __  /  __/ / / /_/ / /_/ / /_/ /  __/ //
#// /_/ /_/\___/_/_/\____/_____/\__, /\___/  //
#//                            /____/        //
#//                                          //
#//////////////////////////////////////////////

#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
sys.path.insert(1, os.path.split(sys.path[0])[0])

# need to nomalization
import re
 
#import binascii
import nfc

# gain the date/time
import datetime

# abote the program with Ctrl+c
import signal
signal.signal(signal.SIGINT, signal.SIG_DFL)

# sound module
import subprocess


# API setting
import gspread
from oauth2client.service_account import ServiceAccountCredentials
key_name = '***********************************.json'
sheet_name = 'entryexit data'
 

# rogin to API
scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
credentials = ServiceAccountCredentials.from_json_keyfile_name(key_name, scope)
gc = gspread.authorize(credentials)


# student id
developer = "GP19C001"


# student ID dictionaly
stid_dic = {}   #empty
status_ee = "entry"


# csv file
import csv


#---------------------------------------------
# print it if system run
#----------------------------------------------
def systemRunPrint():
    print("     __  __     ____      ____            ")
    print("    / / / /__  / / /___  / __ )__  _____  ")
    print("   / /_/ / _ \/ / / __ \/ __  / / / / _ \ ")
    print("  / __  /  __/ / / /_/ / /_/ / /_/ /  __/ ")
    print(" /_/ /_/\___/_/_/\____/_____/\__, /\___/  ")
    print("                            /____/       ")

#----------------------------------------------
# start of on_connect(tag)
#----------------------------------------------
def on_connect(tag):
    # print(tag.dump()[4])
    
    if isinstance(tag, nfc.tag.tt3.Type3Tag):
        try:
            print("/////////////////////////////////////////////////////////")


            # get date & time 
            date = datetime.datetime.now().strftime("%Y/%m/%d")
            time = datetime.datetime.now().strftime("%H:%M:%S")
            print(time + date)


            # output contents as hexadecimal 
            hex_raw = tag.dump()[4].split()[-1]
            #print(hex_raw) #output:|01GP19C001....01|

            # cast to string type
            hex_str_id = str(hex_raw)
            #print(hex_str_id) #output:|01GP19C001....01|
            

            # means1: slise
            student_id = hex_str_id[3:11]
            print("user: " + student_id)          
            

            # confirm your entry / exit status
            if student_id in stid_dic:  # when you entry after the second time
                print("you are in dictionaly")

                status_ee = stid_dic[student_id]
                print("last status ==> " + status_ee)
                #print((student_id, "entry") in stid_dic.items())  # return True or False

                if "entry" in stid_dic[student_id]: # exit
                    stid_dic[student_id] = "exit"
                    status_ee = stid_dic[student_id]
                    print("*new status* ==> " + status_ee)
                    
                    print("Message ==> お疲れ様でした")
                    subprocess.call("mpg321 voice/otukaresama.mp3", shell=True)
                    
                elif "exit" in stid_dic[student_id]: # entry
                    stid_dic[student_id] = "entry"
                    status_ee = stid_dic[student_id]
                    print("*new status* ==> " + status_ee)
                    
                    print("Message ==> ようこそ！")
                    subprocess.call("mpg321 voice/gambattekudasai.mp3", shell=True)
                # end of if "entry" in stid_dic[student_id]:

            else:   # when you entry first time in a day
                print("you are not in dictionaly!")
                
                stid_dic[student_id] = "entry"
                status_ee = stid_dic[student_id]
                print("*new status* ==> " + status_ee)
                
                print(stid_dic) # view dictionaly
                
                print("Message ==> ようこそ！")
                subprocess.call("mpg321 voice/gambattekudasai.mp3", shell=True)
            # end of if student_id in stid_dic:


            # write the data to csv file
            print('---  追記開始  ---')
            with open('log_data.csv', 'a') as csvFile:
                writer = csv.writer(csvFile)
                writer.writerow([date, time, student_id, status_ee])
            
            csvFile.close()
            print('---  追記終了  ---')

            # upload some data to google spreadsheet
            print('---  アップロード開始  ---')
            wks = gc.open(sheet_name).worksheet('log_data') # send to "log_data"
            #wks = gc.open(sheet_name).worksheet('test_wks') # send to "test_wks"
            wks.append_row([date, time, student_id, status_ee])
            print('---  アップロード終了  ---')

            print("-  -  -  -  -  -  -  -  -  -  -  -  -  -")
            
            # alart 
            if student_id == developer: # developer option
                print("you are developer!")
                subprocess.call("mpg321 voice/kenkyuu.mp3", shell=True)
                subprocess.call("mpg321 voice/matane.mp3", shell=True)
                subprocess.call("mpg321 voice/gambattekudasai.mp3", shell=True)

        # end of try:

        except Exception as e:
            print( "error: %s" % e)
        # end of try:/ecept:

    else:
        print ("error: tag isn't Type3Tag")
    # end of if isinstance(tag, nfc.tag.tt3.Type3Tag):

    return True # カードが離れるまでに1回のみ 
# end of on_connect(tag)

#----------------------------------------------
# start of main()
#----------------------------------------------
def main():
    # get date & time
    date = datetime.datetime.now().strftime("%Y/%m/%d")
    time = datetime.datetime.now().strftime("%H:%M:%S")
    

    # write the message to cvs file
    fst_msg = "EEMS has been launched!"
    with open('log_data.csv', 'a') as csvFile:
        writer = csv.writer(csvFile)
        writer.writerow([date, time, "null", fst_msg])
            
    csvFile.close()


    #wks = gc.open(sheet_name).worksheet('log_data')
    wks = gc.open(sheet_name).worksheet('test_wks')
    wks.append_row([date, time, "null", fst_msg])
    
    systemRunPrint()

    # start og while True
    while True:
        with nfc.ContactlessFrontend("usb") as clf:
            rdwr = {
                'targets': ['212F', '424F'], # Type3Tag
                
                # 'on-startup': on_startup,
                'on-connect': on_connect
            
            }
            clf.connect(rdwr=rdwr)
        # end of with nfc.ContactlessFrontend("usb") as clf:
    # end of while True
# end of main()


if __name__ == "__main__":
    main()
# end of if __name__ == "__main__":
    
