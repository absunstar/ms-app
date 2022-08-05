app.controller('job_fairs', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.job_fairs = {};

  $scope.displayAttendance = function (c) {
    $scope.error = '';
    $scope.job_fairs = c;

    site.showModal('#attendanceModal');
  };

  $scope.displayAddJobFairs = function () {
    $scope.error = '';
    $scope.job_fairs = {
      image_url: '/images/job_fairs.png',
      active: true,
    };

    site.showModal('#jobFairsAddModal');
  };

  $scope.addJobFairs = function () {
    $scope.error = '';
    const v = site.validated('#jobFairsAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_fairs/add',
      data: $scope.job_fairs,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobFairsAddModal');
          $scope.getJobFairsList();
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*Must Enter Code*')) {
            $scope.error = '##word.must_enter_code##';
          } else if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayUpdateJobFairs = function (job_fairs) {
    $scope.error = '';
    $scope.viewJobFairs(job_fairs);
    $scope.job_fairs = {};
    site.showModal('#jobFairsUpdateModal');
  };

  $scope.updateJobFairs = function (job_fairs) {
    $scope.error = '';
    const v = site.validated('#jobFairsUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_fairs/update',
      data: job_fairs,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobFairsUpdateModal');
          $scope.getJobFairsList();
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

   $scope.updateActivate = function (job_fairs) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_fairs/update',
      data: job_fairs,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };
 
  $scope.displayDetailsJobFairs = function (job_fairs) {
    $scope.error = '';
    $scope.viewJobFairs(job_fairs);
    $scope.job_fairs = {};
    site.showModal('#jobFairsViewModal');
  };

  $scope.viewJobFairs = function (job_fairs) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/job_fairs/view',
      data: {
        id: job_fairs.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.job_fairs = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteJobFairs = function (job_fairs) {
    $scope.error = '';
    $scope.viewJobFairs(job_fairs);
    $scope.job_fairs = {};
    site.showModal('#jobFairsDeleteModal');
  };

  $scope.deleteJobFairs = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/job_fairs/delete',
      data: {
        id: $scope.job_fairs.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobFairsDeleteModal');
          $scope.getJobFairsList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.searchAll = function () {
    $scope.getJobFairsList($scope.search);
    site.hideModal('#jobFairsSearchModal');
    $scope.search = {};
  };

  $scope.getJobFairsList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: 'POST',
      url: '/api/job_fairs/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#jobFairsSearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getNumberingAuto = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/numbering/get_automatic',
      data: {
        screen: 'job_fairs',
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.disabledCode = response.data.isAuto;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#jobFairsSearchModal');
  };

  $scope.getJobFairsList();
  $scope.getNumberingAuto();
});
