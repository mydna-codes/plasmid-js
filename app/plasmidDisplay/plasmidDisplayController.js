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

  $scope.temp = "this is some temporary text"

  const receiveMessage = function (event) {

    // save incoming data to scope
    $scope.$apply(function(){
      console.log("child received changed:", event.data)
    })

  }

  $window.addEventListener("message", receiveMessage, false);

  $scope.sendToParent = function (){

    console.log("this change should be visible")

    window.top.postMessage('hello', '*')
  }


}]);
