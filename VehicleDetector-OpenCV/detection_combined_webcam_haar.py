# -*- coding: utf-8 -*-

import cv2


#Loading the cascades

cascade_car_src = 'cars.xml'
cascade_bike_src = 'two_wheeler.xml'
cascade_bus_src = 'Bus_front.xml'
cascade_ped_src = 'pedestrian.xml'


video_src = '1.mp4'

cap = cv2.VideoCapture(0)

car_cascade = cv2.CascadeClassifier(cascade_car_src)
bike_cascade = cv2.CascadeClassifier(cascade_bike_src)
bus_cascade = cv2.CascadeClassifier(cascade_bus_src)
ped_cascade = cv2.CascadeClassifier(cascade_ped_src)


while True:
    ret, img = cap.read()
    if (type(img) == type(None)):
        break
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    cars = car_cascade.detectMultiScale(gray, 1.1, 2)
    bus = bus_cascade.detectMultiScale(gray, 1.16, 1)
    bike = bike_cascade.detectMultiScale(gray,1.01, 1)
    peds = ped_cascade.detectMultiScale(gray,1.3,2)


    for (x,y,w,h) in cars:
        cv2.rectangle(img,(x,y),(x+w,y+h),(0,255,255),2)
    for (x,y,w,h) in bike:
        cv2.rectangle(img,(x,y),(x+w,y+h),(0,255,215),2)
    for (x,y,w,h) in bus:
        cv2.rectangle(img,(x,y),(x+w,y+h),(0,0,255),2)
    for(a,b,c,d) in peds:
        cv2.rectangle(img,(a,b),(a+c,b+d),(0,255,210),4)

    print(len(cars)+len(bus)+len(bike)+len(peds)) #COUNTER IS HERE!
    
    cv2.imshow('video', img)
   
    
    if cv2.waitKey(33) == 27:
        break

cv2.destroyAllWindows()
