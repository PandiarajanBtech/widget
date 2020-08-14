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
