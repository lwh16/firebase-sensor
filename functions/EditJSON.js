const fs = require('fs')

var rawData = fs.readFileSync('JSONtoEdit.json')
var student = JSON.parse(rawData)

console.log(student)

var age = parseFloat(student["age"])

age += 5

student["age"] = age

console.log(student)

var data = JSON.stringify(student)
fs.writeFileSync('JSONEdited.json', data)
