app.controller('latestTrainings', function ($scope, $http, $timeout) {
  $scope.search = {};

  $scope.getTrainingsList = function (where) {
    where = where || {};
    where['privacy_type.id'] = 1;

    where['latest'] = true;

    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: 'POST',
      url: '/api/trainings/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          response.data.list.forEach((_doc) => {
            if (_doc.trainees_list && _doc.trainees_list.length > 0) {
              _doc.trainees_list.forEach((_t) => {
                if (site.toNumber('##user.id##') == _t.id) {
                  _doc.$is_register = true;
                }
              });
            }
          });

          $scope.list = response.data.list;
          $scope.count = $scope.list.length;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.updateTraining = function (training) {
    $scope.busy = true;

    $scope.training.trainees_list.push({
      id: site.toNumber('##user.id##'),
      first_name: '##user.first_name##',
      last_name: '##user.last_name##',
      email: '##user.email##',
      mobile: '##user.mobile##',
      id_number: '##user.id_number##',
      approve: false,
    });

    $http({
      method: 'POST',
      url: '/api/trainings/update',
      data: training,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#registerTrainingModal');
          $scope.getTrainingsList();
        } else if (response.data.error) {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.getTrainingTypesList = function () {
    $scope.busy = true;
    $scope.trainingTypesList = [];

    $http({
      method: 'POST',
      url: '/api/trainings_types/all',
      data: {
        where: { active: true },
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.trainingTypesList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };
  $scope.showRegisterationModal = function (training) {
    $scope.training = training;
    site.showModal('#registerTrainingModal');
  };

  $scope.getTrainingCategoriesList = function (id) {
    $scope.busy = true;
    $scope.trainingCategoriesList = [];

    $http({
      method: 'POST',
      url: '/api/trainings_categories/all',
      data: {
        where: { active: true, 'training_type.id': id },
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.trainingCategoriesList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTrainingsList({});
  $scope.getTrainingTypesList();
});
