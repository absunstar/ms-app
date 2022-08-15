app.controller('reportStatsJobs', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.getReportJobsList = function () {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: 'POST',
      url: '/api/report_job/all',
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getReportJobsList();
});
