#!/usr/bin/env python3
import serial
import time
import datetime
import json

if __name__ == '__main__':
    ser = serial.Serial('/dev/ttyUSB0', 9600, timeout=1)
    ser.flush()
    t1 = time.time() - 61
    prevSittingVal = ""
    sessionSitTime = 0
    sessionFocusTime = 0
    focusPercentage = 0
    breakTime = 0
    
    while True:
        #check to see if a minute has passed
        if time.time() > (t1 + 60):
            
            t1 = time.time() 
            #read the updated JSON file
            file1 = open("CombinedData.json", "r")
            json_obj = json.load(file1)
            file1.close()
            
            #pull the values from this JSON
            SittingVal = json_obj["Sitting"]
            FocusTime = json_obj["FocusTime"]      
            #has the user changed position?
            if SittingVal == prevSittingVal:
                #either the chair is still full or still empty
                if SittingVal == "Sitting_In_Chair":
                    #still sat down
                    sessionSitTime += 1
                    sessionFocusTime += FocusTime
                    focusPercentage = sessionFocusTime / sessionSitTime
                    message = "still sitting," + str(sessionSitTime) + "," + str(focusPercentage) + ",\n"
                    
                if SittingVal == "Empty_Chair":
                    #still vacant
                    breakTime += 1
                    message = "still empty,0,0,"+ "\n"
                    
            else:
                #position has changed
                if SittingVal == "Sitting_In_Chair":
                    #just sat down
                    #send break time
                    message = "just back," + str(breakTime) + ",0,"+ "\n"
                    sessionSitTime = 0
                    sessionFocusTime = 0
                    focusPercentage = 0
                    
                if SittingVal == "Empty_Chair":
                    #just left
                    sessionSitTime = 0
                    sessionFocusTime = 0
                    focusPercentage = 0
                    breakTime = 1
                    message = "just left,0,0,"+ "\n"
                    
            print(message)
            prevSittingVal = SittingVal
            message = bytes(message, 'utf-8')
            ser.write(message)
            
        line = ser.readline()#.decode('utf-8').rstrip()
        print(line)
        
    
        
