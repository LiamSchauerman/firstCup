var app = angular.module('firstCup', ['ui.router']);

app.config(function($stateProvider, $httpProvider, $urlRouterProvider) {
	// $scope.links = [];
	$urlRouterProvider.otherwise("/home");
	$stateProvider
		.state('home', {
			url: "/home",
			views: {
				"linksView": { templateUrl: "angular/views/linksView.html" },
				"navbar": { templateUrl: "angular/views/navBar.html" }
			}
		})
		.state('signup', {
			url: "/signup",
			views: {
				"signupView": { templateUrl: "angular/views/signupView.html"}
			}
		})
});

app.controller('LinksController', function($scope, Mongo, $state){
	//get array of link objects from db
	// $scope.links should be an array of objects from linkmodels collection
	console.log('in linkscontroller');

	// making ajax request
	Mongo.updateLinks().then(function(resp){
			$scope.links = resp.data;
		});
	$scope.deleteLink = function(link){
		// delete link from database
		console.log(link)
		Mongo.deleteLink(link);
		$state.reload();
	}
})

app.controller("NavController", function($scope, Mongo, $state){
	$scope.submission = {};
	$scope.submit = function(submission){
		console.log(submission)
		//save to db
		Mongo.postLink(submission);
		$state.reload();
	}
	$scope.refresh = function(submission){
		console.log('refresh')
		$state.reload();
	}
	$('.modal-trigger').leanModal();
})

app.controller("AuthController", function($scope, Mongo){
	$scope.user = {};
	function confirmPassword(pass1, pass2){
		if(pass1 === pass2){
			return true;
		}
		return false;
	}
	$scope.signup = function(user){
		if(confirmPassword(user.password, user.confirmPassword)){
			Mongo.addUser(user);
			
		}


	}
})

app.factory('Mongo', function($http){
	function updateLinks(){
		return $http({
			method: 'GET',
			url: '/bro'
		})
	};
	function postLink(submission){
		console.log(submission);
		return $http({
			method: 'POST',
			url: '/linkSubmit',
			data: {submission: submission},
			dataType: 'application/json'
		});
	}
	function deleteLink(link){
		console.log(link)
		return $http({
			method: 'DELETE',
			url: '/deleteLink?_id='+link._id
		})
	}
	function addUser(user){
		console.log(user);
		return $http({
			method: "POST",
			url: '/api/users/signup',
			dataType: 'application/json',
			data: {user: user}
		}).then(function(resp){
			console.log('success callback in finduser')
			console.log(resp)
		})
	}

	return {
		updateLinks: updateLinks,
		postLink: postLink,
		deleteLink: deleteLink,
		addUser: addUser
	}
})

$(document).on('ready', function(){
	console.log('ready block')
	$(".dropdown-button").dropdown();
})

window.signinCallback = function(authResult) {
  if (authResult['status']['signed_in']) {
    // Update the app to reflect a signed in user
    // Hide the sign-in button now that the user is authorized, for example:
    document.getElementById('signinButton').setAttribute('style', 'display: none');
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
  }
}