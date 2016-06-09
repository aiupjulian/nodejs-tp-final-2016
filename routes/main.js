var app = module.parent.exports.app;
var passport = module.parent.exports.passport;
var Employees = require('../models/employees.js');
var Admins = require('../models/admins.js');

var adminAuth = function(req, res, next) {
    if(typeof req.user != "undefined") {
        //Authorized
        next();
    } else {
        //Not authorized, redirect
        res.redirect('/admin');
    }
}

app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

app.get('/panel/employees', adminAuth, function(req, res){
	Employees.find({}, {  }, function(err,docs){
		res.render('list', { title: 'List', employees: docs });
	});
});

app.get('/panel/employees/new', adminAuth, function(req, res){
	res.render('new', { title: 'New' });
});

app.post('/panel/employees/new', adminAuth, function(req, res){
	console.log(req.body);
    req.checkBody('password', 'Passwords do not match').equals(req.body.confirm);
    req.checkBody('email', 'Invalid email').isEmail();
    var errors = req.validationErrors();
    if(errors) {
        errors = errors.map(function(a) {return a.msg;});
        res.render('new', { title: 'New', errors: errors, params: req.body });
        return;
    }
    var e = new Employees({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password
	});
	e.save(function(err, doc){
		if(!err){
			res.redirect('/panel/employees');
		} else {
			res.end(err);    
		}    
	});
});

app.get('/panel/employees/delete/:id', adminAuth, function(req, res){
    Employees.remove({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.redirect('/panel/employees');
        } else {
            res.end(err);    
        }    
    });
});

app.get('/panel/employees/edit/:id', adminAuth, function(req, res){
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.render('edit', { title: 'Edit', employee: doc});
        } else {
            res.end(err);
        }    
    });
});

app.post('/panel/employees/edit/:id', adminAuth, function(req, res){
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            doc.firstName = req.body.firstName;
            doc.lastName = req.body.lastName;
            doc.email = req.body.email;
            doc.save(function(err, doc){
                if(!err){
                    res.redirect('/panel/employees');
                } else {
                    res.end(err);    
                }    
            }); 
        } else {
            res.end(err);    
        }
    });
});

app.get('/admin', function(req, res) {
    if(!req.user) {
        res.render('admin', { title: 'Login', error: req.flash('error') });
    } else {
        res.render('admin', { title: 'Hello ' + req.user.email });
    }
});

app.post('/admin', passport.authenticate('AdminLogin',
    {
        successRedirect: '/panel/employees',
        failureRedirect: '/admin',
        failureFlash: true
    }
));

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/', function(req, res) {
    res.render('index', { title: 'Employee Wiki' });
});

app.get('/employee/search/:keyword', function(req, res) {
    var reg = new RegExp("([A-z])*" + req.params.keyword + "([A-z])*", 'ig');
    Employees.find({ $or: [ { firstName: reg }, { lastName: reg } ] }, function(err, docs) {
        if(!err) {
            res.json(docs);
        } else {
            res.end(err);
        }
    });
});
