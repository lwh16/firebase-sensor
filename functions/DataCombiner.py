#This script reads from both the Bluetooth scripts and combines them together so they can be read by the core-module.js script
import json

def StringToList(string):
    LIST = list(string.split(","))
    return LIST

PiFile = open("PiCam_Data.txt","r")

LaptopFile = open("Laptop_Data.txt","r")

PiData = PiFile.readlines()
LaptopData = LaptopFile.readlines()

combinedData = str(PiData[0]) + "," + str(LaptopData[0])

print(combinedData)