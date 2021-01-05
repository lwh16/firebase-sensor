//database_push.js
//----------------------------------------------------------------------
//Luke Holland
//29th December 2020
//----------------------------------------------------------------------
//Sends information from the raspberry pi to the firebase database
//----------------------------------------------------------------------

/**
 * Import the "get-sensor-readings" module, as well as
 the firebase admin module
 */
const accessInformation = require('./Access_Information')
//Access the file library needed
const fs = require('fs')

var admin = require('firebase-admin')

/**
 * Read the JSON key that was downloaded from firebase,     in this case, it has
 * been placed in the "/home/pi" directory, and named     "firebase-key.json"
 * You can change this to the location where your key is.
 *
 * Remember, this key should not be accessible by the     public, and so should not
 * be kept inside the repository
 */
const serviceAccount = require('/home/pi/FireBase/functions/sensing-me-a7ee2-firebase-admin-key.json')

/**
 * The firebase admin SDK is initialized with the key and     the project URL
 * Change the "databaseURL" to match that of your     application.
 * Once the admin object is initialized, it will have     access to all the
 * functionality that firebase provides, and can now     write to the database
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://sensing-me-a7ee2-default-rtdb.europe-west1.firebasedatabase.app/'
})

/**
 * Initialize the database, and create refs for the     temperature
 * and humidity keys on our database. This is very     similar to the refs we
 * created on the client side.
 */
const db = admin.database()
//const dataRef = db.ref('data')

/**
 * Create a task that runs after a fixed interval of time
 *
 * Here, we have set the interval to be slightly longer     than it was
 * before. This is to account for the delay that may     occur in the network,
 * since we are not running the database on the local     machine anymore.
 * If you find that the application is not communicating     with firebase
 * as fast as you would like, try increasing this     interval based on your
 * network spveed.
 */
 

setInterval(() =>
{
    /**
    * Retrieve the raw data from Combine_Data.txt
    */
    accessInformation((err, data, time) =>
    {
        if (err)
        {
            return console.error(err)
        }
        //Get the date
        //This will be used as the first argument in every path
        const now = new Date()
        var date = (now.getDate()).toString() +'-' + (now.getMonth() + 1).toString()
        
        //extract the data from the text file
		var dataLs = data.split(",")
		
		//whether someone is sat in the chair - returns string 
		var presence = dataLs[0]
		//focus time - number of seconds in last interval user was focused
		var focusTime = (parseFloat(dataLs[1])).toFixed(2)
		//phone time - number of seconds on their phone
		var phoneTime = (parseFloat(dataLs[2])).toFixed(2)
		//Non-focus time - amount of seconds registered as neither focused not on their phone
		var nonFocusTime = (parseFloat(dataLs[3])).toFixed(2)
		//Scroll - float value for amount scrolled
		var scroll = (parseFloat(dataLs[4])).toFixed(2)
		//Keys - int value for keys and mouse clicks
		var keys = (parseFloat(dataLs[5])).toFixed(2)
		//mouse - float value for amount mouse is moved
		var mouse = (parseFloat(dataLs[6])).toFixed(2)
		
		//create a string time value with minutes as a two digit value
        var mins = now.getMinutes()
        if (mins < 10)
        {
            mins = '0' + mins
        }
        
        //Also create a decimal time where minutes are /100
		var hour = now.getHours()
		var min = now.getMinutes()
		var decTime = (hour + mins/60).toFixed(2)
		
        
        //push all of the raw data to the database - completed every minute
        db.ref(date + "/raw_data").push({
            UNIXtime: (time/1000).toFixed(0),
            time: now.getHours() + ':' + mins,
            decTime: decTime,
            present: presence,
            focusTime: focusTime,
            phoneTime: phoneTime,
            nonFocusTime: nonFocusTime,
            keys: keys,
            mouse: mouse,
            scroll: scroll
        })
        
        //now see if the one of the 10 min intervals has been reached
        var checkZero = mins.slice(-1)
        if (checkZero == '0')
        {
			//access the 10min file
			fs.readFile("CombinedData_10min.txt", function read(err, data)
			{
				if (err)
				{
					throw err
				}
				var dataToPush = data
			})
			//Turn the data into a list
			var dataToPushLs = dataToPush.split(",")
			//push the data to the 10 min path
			db.ref(date + "/10min_culmalative_data").push(
			{
				time: now.getHours() + ':' + mins,
				decTime: decTime,
				//divide each of the times by 600 (10mins in secs)
				sittingPercent: ((parseFloat(dataToPushLs[0]))/600).toFixed(2),
				focusedPercent: ((parseFloat(dataToPushLs[1]))/600).toFixed(2),
				phoneTime: (parseFloat(dataToPushLs[2])).toFixed(2),
				keys: (parseFloat(dataToPushLs[3])).toFixed(0),
				mouse: (parseFloat(dataToPushLs[4])).toFixed(2),
				scroll: (parseFloat(dataToPushLs[5])).toFixed(2)
			})
			
			//now set the file to have the first minute values
			var sitTime
			
			if (presence == "Sitting_In_Chair")
			{
				sitTime = 60
			}
			else
			{
				sitTime = 0
			}
			
			firstMin = sitTime + "," + focusTime + "," + phoneTime + "," + keys + "," + mouse + "," + scroll
			
			fs.writeFile("CombinedData_10min.txt", firstMin, (err) =>
			{
				if (err) throw err;
			})
		}
		else
		{
			//if this is a normal minute - add the current data to the 10min file data
			//access the 10min file
			fs.readFile("CombinedData_10min.txt", function read(err, data)
			{
				if (err)
				{
					throw err
				}
				var tenMinData = data
			})
			//Turn the data into a list
			var tenMinDataLs = dataToPush.split(",")
        
        
        
    })
}, 4000)


