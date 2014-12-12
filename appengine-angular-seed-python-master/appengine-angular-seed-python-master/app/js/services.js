'use strict';

/* Services */
// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
	//.value('FIREBASE_URL', 'https://davidsun-demo.firebaseio.com/')
	.factory('FIREBASE_URL', function(){
		return 'https://davidsun-demo.firebaseio.com/';
	})
	.factory('dataService', function($firebase, FIREBASE_URL){
		var dataRef = new Firebase(FIREBASE_URL);
		var fireData = $firebase(dataRef);
		return fireData;
	})
	.factory('partyService', function($firebase, FIREBASE_URL, dataService){
		//var partiesRef = new Firebase(FIREBASE_URL+'parties');
		//var parties = $firebase(partiesRef);
		//var parties = dataService.$child('parties');
		var users = dataService.$child('users');
		var partyServiceObject = {
			//parties: parties,
			saveParty: function(party, userID){
				users.$child(userID).$child('parties').$add(party);
			},
			getPartyByID: function(userID){
				return users.$child(userID).$child('parties');
			}
		}
		return partyServiceObject;
	})
	.factory('textMessageService', function($firebase, FIREBASE_URL, partyService, dataService){
		var textMessages = dataService.$child('textMessages');
		var textMessageObject = {
			sendTextMessage: function(party, userID){
				var newTextMessage = {
					phonenumber: party.phone,
					size: party.size,
					name: party.name
				};
				textMessages.$add(newTextMessage)
				partyService.getPartyByID(userID).$child(party.$id).$update({notified: "Yes"});
			}
		};
		return textMessageObject;
	})
	.factory('authService', function($firebaseSimpleLogin, $location, $rootScope, FIREBASE_URL, dataService){
		var authRef = new Firebase(FIREBASE_URL);
		var auth = $firebaseSimpleLogin(authRef);
		var emails = dataService.$child('emails');

		var authServiceObject = {
			register: function(user){
				auth.$createUser(user.email, user.password).then(function(data) {
					console.log(data);
					authServiceObject.login(user, function(){
						emails.$add({email: user.email});
					});
			})
			},
			login: function(user, optionalCallBack){
				auth.$login('password', user).then(function(data) {
					console.log(data);
					//redirect users to /waitlist.
					if(optionalCallBack){
						optionalCallBack();
					}
					$location.path('/waitlist');
			})
			},
			logout: function(){
				auth.$logout();
				$location.path('/');
			},
			getCurrentUser: function(){
				return auth.$getCurrentUser();
			}
		};
		$rootScope.$on('$firebaseSimpleLogin:login', function(e, user){
			//save currentUser
			$rootScope.currentUser = user;
		});
		$rootScope.$on('$firebaseSimpleLogin:logout', function(){
			//save currentUser
			$rootScope.currentUser = null;
		});


		return authServiceObject;
	})
