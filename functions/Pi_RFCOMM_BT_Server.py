#------------------------------------------------------------------------
#RFCOMM_BT_Server
#------------------------------------------------------------------------
#Allows text to be published by the client and immediately recieved on the
#server through the RFCOMM sockets - uses a pre-paired bluetooth connection
#between two raspberry pis
#Prior to use:
#1) Modify /etc/systemd/system/bluetooth.target.wants/bluetooth.service file
#to add -C after bluetoothhd
#2) Add serial port serice sudo sdptool add SP
#3) Run sudo hciconfig hci0 piscan
#4) Run this file from root with sudo and python3
#------------------------------------------------------------------------
#Author   :   Luke Holland
#Date   :   21st December 2020
#Modified from the bluetooth file examples by Albert Huang
#------------------------------------------------------------------------


from bluetooth import *
import bluetooth
import json

def StringToList(string):
    LIST = list(string.split(","))
    return LIST

while True:
    #try:
    print("Attempting to connect...")
    server_sock=BluetoothSocket( RFCOMM )
    server_sock.bind(("",1))#bluetooth.PORT_ANY))
    server_sock.listen(1)

    port = server_sock.getsockname()[1]
    print(port)
    port = 1

    uuid = "94f39d29-7d6d-437d-973b-fba39e49d4ee"

    bluetooth.advertise_service( server_sock, "SampleServer",
                       service_id = uuid,
                       service_classes = [ uuid, SERIAL_PORT_CLASS ],
                       profiles = [ SERIAL_PORT_PROFILE ]
                        )
                       
    print("Waiting for connection on RFCOMM channel %d" % port)

    client_sock, client_info = server_sock.accept()
    print("Accepted connection from ", client_info)

    try:
        while True:
            print("topof the while")
            data = client_sock.recv(1024)
            if len(data) == 0:
                break
            
            strData = data.decode()
            
            DataList = StringToList(strData)
            print(DataList)
            file1 = open("CombinedData.json", "r")
            json_obj = json.load(file1)
            file1.close()
            #edit the JSON values
            json_obj["Sitting"] = DataList[0]
            json_obj["FocusTime"] = round(float(DataList[1]),2)
            json_obj["PhoneTime"] = round(float(DataList[2]),2)
            json_obj["NonFocusTime"] = round(float(DataList[3]),2)
            
            file2 = open("CombinedData.json", "w")
            json.dump(json_obj, file2)
            file2.close()
            
    except IOError:
        pass

    print("disconnected")

    client_sock.close()
    server_sock.close()
    print("all done")

