app.controller('viewCompany', function ($scope, $http, $timeout) {
  $scope.company = {};

  $scope.viewCompany = function () {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/companies/view',
      data: {
        id: site.toNumber('##query.id##'),
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.company = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
       
      }
    );
  };

  $scope.getJobList = function () {
    $scope.busy = true;
    $scope.jopsList = [];

    $http({
      method: 'POST',
      url: '/api/jobs/all',
      data: {
        where: {
          'company.id': site.toNumber('##query.id##'),
        },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.jopsList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.viewJob = function (id) {
    window.open(`/ViewJob?id=${id}`);
  };

  $scope.viewCompany();
  $scope.getJobList();
});
