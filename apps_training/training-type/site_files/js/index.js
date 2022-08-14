app.controller('training_types', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.training_types = {};

  $scope.displayAttendance = function (c) {
    $scope.error = '';
    $scope.training_types = c;

    site.showModal('#attendanceModal');
  };

  $scope.displayAddTrainingTypes = function () {
    $scope.error = '';
    $scope.training_types = {
      image: '/images/training_types.png',
      active: true,
    };

    site.showModal('#trainingTypesAddModal');
  };

  $scope.addTrainingTypes = function () {
    $scope.error = '';
    const v = site.validated('#trainingTypesAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_types/add',
      data: $scope.training_types,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingTypesAddModal');
          $scope.getTrainingTypesList();
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

  $scope.displayUpdateTrainingTypes = function (training_types) {
    $scope.error = '';
    $scope.viewTrainingTypes(training_types);
    $scope.training_types = {};
    site.showModal('#trainingTypesUpdateModal');
  };

  $scope.updateTrainingTypes = function (training_types) {
    $scope.error = '';
    const v = site.validated('#trainingTypesUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_types/update',
      data: training_types,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingTypesUpdateModal');
          $scope.getTrainingTypesList();
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

   $scope.updateActivate = function (training_types) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_types/update',
      data: training_types,
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
 
  $scope.displayDetailsTrainingTypes = function (training_types) {
    $scope.error = '';
    $scope.viewTrainingTypes(training_types);
    $scope.training_types = {};
    site.showModal('#trainingTypesViewModal');
  };

  $scope.viewTrainingTypes = function (training_types) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/training_types/view',
      data: {
        id: training_types.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.training_types = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteTrainingTypes = function (training_types) {
    $scope.error = '';
    $scope.viewTrainingTypes(training_types);
    $scope.training_types = {};
    site.showModal('#trainingTypesDeleteModal');
  };

  $scope.deleteTrainingTypes = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/training_types/delete',
      data: {
        id: $scope.training_types.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingTypesDeleteModal');
          $scope.getTrainingTypesList();
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
    $scope.getTrainingTypesList($scope.search);
    site.hideModal('#trainingTypesSearchModal');
    $scope.search = {};
  };

  $scope.getTrainingTypesList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: 'POST',
      url: '/api/training_types/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#trainingTypesSearchModal');
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
        screen: 'training_types',
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
    site.showModal('#trainingTypesSearchModal');
  };

  $scope.getTrainingTypesList();
  $scope.getNumberingAuto();
});
