##################################################################
#  Entry/Exit Management System
#  version alfa test
#
#       __________   __________  ____    _____       __________
#      /  _______/  /  _______/ /   |   /    |      /  _______/
#     /  /______   /  /______  /    |  / /|  |     /  /______
#    /  _______/  /  _______/ /  /| | / / |  |    /_______  /
#   /  /______   /  /______  /  / | |/ /  |  |   ________/ /
#  /_________/  /_________/ /__/  |___/   |__|  /_________/
#
#  1.probrem: interrupt with Ctrl+C　--> resolved!
#  2.Nomalize Student ID --> I dont understand how to use it
##################################################################

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
key_name = 'entryexit-management-system-28b2b1900aad.json'
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

def on_connect(tag):
    # print(tag.dump()[4])
    if isinstance(tag, nfc.tag.tt3.Type3Tag):
        try:
            print("-----------------------------------------------")

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
            print(student_id)          
            
            # confirm your entry / exit status
            if student_id in stid_dic:  # when you entry after the second time
                print("you are in dictionaly")

                status_ee = stid_dic[student_id]
                print("last status ==> " + status_ee)
                #print((student_id, "entry") in stid_dic.items())  # return True or False

                if "entry" in stid_dic[student_id]: # exit
                    print("you exited")
                    stid_dic[student_id] = "exit"
                    status_ee = stid_dic[student_id]
                    print("*new status* ==> " + status_ee)
                    
                elif "exit" in stid_dic[student_id]: # entry
                    print("welcome!")
                    stid_dic[student_id] = "entry"
                    status_ee = stid_dic[student_id]
                    print("*new status* ==> " + status_ee)
            
            else:   # when you entry first time in a day
                print("you are not in dictionaly!")
                stid_dic[student_id] = "entry"
                status_ee = stid_dic[student_id]
                print("*new status* ==> " + status_ee)
                print(stid_dic) # view dictionaly

            # upload some data to google spreadsheet
            wks = gc.open(sheet_name).sheet1
            wks.append_row([date, time, student_id, status_ee])

            # alart 
            if developer == 'GP19C001': # developer option
                print("you are developer!")
                subprocess.call("mpg321 testAudio.mp3", shell=True)
                #subprocess.call("mpg321 testAudio.mp3", shell=True)
                
            else:
                print("Welcome!")
                subprocess.call("mpg321 testAudio.mp3", shell=True)
            
            #cell_number = 'A1'
            #input_stid = 'TEST'
            #wks = gc.open(sheet_name).sheet1
            #wks.update_acell(cell_number, student_id)
            
            # means2:Nomalization
            #content = r'01GP19c001....01'
            #pattern = 'GP' #GP[11-30][A-D][0-250]
            #repatter = re.compile(r'GP18A122')
            #student_id = repatter.match(content)
            #student_id = repatter.match(hex_str_id)
            #if student_id != None:
            #    print(student_id.group())

            #else:
            #    print("not mutch!")

        except Exception as e:
            print( "error: %s" % e)

    else:
        print ("error: tag isn't Type3Tag")

    return True # カードが離れるまでに1回のみ 

def main():
    while True:
        with nfc.ContactlessFrontend("usb") as clf:
            rdwr = {
                'targets': ['212F', '424F'], # Type3Tag
                # 'on-startup': on_startup,
                'on-connect': on_connect
            }
            clf.connect(rdwr=rdwr)


if __name__ == "__main__":
    main()

    