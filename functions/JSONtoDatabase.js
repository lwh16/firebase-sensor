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
console.log("Node server starting...")

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
var prevChairState = ""

const now = new Date()
var date = (now.getDate()).toString() +'-' + (now.getMonth() + 1).toString()

var mins = now.getMinutes()//.toString()
if (mins < 10)
{
	mins = '0' + mins
}

var hour = now.getHours()
var min = now.getMinutes()
var decTime = (hour + mins/60).toFixed(2)

var ref = db.ref()
ref.once("value").then(function(snapshot) {
	
	var dateExist = snapshot.child(date).exists()
	
	//This date hasn't had an instacne created for it yet
	if (!dateExist)
	{
		dayJSON =
		{
			"TotalTime": 0,
			"Sitting_Time":0,
			"Focused_Time":0,
			"Non_Focused_Time":0,
			"Phone_Time":0,
			"Keys":0,
			"Scroll":0,
			"Mouse":0
		}
		console.log(dayJSON)
		console.log("set all to zero")

		//push the zeroed data to the JSON file
		fs.writeFileSync("CombinedData_Day.json", JSON.stringify(dayJSON))

		tenJSON =
		{
			"Sitting_Time":0,
			"Focused_Time":0,
			"Phone_Time":0,
			"Non_Focused_Time":0,
			"Keys":0,
			"Scroll":0,
			"Mouse":0
		}
		//then push it to the JSON file
		fs.writeFileSync("CombinedData_10min.json", JSON.stringify(tenJSON))

		//push that data to the database
		db.ref(date + "/full_day").set(
		{
			startTime : hour + ':' + mins,
			currentTime : hour + ':' + mins,
			TotalTime : 0,
			SittingTime : 0,
			FocusedTime : 0,
			NonFocusedTime : 0,
			PhoneTime : 0,
			Keys : 0,
			Scroll : 0,
			Mouse : 0
		})
	}
})
 
db.ref(date + "/startTime").set(
{
	startTime : hour + ':' + mins
})

