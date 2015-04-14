//endpoints
var User = require('../models/userModel.js');
var Link = require('../models/linkModel.js');

module.exports = function(app, passport){
	app.get("/profile", function(req,res,next){
		console.log('profile route...')
		passport.authenticate('local', function(err, user){
			if(err){ throw err }
			console.log('reqlogin')
			req.logIn(user, function(err) {
			  if (err) { return next(err); }
			  console.log("redirecting to users/username")
			  return res.redirect('/users/' + user.local.email);
			});
			console.log("here")
			// console.log(req.user);
			// console.log('authenticated in /')
		});
	});
	app.get('/auth', ensureAuthenticated, function(req,res){
		res.send("You are authenticated! <br/>" + req.user)
	})
	app.post('/linkSubmit', function(req, res){
		var submission = new Link(req.body.submission);
		console.log('linksubmit')
		// user = req.session.user;
		// if(user){
		// 	submission.user = session.user.username;
		// 	submission.postedBy = session.user.username;
		// };
		submission.save(function(err, data){
			console.log('in linkSubmit callback');
			if (err) console.log(err);
			console.log('Saved : ', data );
			res.status(201).end();
		})
	})
	app.post('/signup', function(req, res, next) {
	  passport.authenticate('local-signup', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.redirect('/');
	    });
	  })(req, res, next);
	});
	app.post('/login', function(req, res, next) {
	  passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) { return res.redirect('/'); }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      return res.redirect('/');
	    });
	  })(req, res, next);
	});
	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});
	app.get('/user', function(req,res,next){
		res.send(req.user)
	})
	app.get('/users/:username', function(req, res, next){
		// res.send(req.)
		passport.authenticate('local', function(err, user, info){
			console.log('logged in'+req.user)
			var username = req.query.username;
			res.send(user.local)
		})(req,res,next);
	})

	app.get('/bro',function(request, response){
		// query db for all links
		Link.find(function(err, links){
			if (err) return console.log(err)
			response.status(200).send(links);
		});
	})

	app.delete('/deleteLInk', function(req, res){
		// get id from url query
		var link = { _id: req.query._id };
		Link.find(link)
			.remove( function(err, results){
				console.log('inside remove callback');
			});
		});
}

function ensureAuthenticated(req, res, next){
	if(req.user){
		console.log('authenticated')
		next()
	}
	res.status(400).end("not authenticated");
}
