app.controller('reportStats', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.getAccountsList = function (where) {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/report_stats_users/all',
      data: {
        where : where
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

  $scope.getCompanyList = function (where) {
    $scope.companies_count = 0;
    where['approve.id'] = 2;
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/companies/all',
      data: {where:where},
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
    where = where || {};
    where['approve.id'] = 3 ;
    $http({
      method: 'POST',
      url: '/api/jobs/hire',
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

  $scope.searchAll = function () {

    if($scope.search.date_from && $scope.search.date_to && new Date($scope.search.date_from) > new Date($scope.search.date_to) ){
      $scope.error = '##word.start_date_cannot_bigger_than_end_date##';
      return;
    };

    $scope.getAccountsList({...$scope.search});
    $scope.getCompanyList({...$scope.search});
    $scope.getJobList({...$scope.search});
    $scope.search = {};
  };

  $scope.getJobList({});
  $scope.getCompanyList({});
  $scope.getAccountsList({});
});
