app.controller('reportStatsJobs', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.getReportJobsList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where['approve.id'] = 3;
    $http({
      method: 'POST',
      url: '/api/report_job/all',
      data: {where : where},
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

  $scope.getCompanyList = function () {
    $scope.busy = true;
    $scope.companyList = [];
      where = {};
      where['approve.id'] = 2;
      where['active'] = true;
    

    $http({
      method: 'POST',
      url: '/api/companies/all',
      data: {
        where: where,
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.companyList = response.data.list;
          
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getJobFieldsList = function () {
    $scope.busy = true;
    $scope.jobFieldsList = [];

    $http({
      method: 'POST',
      url: '/api/job_fields/all',
      data: {
        where: { active: true },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.jobFieldsList = response.data.list;
          
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.searchAll = function () {

    if($scope.search && $scope.search.date_from && $scope.search.date_to && new Date($scope.search.date_from) > new Date($scope.search.date_to) ){
      $scope.error = '##word.start_date_cannot_bigger_than_end_date##';
      return;
    };

    $scope.getReportJobsList({...$scope.search});
    site.hideModal('#reportStatsJobModal');
    $scope.search = {};
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#reportStatsJobModal');
  };

  $scope.getReportJobsList({});
  $scope.getJobFieldsList({});
  $scope.getCompanyList({});
});
