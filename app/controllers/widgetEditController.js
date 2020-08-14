routerApp.controller('widgetEditController', function ($scope, $localStorage, $filter, $state) {
    $scope.widgetId = $state.params;
    //console.log($state.params);
    $scope.widgetDetail = $localStorage.widgetInfo;
    $scope.currentWidget = $filter('filter')($scope.widgetDetail.widget, { 'id': 1 })[0];
    console.log($scope.currentWidget);

    $scope.addMore = function () {

    };

    $scope.remove = function (row) {

    };


});