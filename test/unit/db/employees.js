var mongoose = require('mongoose');
var Employee = require('../../../models/employees.js');

describe('Test of employees', function(){
	before(function(done) {
		mongoose.connect('mongodb://localhost/nodejs-tp-final-2016', done);
	})

	it('Should save employee in DB', function(done){
		var e = new Employee ({
			firstName: 'Julian',
			lastName: 'Aiup',
			email: 'julianaiup@yahoo.com',
			password: 'julianaiup'
		});
		e.save(done);
	});

    after(function(done) {
        mongoose.connection.close(done);
    });
});
