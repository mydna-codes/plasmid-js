'use strict';

angular.module('plasmidJsApp.plasmidDisplay', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/display', {
    templateUrl: 'plasmidDisplay/plasmidDisplay.html',
    controller: 'plasmidDisplayController'
  });
}])

.controller('plasmidDisplayController',  ["$scope", "$window", function($scope, $window) {


  $scope.showPlasmid = false
  $scope.sequencingStart = 0
  $scope.sequencingLength = 100

  $scope.temp = "this is some temporary text but it is different then the previous temporary text :) but now it is even longer and green"

  const receiveMessage = function (event) {

    const data = event.data
    console.log("child received:", data)

    if(data.type == "create"){
      // save incoming data to scope
      $scope.$apply(function(){
        $scope.dna = data.dna
        $scope.overlaps = data.overlaps

        $scope.tickInterval10 = Math.round(data.dna.sequence.length / 10)
        $scope.tickInterval20 = Math.round(data.dna.sequence.length / 20)

        $scope.enzymes = data.enzymes
        $scope.showPlasmid = true
      })
    }


  }

  const getRandomColor = function(){
    let r = Math.random()*256|0;
    let g = Math.random()*256|0;
    let b = Math.random()*256|0;

    return "fill:rgba(" + r + "," + g + "," + b + "," + "0.8" + ")"

  }

  $window.addEventListener("message", receiveMessage, false);

  $scope.sendToParent = function (){
    window.top.postMessage('hello', '*')
  }


}]);
