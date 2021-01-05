//JSONtoDatabase.js
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
const accessJSONInformation = require('./Access_JSON_Information')
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
    accessJSONInformation((err, data, time) =>
    {
        if (err)
        {
            return console.error(err)
        }
        //data now contains the contents of CombinedData.json
        
        //Get the date and time variables
        //This will be used as the first argument in every path
        const now = new Date()
        var date = (now.getDate()).toString() +'-' + (now.getMonth() + 1).toString()
        
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
            present: data["Sitting"],
            focusTime: data["FocusTime"],
            phoneTime: data["PhoneTime"],
            nonFocusTime: data["NonFocusTime"],
            keys: data["Keys"],
            mouse: data["Mouse"],
            scroll: data["Scroll"]
        })
        
        //now see if the one of the 10 min intervals has been reached
        var checkZero = mins.slice(-1)
        if (checkZero == '0')
        {
			//access the 10min file
			var rawTenJSON = fs.readFileSync("CombinedData_10min.json")
			var tenJSON = JSON.parse(rawTenJSON)
			
			//push the data to the 10 min path
			db.ref(date + "/10min_culmalative_data").push(
			{
				time: now.getHours() + ':' + mins,
				decTime: decTime,
				//divide each of the times by 6 (10mins in secs *100)
				sittingPercent: tenJSON["Sitting_Time"]/6,
				focusedPercent: tenJSON["FocusedTime"]/6,
				phoneTime: tenJSON["Phone_Time"],
				keys: tenJSON["Keys"],
				mouse: tenJSON["Scroll"],
				scroll: tenJSON["Mouse"]
			})

			
			//now set the file to have the first minute values
			var sitTime
			
			if (data["Sitting"] == "Sitting_In_Chair")
			{
				sitTime = 60
			}
			else
			{
				sitTime = 0
			}
			
			//set the JSON values with the first minute values
			tenJSON =
			{
				"Sitting_Time":data["Sitting"],
				"Focused_Time":data["FocusTime"],
				"Phone_Time":data["PhoneTime"],
				"Keys":data["Keys"],
				"Scroll":data["Scroll"],
				"Mouse":data["Mouse"]
			}
			//then push it to the JSON file
			fs.writeFileSync("CombinedData_10min.json", JSON.stringify(tenJSON))
				
		}
		else
		{
			//if this is a normal minute - add the current data to the 10min file data
			//access the 10min file
			
			var rawTenJSON = fs.readFileSync("CombinedData_10min.json")
			var tenJSON = JSON.parse(rawTenJSON)
			tenJSON["Sitting_Time"] += data["Sitting"]
			tenJSON["Focused_Time"] += data["FocusTime"]
			tenJSON["Phone_Time"] += data["PhoneTime"]
			tenJSON["Keys"] += data["Keys"]
			tenJSON["Scroll"] += data["Scroll"]
			tenJSON["Mouse"] += data["Mouse"]
			//then push it to the JSON file
			fs.writeFileSync("CombinedData_10min.json", JSON.stringify(tenJSON))
		}
	})
}, 4000)
