var app = module.parent.exports.app;
var Employees = require('../models/employees.js');

app.get('/panel/employees', function(req, res){
	Employees.find({}, function(err,docs){
		res.json(docs);
	});
});