var app = module.parent.exports.app;
var Employees = require('../models/employees.js');

app.get('/panel/employees', function(req, res){
	Employees.find({}, function(err,docs){
		res.render('list', { title: 'List', employees: docs });
	});
});

app.get('/panel/employees/new', function(req, res){
	res.render('new', { title: 'New'});
});

app.post('/panel/employees/new', function(req, res){
	console.log(req.body);
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

app.get('/panel/employees/delete/:id', function(req, res){
    Employees.remove({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.redirect('/panel/employees');
        } else {
            res.end(err);    
        }    
    });
});

app.get('/panel/employees/edit/:id', function(req, res){
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.render('edit', { title: 'Edit', employee: doc});
        } else {
            res.end(err);
        }    
    });
});

app.post('/panel/employees/edit/:id', function(req, res){
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
