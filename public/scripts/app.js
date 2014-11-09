(function() {

function onScore(type, events) {
	return function() {
		events.unshift({
			title: type + ' scored',
			message: type + ' scored',
			timestamp: new Date()
		});
	}
}

var app = angular.module('ponger', [
	'ui.router',
	'btford.socket-io',
	'angularMoment'
]).

config([
	'$stateProvider',
	function($stateProvider) {
		$stateProvider
			.state('app', {
				abstract: true,
				templateUrl: '/views/layout.html'
			})
			.state('app.home', {
				url: '',
				templateUrl: '/views/home/index.html',
				controller: 'HomeCtrl',
				controllerAs: 'home'
			})
	}
]).

factory('AppSocket', [
	'socketFactory',
	function(Socket) {
		return Socket();
	}
]).

controller('AppCtrl', [
	'$scope',
	'AppSocket',
	function(scope, socket) {
		var self = this;
		this.title = "Ponger";
	}
]).

controller('HomeCtrl', [
	'AppSocket',
	function(socket) {
		var self = this;
		this.events = [];
		var greenScore = _.throttle(onScore('Green', this.events), 1000);
		var redScore = _.throttle(onScore('Red', this.events), 1000);
		socket.on('spark:localconn', function() {
			self.events.unshift({
				title: 'Connected',
				message: 'Connected',
				timestamp: new Date()
			});
		})
		socket.on('spark:green_on', greenScore)
		socket.on('spark:red_on', redScore)
	}
])

;

}).call(this);