setInterval(() =>
{
    /**
    * Retrieve the raw data from Combine_Data.txt
    */
    accessJSONInformation((err, data, time) =>
    {
		//Check the user is logged on to their computer
		var LogOnRaw = fs.readFileSync("LoggedOn.json")
		var LogOn = JSON.parse(LogOnRaw)
		
		var SittingRaw = fs.readFileSync("CombinedData.json")
		var Sitting = JSON.parse(SittingRaw)
		
		//console.log("Nobody is there...")
		//irrelvant of the users state, upload whether they have logged on and
		//Get the date and time variables
		//This will be used as the first argument in every path
		const now = new Date()
		var date = (now.getDate()).toString() +'-' + (now.getMonth() + 1).toString()
		
		//create a string time value with minutes as a two digit value
		var mins = now.getMinutes()//.toString()
		if (mins < 10)
		{
			mins = '0' + mins
		}
		
		//Also create a decimal time where minutes are /100
		var hour = now.getHours()
		var min = now.getMinutes()
		var decTime = (hour + mins/60).toFixed(2)
		console.log(hour + ':' + mins)
		
		//See whether this is the first time logging on today
		//check whether this date exists already or not
		var ref = db.ref()
		ref.once("value").then(function(snapshot) {
			
			var dateExist = snapshot.child(date).exists()
			
			//This date hasn't had an instacne created for it yet
			if (!dateExist)
			{
				//set the dayJSON values all to zero
				dayJSON =
				{
					"TotalTime": 0,
					"Sitting_Time":0,
					"Focused_Time":0,
					"Non_Focused_Time":0,
					"Phone_Time":0,
					"Keys":0,
					"Scroll":0,
					"Mouse":0
				}
				console.log(dayJSON)
				console.log("set all to zero")
				
				//push the zeroed data to the JSON file
				fs.writeFileSync("CombinedData_Day.json", JSON.stringify(dayJSON))
				
				tenJSON =
				{
					"Sitting_Time":0,
					"Focused_Time":0,
					"Phone_Time":0,
					"Non_Focused_Time":0,
					"Keys":0,
					"Scroll":0,
					"Mouse":0
				}
				//then push it to the JSON file
				fs.writeFileSync("CombinedData_10min.json", JSON.stringify(tenJSON))
				
				//push that data to the database
				db.ref(date + "/full_day").set(
				{
					currentTime : hour + ':' + mins,
					TotalTime : 0,
					SittingTime : 0,
					FocusedTime : 0,
					NonFocusedTime : 0,
					PhoneTime : 0,
					Keys : 0,
					Scroll : 0,
					Mouse : 0
				})
				
			}
			else
			{
				//update the json file
				var rawDayJSON = fs.readFileSync("CombinedData_Day.json")
				var dayJSON = JSON.parse(rawDayJSON)
				
				var sitTime
			
				if (data["Sitting"] == "Sitting_In_Chair")
				{
					sitTime = 1
				}
				else
				{
					sitTime = 0
				}
				
				//edit the dayJSon file
				dayJSON["TotalTime"] += 1
				dayJSON["Sitting_Time"] += sitTime
				dayJSON["Focused_Time"] += data["FocusTime"]
				dayJSON["Non_Focused_Time"] += data["NonFocusTime"]
				dayJSON["Phone_Time"] += data["PhoneTime"]
				dayJSON["Keys"] += data["Keys"]
				dayJSON["Scroll"] += data["Scroll"]
				dayJSON["Mouse"] += data["Mouse"]
				
				//push the zeroed data to the JSON file
				fs.writeFileSync("CombinedData_Day.json", JSON.stringify(dayJSON))
				
				//push the edited data to the database
				db.ref(date + "/full_day").set(
				{
					currentTime : hour + ':' + mins,
					TotalTime : dayJSON["TotalTime"],
					SittingTime : dayJSON["Sitting_Time"],
					FocusedTime : dayJSON["Focused_Time"],
					NonFocusedTime : dayJSON["Non_Focused_Time"],
					PhoneTime : dayJSON["Phone_Time"],
					Keys : dayJSON["Keys"],
					Scroll : dayJSON["Scroll"],
					Mouse : dayJSON["Mouse"]
				})
				
			}
			
		})
		
		db.ref(date + "/constants").set(
		{
			currentTime : hour + ':' + mins,
			loggedOn : LogOn["LoggedOn"],
			present : Sitting["Sitting"]
		})
		
		//also have a record of when and when not the user is sat down
		if (prevChairState != Sitting["Sitting"])
		{
			//this means that a plot should be made
			//this method to add points is used because it allows the data to be better plotted
			if (Sitting["Sitting"] == "Sitting_In_Chair")
			{
				//just come back from a break
				db.ref(date + "/chairState").push(
				{
					currentTime : hour + ':' + mins,
					decTime : decTime,
					OnBreak : 1,
					Sitting : 0
				})
				
				db.ref(date + "/chairState").push(
				{
					currentTime : hour + ':' + mins,
					decTime : decTime,
					OnBreak : 0,
					Sitting : 1
				})
			}
			
			if (Sitting["Sitting"] == "Empty_Chair")
			{
				//just taken a break
				db.ref(date + "/chairState").push(
				{
					currentTime : hour + ':' + mins,
					decTime : decTime,
					OnBreak : 0,
					Sitting : 1
				})
				
				db.ref(date + "/chairState").push(
				{
					currentTime : hour + ':' + mins,
					decTime : decTime,
					OnBreak : 1,
					Sitting : 0
				})
			}
			prevChairState = Sitting["Sitting"]
		}
				
		
		
		if (LogOn["LoggedOn"] == 1 && Sitting["Sitting"] == "Sitting_In_Chair")
		{
			console.log("logged on...")
			//ONE MINUTE INTERVAL
			
			if (err)
			{
				return console.error(err)
			}
			
			
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
			
			
			//TEN MINUTE INTERVAL 
			
			//now see if the one of the 10 min intervals has been reached
			var checkZero = (mins.toString()).slice(-1)
			//console.log(checkZero)
			//console.log((checkZero == '0'))
			if (checkZero == '0')
			{
				//access the 10min file
				var rawTenJSON = fs.readFileSync("CombinedData_10min.json")
				var tenJSON = JSON.parse(rawTenJSON)
				//push the data to the 10 min path
				db.ref(date.toString() + "/10min_culmalative").push(
				{
					time: now.getHours() + ':' + mins,
					decTime: decTime,
					//divide each of the times by 6 (10mins in secs *100)
					sittingPercent: tenJSON["Sitting_Time"]*10,
					focusedPercent: tenJSON["Focused_Time"]*10,
					nonFocusedPercent : tenJSON["Non_Focused_Time"]*10,
					phoneTime: tenJSON["Phone_Time"],
					keys: tenJSON["Keys"],
					mouse: tenJSON["Mouse"],
					scroll: tenJSON["Scroll"]
				})

				
				//now set the file to have the first minute values
				var sitTime
				
				if (data["Sitting"] == "Sitting_In_Chair")
				{
					sitTime = 1
				}
				else
				{
					sitTime = 0
				}
				
				//set the JSON values with the first minute values
				tenJSON =
				{
					"Sitting_Time":sitTime,
					"Focused_Time":data["FocusTime"],
					"Non_Focused_Time":data["NonFocusTime"],
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
				
				var sitTime
				
				if (data["Sitting"] == "Sitting_In_Chair")
				{
					sitTime = 1
				}
				else
				{
					sitTime = 0
				}
				
				tenJSON["Sitting_Time"] += sitTime
				tenJSON["Focused_Time"] += data["FocusTime"]
				tenJSON["Non_Focused_Time"] += data["NonFocusTime"]
				tenJSON["Phone_Time"] += data["PhoneTime"]
				tenJSON["Keys"] += data["Keys"]
				tenJSON["Scroll"] += data["Scroll"]
				tenJSON["Mouse"] += data["Mouse"]
				//then push it to the JSON file
				fs.writeFileSync("CombinedData_10min.json", JSON.stringify(tenJSON))
			}
		}
	})
}, 60000)
