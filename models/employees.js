var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var employeeSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String
});

employeeSchema.pre("save", function(next) {
    if(this.isModified('password'))
        this.password = crypto.createHash('md5').update(this.password).digest("hex");
    next();
});

var employeeModel = mongoose.model('Employees', employeeSchema);

module.exports = employeeModel;
