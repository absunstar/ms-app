app.controller('reportStatsJobSeekerPerJob', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.getJobsList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};
    where['approve.id'] = 3;
    where['application_list'] = { $exists: true, $ne: [] };

    $http({
      method: 'POST',
      url: '/api/jobs/all',
      data: { where: where },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.searchAll = function () {

    if ($scope.search && $scope.search.date_from && $scope.search.date_to && new Date($scope.search.date_from) > new Date($scope.search.date_to)) {
      $scope.error = '##word.start_date_cannot_bigger_than_end_date##';
      return;
    };

    $scope.getJobsList({ ...$scope.search });
    site.hideModal('#reportStatsPerJobModal');
    $scope.search = {};
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#reportStatsPerJobModal');
  };

  $scope.getJobsList();
});
