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

    if(data.type == "new"){
      // save incoming data to scope
      $scope.$apply(function(){

        $scope.overlaps = []
        for(const gene of data.genes){
          let sequence = gene.sequence
          let name = gene.name
          for(const overlap of gene.overlaps){
            overlap["name"] = name
            let start = overlap.fromIndex
            let end = overlap.toIndex

            if(start <= end){
              overlap.arrowStart = -4
              overlap.arrowLength = 4
            }else{
              overlap.arrowStart = 4
              overlap.arrowLength = -4
            }

            overlap.color = getRandomColor()
            overlap.fromIndex = Math.min(start,end)
            overlap.toIndex = Math.max(start, end)

            $scope.overlaps.push(overlap)

          }
        }

        $scope.dna = data.dna
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

    console.log("this change should be visible")

    window.top.postMessage('hello', '*')
  }


}]);
