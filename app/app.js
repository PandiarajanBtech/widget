var routerApp = angular.module('routerApp', ['ui.router', 'ngStorage']);

routerApp.config(function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
});

routerApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('widgetEdit', {
            url: '/edit/:widgetId',
            templateUrl: 'templates/widgetEdit.html',
            controller: 'widgetEditController'
        })
        .state('widgetDetail', {
            url: '/detail/:widgetId',
            templateUrl: 'templates/widgetDetail.html',
            controller: 'widgetDetailController'
        })
        // multiviews
        .state('widgetSummary', {
            url: '/',
            views: {
                '': {
                    templateUrl: 'templates/widgetSummary.html',
                    controller: 'widgetSummaryController'
                },
                /*'widgetDetail@widgetSummary': { 
                    url: '/detail/:widgetId',
                    templateUrl: 'widgetDetail.html',
                    controller: 'widgetDetailController'
                }  */
            }
        });
});

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

routerApp.controller('widgetDetailController', function ($scope, $localStorage, $state, $filter) {
    $scope.widgetId = $state.params.widgetId;
    $scope.widgetDetail = $localStorage.widgetInfo;
    $scope.currentWidget = $filter('filter')($scope.widgetDetail.widget, { 'id': parseInt($scope.widgetId) })[0];
    $scope.keyValPair = $scope.currentWidget.keyvaluepair;

    $scope.close = function () {
        $state.go('widgetSummary');
    }
    $scope.editWidget = function (widgetId) {
        $state.go('widgetEdit', { widgetId: widgetId });
    }

});

routerApp.controller('widgetEditController', function ($scope, $localStorage, $filter, $state, $window) {
    $scope.widgetId = $state.params.widgetId;
    $scope.widgetDetail = $localStorage.widgetInfo;
    $scope.currentWidget = $filter('filter')($scope.widgetDetail.widget, { 'id': parseInt($scope.widgetId) })[0];
    $scope.keyValPair = $scope.currentWidget.keyvaluepair;

    $scope.addMore = function () {
        var widget = {
            "first": ""
        };
        $scope.currentWidget.keyvaluepair.push(widget);
        $scope.newPair = $scope.currentWidget.keyvaluepair;
    };

    $scope.remove = function (widgetIndex) {
        if ($window.confirm("Do you want to delete")) {
            //Remove the item from Array using Index.
            $scope.currentWidget.keyvaluepair.splice(widgetIndex, 1);
        }
    };

    $scope.editWidget = function(widgetId) {
        $scope.widget = [];
        var widgetKey = $scope.addKey;
        var widgetValue = $scope.addValue;
        $scope.widget.push({
            "id" : widgetId,
            "name" : $scope.name,
            "number" : $scope.number,
            "keyValPair" : [
                {widgetKey : widgetValue}
            ]
        });
    }

    $scope.cancel = function(widgetId) {
        $state.go('widgetDetail', { widgetId: widgetId });
    }
    


});

routerApp.service('widgetService', function ($http, $q) {

    var _this = this;
    this.promiseToHaveData = function () {
        var defer = $q.defer();

        $http.get('sample.json')
            .success(function (data) {
                angular.extend(_this, data);
                console.log(data);
                defer.resolve();
            })
            .error(function () {
                defer.reject('could not find someFile.json');
            });

        return defer.promise;
    }
});

routerApp.filter('words', function () {
    function isInteger(x) {
        return x % 1 === 0;
    }


    return function (value) {
        if (value && isInteger(value))
            return toWords(value);

        return value;
    };

});
var th = ['', 'thousand', 'million', 'billion', 'trillion'];
var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];


function toWords(s) {
    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            }
            else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' ';
                sk = 1;
            }
        }
        else if (n[i] != 0) {
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0) str += 'hundred ';
            sk = 1;
        }


        if ((x - i) % 3 == 1) {
            if (sk) str += th[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    }
    if (x != s.length) {
        var y = s.length;
        str += 'point ';
        for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
}

window.toWords = toWords;