'use strict';

angular.module('plasmidJsApp.plasmidDisplay', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/display', {
    templateUrl: 'plasmidDisplay/plasmidDisplay.html',
    controller: 'plasmidDisplayController'
  });
}])

.controller('plasmidDisplayController',  ["$scope", "$window", function($scope, $window) {

  $scope.sequencingStart = 0
  $scope.sequencingLength = 100
  $scope.sequenceLength = 360

  function receiveMessage(event) {
    console.log(event); //just checking
    $scope.$apply(function(){

    })
    //$scope.prefix = event.detail;
  }

  $window.addEventListener("message", receiveMessage, false);

}]);
