var mongoose = require('mongoose');
var Employee = require('../../../models/employees.js');
var assert = require('assert');

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

    it('Should store hashed password', function(done) {
        var e = new Employee({ password: 'julianaiup' });
        e.save(function(err, doc) {
            assert.ok(doc.password == '9ce725958d0cca4651adfd148e388387', 'Passwords should match');
            done();
        }); 
    });

    it('Employee should authenticate', function(done) {
        var e = new Employee({ email:'julianaiup@yahoo.com', password: 'julianaiup' });
        e.save(function(err, doc) {
            assert.ok(e.authenticate('julianaiup') === true, 'OK auth');
            assert.ok(e.authenticate('julianaiupee') === false, 'OK auth');
            done();
        });
    });

    after(function(done) {
        mongoose.connection.close(done);
    });
});
