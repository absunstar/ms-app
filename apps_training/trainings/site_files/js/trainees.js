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
                gender: response.data.doc.gender,
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
    if (user.birthdate) {
      try {
        let arr = user.birthdate.split('/');
        if(arr.length == 3) {

          user.birthdate = new Date(arr[2],arr[1],arr[0],0,0,0);
        }
      } catch (error) {}
    }

    if (user.gender == 'male' || user.gender == 'Male') {
      user.gender = $scope.genderList[0];
    } else if (user.gender == 'female' || user.gender == 'Female') {
      user.gender = $scope.genderList[1];
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
      function (err) {}
    );
  };

  $scope.uploadAllTrainees = function (users) {
    $scope.error = '';
    for (let i = 0; i < users.length; i++) {
      $timeout(() => {
        $scope.addUploadTrainee(users[i]);
      }, 500 * i);
    }
  };

  $scope.getTraineesUpload = function (data) {
    $scope.error = '';
    $scope.upload_trainees_list = data.docs;
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
        $scope.training.$trainee_select = null;
        return;
      } else {
        $scope.training.trainees_list.push({
          _id: $scope.training.$trainee_select._id,
          id: $scope.training.$trainee_select.id,
          first_name: $scope.training.$trainee_select.first_name,
          last_name: $scope.training.$trainee_select.last_name,
          email: $scope.training.$trainee_select.email,
          mobile: $scope.training.$trainee_select.mobile,
          gender: $scope.training.$trainee_select.gender,
          id_number: $scope.training.$trainee_select.id_number,
          approve: true,
        });
        $scope.training.$trainee_select = null;
        $scope.training.$doneAddTrainee = '##word.added_successfully##';
        $timeout(() => {
          $scope.training.$doneAddTrainee = '';
        }, 2000);
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
      function (err) {}
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
      function (err) {}
    );
  };

  $scope.displayRemoveTraineeModal = function (id) {
    $scope.error = '';
    $scope.training.$traineeId = id;
    site.showModal('#deleteTraineeModal');
  };

  $scope.displayApologyTrainee = function (id) {
    $scope.error = '';
    $scope.training.$traineeId = id;
    site.showModal('#apologyTraineeModal');
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
        _t.last_name = _t.last_name || '';
        if (!_t.first_name.includes(search) && !_t.last_name.includes(search) && _t.mobile != search && _t.id_number != search) {
          _t.$hide = true;
        } else {
          _t.$hide = false;
        }
      });
    }
  };

  $scope.apologyTrainee = function () {
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/trainings/apologyTrainee',
      data: {
        id: site.toNumber('##query.id##'),
        traineeId: $scope.training.$traineeId,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#apologyTraineeModal');
          $scope.training = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };

  $scope.deleteTrainee = function () {
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/trainings/deleteTrainee',
      data: {
        id: site.toNumber('##query.id##'),
        traineeId: $scope.training.$traineeId,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#deleteTraineeModal');
          $scope.training = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };

  $scope.getTraineesList = function (_search) {
    $scope.busy = true;
    $scope.error = '';

    $scope.traineesList = [];
    where = { active: true, 'role.name': 'trainee' };

    $http({
      method: 'POST',
      url: '/api/users/all',
      data: {
        where: where,
        search: _search,
        select: { id: 1, first_name: 1, last_name: 1, email: 1, gender: 1, mobile: 1, id_number: 1 },
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
