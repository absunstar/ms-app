app.controller('job_subfields', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.job_subfields = {};

  $scope.displayAddJobSubFields = function () {
    $scope.error = '';
    $scope.job_subfields = {
      image: '/images/job_subfields.png',
      active: true,
    };

    site.showModal('#jobSubFieldsAddModal');
  };

  $scope.addJobSubFields = function () {
    $scope.error = '';
    const v = site.validated('#jobSubFieldsAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    if ('##query.id##' != 'undefined') {
      $scope.job_subfields.job_field = $scope.job_field;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_subfields/add',
      data: $scope.job_subfields,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobSubFieldsAddModal');
          $scope.getJobSubFieldsList();
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

  $scope.displayUpdateJobSubFields = function (job_subfields) {
    $scope.error = '';
    $scope.viewJobSubFields(job_subfields);
    $scope.job_subfields = {};
    site.showModal('#jobSubFieldsUpdateModal');
  };

  $scope.updateJobSubFields = function (job_subfields) {
    $scope.error = '';
    const v = site.validated('#jobSubFieldsUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_subfields/update',
      data: job_subfields,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobSubFieldsUpdateModal');
          $scope.getJobSubFieldsList();
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

  $scope.updateActivate = function (job_subfields) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_subfields/update',
      data: job_subfields,
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

  $scope.displayDetailsJobSubFields = function (job_subfields) {
    $scope.error = '';
    $scope.viewJobSubFields(job_subfields);
    $scope.job_subfields = {};
    site.showModal('#jobSubFieldsViewModal');
  };

  $scope.viewJobSubFields = function (job_subfields) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/job_subfields/view',
      data: {
        id: job_subfields.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.job_subfields = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteJobSubFields = function (job_subfields) {
    $scope.error = '';
    $scope.viewJobSubFields(job_subfields);
    $scope.job_subfields = {};
    site.showModal('#jobSubFieldsDeleteModal');
  };

  $scope.deleteJobSubFields = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/job_subfields/delete',
      data: {
        id: $scope.job_subfields.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobSubFieldsDeleteModal');
          $scope.getJobSubFieldsList();
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
    $scope.getJobSubFieldsList($scope.search);
    site.hideModal('#jobSubFieldsSearchModal');
    $scope.search = {};
  };

  $scope.getJobSubFieldsList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};
    if ('##query.id##' != 'undefined') {
      where['job_field.id'] = site.toNumber('##query.id##');
    }
    $http({
      method: 'POST',
      url: '/api/job_subfields/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#jobSubFieldsSearchModal');
          $scope.search = {};
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
        select: { id: 1, code: 1, name_ar: 1, name_en: 1, job_field: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.jobFieldsList = response.data.list;
          if ('##query.id##' != 'undefined') {
            $scope.job_field = $scope.jobFieldsList.find((_job_fields) => {
              return _job_fields.id === site.toNumber('##query.id##');
            });
          }
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
        screen: 'job_subfields',
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
    site.showModal('#jobSubFieldsSearchModal');
  };

  $scope.getJobSubFieldsList();
  $scope.getJobFieldsList();
  $scope.getNumberingAuto();
});
