app.controller('reportStats', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.getAccountsList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: 'POST',
      url: '/api/report_stats_users/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.users && response.data.users.length > 0) {
          $scope.job_seeker_count = response.data.job_seeker_count;
          $scope.male_count = response.data.male_count;
          $scope.female_count = response.data.female_count;
          $scope.undefined_gender_count = response.data.undefined_gender_count;
        }
      
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getCompanyList = function () {
    $scope.busy = true;
    $scope.companies_count = 0;
    $http({
      method: 'POST',
      url: '/api/company/all',
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.companies_count = response.data.list.length;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getJobList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};
    where['approve.id'] = 3 ;
    $http({
      method: 'POST',
      url: '/api/job/hire',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.hired_job_seeker_count = response.data.hired_job_seeker_count;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };
  $scope.getJobList();
  $scope.getCompanyList();
  $scope.getAccountsList();
});
