app.controller('jobsApproval', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.getJobList = function (where) {
    where = where || {};
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    where['active'] = true;
    where['approve.id'] = 2;
    $http({
      method: 'POST',
      url: '/api/jobs/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = $scope.list.length;
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.updateJob = function (job, type) {
    $scope.error = '';

    if (type == 'approve') {
      job.approve = {
        id: 3,
        en: 'Been Approved',
        ar: 'معتمد',
      };
    } else if (type == 'reject') {
      job.approve = {
        id: 4,
        en: 'Rejected',
        ar: 'مرفوض',
      };
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/jobs/update',
      data: job,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.getJobList({});
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
       
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
        select: { id: 1,   name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.jobFieldsList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.getJobSubfieldsList = function (id) {
    $scope.busy = true;
    $scope.jobSubfieldsList = [];

    $http({
      method: 'POST',
      url: '/api/job_subfields/all',
      data: {
        where: { active: true, 'job_field.id': id },
        select: { id: 1,   name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.jobSubfieldsList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.getCompanyList = function () {
    $scope.busy = true;
    $scope.companyList = [];
    where = {};

    where['active'] = true;
    where['approve.id'] = 2;

    $http({
      method: 'POST',
      url: '/api/companies/all',
      data: {
        where: where,
        select: { id: 1,   name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.companyList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.getIndustryList = function () {
    $scope.busy = true;
    $scope.industryList = [];

    $http({
      method: 'POST',
      url: '/api/industries/all',
      data: {
        where: { active: true },
        select: { id: 1,   name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.industryList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.searchAll = function () {
    $scope.getJobList($scope.search);
    site.hideModal('#jobApprovalSearchModal');
    $scope.search = {};
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#jobApprovalSearchModal');
  };

  $scope.getJobList({});
  $scope.getJobFieldsList();
  $scope.getCompanyList();
  $scope.getIndustryList();
});
