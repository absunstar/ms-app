app.controller('trainees', function ($scope, $http, $timeout) {
  $scope.trainees = {};

  $scope.displayCreateTrainee = function () {
    $scope.error = '';
    $scope.trainee = {
      id_type: 'national_id',
      triners: [],
      active: true,
    };

    site.showModal('#addtraineeToTrainingModal');
  };

  $scope.createTrainee = function () {
    $scope.error = '';
    const v = site.validated('#traineeAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if ($scope.trainee) {
      if ($scope.trainee.password === $scope.trainee.retype_password) {
        $scope.trainee.role = $scope.accountsTypeList[4];
        $scope.trainee.trainers = [$scope.training.trainer.id];
        $scope.busy = true;

        $http({
          method: 'POST',
          url: '/api/user/add',
          data: $scope.trainee,
        }).then(
          function (response) {
            $scope.busy = false;
            if (response.data.done) {
              site.hideModal('#traineeAddModal');
              site.resetValidated('traineeAddModal');
              $scope.training.trainees_list.push({
                id: response.data.doc.id,
                first_name: response.data.doc.first_name,
                last_name: response.data.doc.last_name,
                email: response.data.doc.email,
                mobile: response.data.doc.mobile,
                id_number: response.data.doc.id_number,
              });
              $scope.updateTraining($scope.training);
            } else if (response.data.error) {
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
      } else {
        $scope.error = '##word.password_err_match##';
      }
    }
  };

  $scope.addTraineeToTraining = function () {
    $scope.error = '';

    $scope.busy = true;
    let found_trainee = false;
    if ($scope.training.$trainee_select && $scope.training.$trainee_select.id) {
      $scope.trainee.trainees_list.forEach((_t) => {
        if (_t.id == $scope.training.$trainee_select.id) {
          found_trainee = true;
        }
      });

      if (found_trainee) {
        $scope.error = '##word.trainee_already_there##';
        return;

      } else {
        $scope.training.trainees_list.push({
          id: $scope.training.$trainee_select.id,
          first_name: $scope.training.$trainee_select.first_name,
          last_name: $scope.training.$trainee_select.last_name,
          email: $scope.training.$trainee_select.email,
          mobile: $scope.training.$trainee_select.mobile,
          id_number: $scope.training.$trainee_select.id_number,
        });
      }

      $http({
        method: 'POST',
        url: '/api/trainings/update',
        data: $scope.training,
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
         
          } else if (response.data.error) {
            $scope.error = response.data.error;
         
          }
        },
        function (err) {
          console.log(err);
        }
      );
    }
  };

  $scope.updateTraining = function (training) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/trainings/update',
      data: training,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
        } else if (response.data.error) {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.getTraining = function () {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/trainings/view',
      data: {
        id: site.toNumber('##query.id##'),
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.training = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.deleteTrainee = function (index) {
    $scope.error = '';
    $scope.training.trainees_list.splice(index, 1);
    $scope.updateTraining($scope.training);
  };

  $scope.getTraineesList = function (ev) {
    $scope.busy = true;
    if (ev.which !== 13) {
      return;
    }
    $scope.training.$traineesList = [];
    where = { active: true, 'role.name': 'trainee' };
    $http({
      method: 'POST',
      url: '/api/users/all',
      data: {
        where: where,
        search: $scope.training.$general_search,
        select: { id: 1, first_name: 1, last_name: 1, email: 1, mobile: 1, id_number: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.users && response.data.users.length > 0) {
          $scope.training.$traineesList = response.data.users;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTraining();
});