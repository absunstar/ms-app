app.controller('trainees', function ($scope, $http, $timeout) {
  $scope.trainees = {};

  $scope.displayCreateTrainee = function () {
    $scope.error = '';
    $scope.trainee = {
      id_type: 'national_id',
      active: true,
    };

    site.showModal('#traineeAddModal');
  };

  $scope.createTrainee = function () {
    $scope.error = '';
    const v = site.validated('#traineeAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    if ($scope.trainee) {
      if ($scope.trainee.password === $scope.trainee.retype_password) {
        $scope.trainee.role = $scope.accountsTypeList[4];
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
                _id: response.data.doc._id,
                id: response.data.doc.id,
                first_name: response.data.doc.first_name,
                last_name: response.data.doc.last_name,
                email: response.data.doc.email,
                mobile: response.data.doc.mobile,
                id_number: response.data.doc.id_number,
                approve: true,
              });
              $scope.updateTraining($scope.training);
            } else if (response.data.error) {
              $scope.error = response.data.error;
              if (response.data.error.like('*User Exists*')) {
                $scope.error = '##word.user_already_exists##';
              } else if (response.data.error.like('*Number Id*')) {
                $scope.error = '##word.id_number_exists## ';
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

  $scope.addUploadTrainee = function (user) {
    $scope.error = '';

    user.role = $scope.accountsTypeList[4];
    user.active = true;
    user.id_type = 'national_id';

    if (user.id_number) {
      user.id_number = user.id_number.toString();
    } else {
      $scope.error = '##word.id_number_not_exists##';
      return;
    }

    if (user.mobile) {
      user.mobile = user.mobile.toString();
    }

    user.password = '123456789';
    $scope.busy = true;

    $http({
      method: 'POST',
      url: '/api/user/add',
      data: user,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.doc) {
          user.$add = true;
          $scope.training.trainees_list.push({
            _id: response.data.doc._id,
            id: response.data.doc.id,
            first_name: response.data.doc.first_name,
            last_name: response.data.doc.last_name,
            email: response.data.doc.email,
            mobile: response.data.doc.mobile,
            id_number: response.data.doc.id_number,
            approve: true,
          });
          $scope.updateTraining($scope.training);
        } else if (response.data.error) {
          if (response.data.error.like('*User Exists*')) {
            $http({
              method: 'POST',
              url: '/api/user/view',
              data: {
                email: user.email,
              },
            }).then(function (res) {
              if (res.data.done && res.data.doc) {
                let foundUser = $scope.training.trainees_list.find((_t) => {
                  return _t.email == user.email;
                });

                if (foundUser) {
                  user.$email_exists = true;
                } else {
                  user.$add = true;
                  $scope.training.trainees_list.push({
                    _id: res.data.doc._id,
                    id: res.data.doc.id,
                    first_name: res.data.doc.first_name,
                    last_name: res.data.doc.last_name,
                    email: res.data.doc.email,
                    mobile: res.data.doc.mobile,
                    id_number: res.data.doc.id_number,
                    approve: true,
                  });
                  $scope.updateTraining($scope.training);
                }
              }
            });
          } else if (response.data.error.like('*Number Id*')) {
            user.$id_number_exists = true;
          } else {
            $scope.error = response.data.error;
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.uploadAllTrainees = function (users) {
    $scope.error = '';
    for (let i = 0; i < users.length; i++) {
      $timeout(() => {
        $scope.addUploadTrainee(users[i]);
      }, 2000 * i);
    }
  };

  $scope.getTraineesUpload = function (docs) {
    $scope.error = '';
    $scope.upload_trainees_list = docs;
    site.showModal('#traineesUploadModal');
  };

  $scope.addTraineeToTraining = function () {
    $scope.error = '';

    $scope.busy = true;
    let found_trainee = false;
    if ($scope.training.$trainee_select && $scope.training.$trainee_select.id) {
      $scope.training.trainees_list.forEach((_t) => {
        if (_t.id == $scope.training.$trainee_select.id) {
          found_trainee = true;
        }
      });

      if (found_trainee) {
        $scope.error = '##word.trainee_already_there##';
        return;
      } else {
        $scope.training.trainees_list.push({
          _id: $scope.training.$trainee_select._id,
          id: $scope.training.$trainee_select.id,
          first_name: $scope.training.$trainee_select.first_name,
          last_name: $scope.training.$trainee_select.last_name,
          email: $scope.training.$trainee_select.email,
          mobile: $scope.training.$trainee_select.mobile,
          id_number: $scope.training.$trainee_select.id_number,
          approve: true,
        });
        $scope.error = '##word.added_successfully##';
      }
      $scope.updateTraining($scope.training);
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

  $scope.displayRemoveTraineeModal = function (index) {
    $scope.error = '';
    $scope.training.$index = index;
    site.showModal('#deleteTraineeModal');
  };

  $scope.approveTrainee = function (index) {
    $scope.error = '';
    $scope.training.trainees_list[index].approve = true;

    $scope.updateTraining($scope.training);
  };

  $scope.searchTrainees = function (search, traineesList) {
    $scope.error = '';
    if (traineesList && traineesList.length > 0) {
      traineesList.forEach((_t) => {
        if (!_t.first_name.includes(search) && !_t.last_name.includes(search) && _t.mobile != search && _t.id_number != search) {
          _t.$hide = true;
        } else {
          _t.$hide = false;
        }
      });
    }
  };

  $scope.deleteTrainee = function (index) {
    $scope.error = '';
    $scope.training.trainees_list.splice(index, 1);
    site.hideModal('#deleteTraineeModal');
    $scope.updateTraining($scope.training);
  };

  $scope.getTraineesList = function () {
    $scope.busy = true;
    $scope.error = '';
    /*   if (ev.which !== 13) {
      return;
    } */
    $scope.traineesList = [];
    where = { active: true, 'role.name': 'trainee' };
    $http({
      method: 'POST',
      url: '/api/users/all',
      data: {
        where: where,
        /*         search: $scope.training.$general_search,
         */ select: { id: 1, first_name: 1, last_name: 1, email: 1, mobile: 1, id_number: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.users && response.data.users.length > 0) {
          $scope.traineesList = response.data.users;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getAccountsType = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.accountsTypeList = [];
    $http({
      method: 'POST',
      url: '/api/accounts_type/all',
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.accountsTypeList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getGender = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.genderList = [];
    $http({
      method: 'POST',
      url: '/api/gender/all',
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.genderList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.showPassword = function () {
    $scope.error = '';
    $timeout(() => {
      document.querySelectorAll('.pass input').forEach((p) => {
        p.setAttribute('type', $scope.show_password ? 'text' : 'password');
      });
    }, 100);
  };

  $scope.getTraining();
  $scope.getGender();
  $scope.getAccountsType();
  $scope.getTraineesList();
});
