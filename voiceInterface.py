import time
import subprocess
import requests

def initData():
    InterfaceList = []
    with open("greetInterface.txt", "r") as f:
        data = f.read()
    data = data.split("\n")
    for i in data:
        originSentence,voiceF = i.split(",")
        InterfaceList.append( (originSentence,voiceF) )
    return InterfaceList

def word(msg,InterfaceList):
    catch = False 
    for i in InterfaceList:
        if(msg == i[0]):
            subprocess.call(["aplay",i[1]])
            catch = True
    if(not catch and not msg == ''):
       subprocess.call(["aplay","/home/pi/voiceSet/oniityan.wav"]) 

def main():
    InterfaceList = initData()
    url = "http://localhost:3000/webhook"
    headers = {"Content-Type" : "text/plain;charset=utf-8"}
    
    while 1:
        res = requests.get(url, headers=headers)
        word(res.text,InterfaceList)
        time.sleep(3)

main()
