var mongoose = require('mongoose');
var Admin = require('../../../models/admins.js');

describe('Test of admins', function(){
    before(function(done) {
        mongoose.connect('mongodb://localhost/nodejs-tp-final-2016', done);
    })
    it('Should save admin in DB', function(done){
        var a = new Admin ({
            email: 'admin@admin.com',
            password: '123456'
        });
        a.save(done);
    });
    after(function(done) { 
        mongoose.connection.close(done);
    })
});
