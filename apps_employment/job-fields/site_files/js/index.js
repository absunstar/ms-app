app.controller('job_fields', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.job_fields = {};

  $scope.displayAddJobFields = function () {
    $scope.error = '';
    $scope.job_fields = {
      image_url: '/images/job_fields.png',
      active: true,
    };

    site.showModal('#jobFieldsAddModal');
  };

  $scope.addJobFields = function () {
    $scope.error = '';
    const v = site.validated('#jobFieldsAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_fields/add',
      data: $scope.job_fields,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobFieldsAddModal');
          $scope.getJobFieldsList();
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

  $scope.displayUpdateJobFields = function (job_fields) {
    $scope.error = '';
    $scope.viewJobFields(job_fields);
    $scope.job_fields = {};
    site.showModal('#jobFieldsUpdateModal');
  };

  $scope.updateJobFields = function (job_fields) {
    $scope.error = '';
    const v = site.validated('#jobFieldsUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_fields/update',
      data: job_fields,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobFieldsUpdateModal');
          $scope.getJobFieldsList();
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

   $scope.updateActivate = function (job_fields) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_fields/update',
      data: job_fields,
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
 
  $scope.displayDetailsJobFields = function (job_fields) {
    $scope.error = '';
    $scope.viewJobFields(job_fields);
    $scope.job_fields = {};
    site.showModal('#jobFieldsViewModal');
  };

  $scope.viewJobFields = function (job_fields) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/job_fields/view',
      data: {
        id: job_fields.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.job_fields = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteJobFields = function (job_fields) {
    $scope.error = '';
    $scope.viewJobFields(job_fields);
    $scope.job_fields = {};
    site.showModal('#jobFieldsDeleteModal');
  };

  $scope.deleteJobFields = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/job_fields/delete',
      data: {
        id: $scope.job_fields.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobFieldsDeleteModal');
          $scope.getJobFieldsList();
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
    $scope.getJobFieldsList($scope.search);
    site.hideModal('#jobFieldsSearchModal');
    $scope.search = {};
  };

  $scope.getJobFieldsList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: 'POST',
      url: '/api/job_fields/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#jobFieldsSearchModal');
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
        screen: 'job_fields',
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
    site.showModal('#jobFieldsSearchModal');
  };

  $scope.getJobFieldsList();
  $scope.getNumberingAuto();
});
