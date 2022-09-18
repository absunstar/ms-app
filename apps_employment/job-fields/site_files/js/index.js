app.controller('jobFields', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.job_fields = {};

  $scope.displayAddJobFields = function () {
    $scope.error = '';
    $scope.job_fields = {
      active: true,
    };

    site.showModal('#jobFieldsAddModal');
  };

  $scope.addJobFields = function () {
    $scope.error = '';
    const v = site.validated('#jobFieldsAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
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
          site.resetValidated('#jobFieldsAddModal');
          $scope.getJobFieldsList();
        } else if(response.data.error){
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
      $scope.error = v.messages[0]['##session.lang##'];
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
          site.resetValidated('#jobFieldsUpdateModal');
          $scope.getJobFieldsList();
        } else if(response.data.error){
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

  $scope.showActivationModal = function (element,type) {
    if(type == 'activate'){
      site.showModal('#activateModal');
    } else if(type == 'deactivate'){
      site.showModal('#deactivateModal');
    }
    $scope.element = element;
  };

  $scope.updateActivate = function (element,type) {
    $scope.error = '';
    if(type == 'activate'){
      element.active = true;
    site.hideModal('#activateModal');
    } else if(type == 'deactivate'){
      element.active = false;
    site.hideModal('#deactivateModal');
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_fields/update',
      data: element,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
        } else {
          $scope.error = response.data.error;
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
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/job_fields/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
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

 
  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#jobFieldsSearchModal');
  };

  $scope.getJobFieldsList();
});
