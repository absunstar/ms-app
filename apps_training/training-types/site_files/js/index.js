app.controller('trainingTypes', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.training_type = {};



  $scope.displayAddTrainingTypes = function () {
    $scope.error = '';
    $scope.training_type = {
      image: '/images/training_type.png',
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
      data: $scope.training_type,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingTypesAddModal');
          site.resetValidated('#trainingTypesAddModal');
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

  $scope.displayUpdateTrainingTypes = function (training_type) {
    $scope.error = '';
    $scope.viewTrainingTypes(training_type);
    $scope.training_type = {};
    site.showModal('#trainingTypesUpdateModal');
  };

  $scope.updateTrainingTypes = function (training_type) {
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
      data: training_type,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingTypesUpdateModal');
          site.resetValidated('#trainingTypesUpdateModal');
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
      url: '/api/training_types/update',
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
 
  $scope.displayDetailsTrainingTypes = function (training_type) {
    $scope.error = '';
    $scope.viewTrainingTypes(training_type);
    $scope.training_type = {};
    site.showModal('#trainingTypesViewModal');
  };

  $scope.viewTrainingTypes = function (training_type) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/training_types/view',
      data: {
        id: training_type.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.training_type = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteTrainingTypes = function (training_type) {
    $scope.error = '';
    $scope.viewTrainingTypes(training_type);
    $scope.training_type = {};
    site.showModal('#trainingTypesDeleteModal');
  };

  $scope.deleteTrainingTypes = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/training_types/delete',
      data: {
        id: $scope.training_type.id,
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
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/training_types/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
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

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#trainingTypesSearchModal');
  };

  $scope.getTrainingTypesList();
});
