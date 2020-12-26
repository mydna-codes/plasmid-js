angular.module('plasmidJsApp', [
    'ngRoute',
    'plasmidJsApp.plasmidDisplay',
    'angularplasmid'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    console.log("routing")

    $routeProvider.otherwise({redirectTo: '/display'});
}]);
