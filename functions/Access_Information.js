//Access_Information.js
//----------------------------------------------------------------------
//Luke Holland
//22nd December 2020
//----------------------------------------------------------------------
//Function that pulls information from the text file and returns it
//----------------------------------------------------------------------

//Access the file library needed
const fs = require('fs')

//Create a function which does this

const accessInformation = (callback) =>
{
	fs.readFile('CombinedData.txt', 'utf-8', (err, data, time) =>
	{
		//If there's an error, return that error
		if (err)
		{
			return callback(err)
		}
		const now = new Date().getTime()
		//const hour = now.getHours()
		//const minute = now.getMinutes()
		//const second = now.getSeconds()
		//const timeNow = 'Time : ' + (hour + (minute/60) + (second/3600)).toFixed(4)
		//if nothing goes back return the callback with the data
		const timeNow = now.toString()
		callback(null, data, now)
	})
}

//Then export the function so it can be used elsewhere
module.exports = accessInformation


