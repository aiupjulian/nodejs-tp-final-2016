var mongoose = require('mongoose');
var Admin = require('../../../models/admins.js');
var assert = require('assert');

describe('Test of admins', function(){
    before(function(done) {
        mongoose.connect('mongodb://localhost/nodejs-tp-final-2016', done);
    });

    it('Should save admin in DB', function(done) {
        var a = new Admin ({
            email: 'admin@admin.com',
            password: '123456'
        });
        a.save(done);
    });

    it('Should store hashed password', function(done) {
        var a = new Admin({ password: '123456' });
        a.save(function(err, doc) {
            assert.ok(doc.password == 'e10adc3949ba59abbe56e057f20f883e', 'Passwords should match');
            done();
        });
    });

    it('Admin should authenticate', function(done) {
        var a = new Admin({ email:'admin@admin.com', password: '123456' });
        a.save(function(err, doc) {
            assert.ok(a.authenticate('123456') === true, 'OK auth');
            assert.ok(a.authenticate('12345678') === false, 'OK auth');
            done();
        });
    });

    after(function(done) { 
        mongoose.connection.close(done);
    })
});
