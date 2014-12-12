'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function(){

	}])
	.controller('WaitListController', ['$scope', 'partyService', 'textMessageService', 'authService', function($scope, partyService, textMessageService, authService){
		//connecting $scope.parties to live firebase database.
		authService.getCurrentUser().then(function(user){
			if(user){
				$scope.parties	= partyService.getPartyByID(user.id);
			}
		})
		//object to store data from waitlist form
		$scope.newParty = {name: '', phone: '', size: '', done: false, notified: 'No'};

		//function to save a new party to the waitlist.
		$scope.saveParty = function(){
			partyService.saveParty($scope.newParty, $scope.currentUser.id);
			$scope.newParty = {name: '', phone: '', size: '', done: false, notified: 'No'};
		};

		$scope.sendText = function(party){
			textMessageService.sendTextMessage(party, $scope.currentUser.id);
		}
	}])
	.controller('AuthController', ['$scope', 'authService', function($scope, authService){
		//object bound to input
		$scope.user = {
			email: '',
			password: ''
		};
		//register new user using authService
		$scope.register = function(){
				authService.register($scope.user);
		};
		//login existing user using authService
		$scope.login = function(){
			authService.login($scope.user);
		};
		//logout current user using authService
		$scope.logout = function(){
			authService.logout();
		}
	}]);