var routerApp = angular.module('routerApp', ['ui.router', 'ngStorage']);

routerApp.controller('widgetSummaryController', function ($scope, $localStorage, $http, $state) {

    $http.get("sample.json").then(function (response) {
        $localStorage.widgetInfo = response.data;
    });
    $scope.widgetInfo = $localStorage.widgetInfo;

    $scope.deleteWidget = function (widgetId) {
        delete $scope.widgetInfo(widgetId);

    }
    $scope.widgetDetail = function (widgetId) {
        $state.go('widgetDetail', { widgetId: widgetId });
    }

});