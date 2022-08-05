app.controller('training_report', function ($scope, $http,$timeout) {
  $scope.military_state = {};
  site.hideModal('#message');

  $scope.loadMilitariesStatus = function () {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_report/all',
      data: {
        select: { id: 1, name: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.training_report = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.loadAll = function () {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_report/all',
      data: {},
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.displayTrainees = function (c) {
    $scope.course = c;
    $scope.TraineesList = c.Trainees;
    if ($scope.TraineesList && $scope.TraineesList.length > 0) {
      site.showModal('#traineesModal');
    } else {
      site.showModal('#message');

      $timeout(() => {

        site.hideModal('#message');

      }, 1500);
    }
  };

  $scope.add = function () {
    $scope.error = '';
    const v = site.validated('#addTrainingListModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_report/add',
      data: $scope.military_state,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#addTrainingListModal');
          $scope.loadAll();
        } else {
          $scope.error = '##word.error##';
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.edit = function (military_state) {
    $scope.error = '';
    $scope.view(military_state);
    $scope.military_state = {};
    site.showModal('#updateTrainingListModal');
  };
  $scope.update = function () {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_report/update',
      data: $scope.military_state,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#updateTrainingListModal');
          $scope.loadAll();
        } else {
          $scope.error = '##word.error##';
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.remove = function (military_state) {
    $scope.error = '';
    $scope.view(military_state);
    $scope.military_state = {};
    site.showModal('#deleteTrainingListModal');
  };

  $scope.view = function (military_state) {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_report/view',
      data: { id: military_state.id },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.military_state = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };
  $scope.details = function (military_state) {
    $scope.error = '';
    $scope.view(military_state);
    $scope.military_state = {};
    site.showModal('#viewTrainingListModal');
  };
  $scope.delete = function () {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_report/delete',
      data: { id: $scope.military_state.id, name: $scope.military_state.name },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteTrainingListModal');
          $scope.loadAll();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.getTrainingList = function (where) {
    $scope.busy = true;
    $scope.count = 0;
    $http({
      method: 'POST',
      url: '/api/Training/all',
      data: {
        where: where,
        /*
        select: { id: 1, name: 1 } */
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.trainingList = response.data.list;
          $scope.count = $scope.trainingList.length;
        } else {
          $scope.trainingList = [];
          $scope.count = 0;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTrainingTypesList = function (where) {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/TrainingType/all',
      data: {
        where: {
          IsActive: true,
        },
        /*
        select: { id: 1, name: 1 } */
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.trainingTypesList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getEntityPartnerList = function (where) {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/EntityPartner/all',
      data: {
        where: {
          IsActive: true,
        },
        /*
        select: { id: 1, name: 1 } */
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.entityPartnerList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getEntitySubPartnerList = function (where) {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/EntitySubPartner/all',
      data: {
        where: {
          IsActive: true,
        },
        /*
        select: { id: 1, name: 1 } */
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.entitySubPartnerList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTrainingCategoryList = function (where) {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/TrainingCategory/all',
      data: {
        where: {
          IsActive: true,
        },
        /*
        select: { id: 1, name: 1 } */
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.trainingCategoryList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTraininersList = function (where) {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/Trainers/all',
      data: {
        where: {
          IsActive: true,
          Type: 4,
        },
        /*
        select: { id: 1, name: 1 } */
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.trainersList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.loadAll();
  $scope.loadMilitariesStatus();
  $scope.getTrainingTypesList();
  $scope.getTrainingCategoryList();
  $scope.getEntitySubPartnerList();
  $scope.getEntityPartnerList();
  $scope.getTraininersList();
  $scope.getTrainingList({ IsActive: true });
});
