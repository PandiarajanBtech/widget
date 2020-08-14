routerApp.controller('widgetDetailController', function ($scope, $localStorage, $state, $filter) {
    $scope.widgetId = $state.params.widgetId;
    $scope.widgetDetail = $localStorage.widgetInfo;   
    console.log($state.params.widgetId);
    $scope.currentWidget = $filter('filter')($scope.widgetDetail.widget, { 'id': parseInt($scope.widgetId) })[0];
    $scope.keyValPair = $scope.currentWidget.keyvaluepair;
    
    $scope.close = function () {
        $state.go('widgetSummary');
    }
    $scope.editWidget = function (widgetId) {
        $state.go('widgetEdit', { widgetId: widgetId });
    }

});