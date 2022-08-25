app.controller('trainees_accounts', function ($scope, $http, $timeout) {

  $scope.trainee = {};

  $scope.displayAddTrainee = function () {
    $scope.error = '';
    $scope.trainee = {
      id_type: 'national_id',
      triners : [],
      active: true,
    };

    site.showModal('#traineeAddModal');
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
              $scope.getAccountList();
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

  $scope.displayUpdateAccount = function (account) {
    $scope.error = '';
    $scope.viewAccount(account);
    $scope.trainee = {};
    site.showModal('#traineeUpdateModal');
  };

  $scope.showActivateModal = function (account) {
    $scope.error = '';
    $scope.trainee = account;
    site.showModal('#activateModal');
  };

  $scope.showDeactivateModal = function (account) {
    $scope.error = '';
    $scope.trainee = account;
    site.showModal('#deactivateModal');
  };

  $scope.updateAccount = function (account) {
    $scope.error = '';
    const v = site.validated('#traineeUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/update',
      data: account,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#traineeUpdateModal');
          site.resetValidated('#traineeUpdateModal');
          $scope.getAccountList();
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
  };

  $scope.update = function (account, type) {
    $scope.error = '';

    if (type == 'activate') {
      account.active = true;
    } else if (type == 'deactivate') {
      account.active = false;
    } else if (type == 'limit') {
      account.limited_companies = true;
    } else if (type == 'unlimit') {
      account.limited_companies = false;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/update',
      data: account,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          if (type == 'activate') {
            site.hideModal('#activateModal');
          } else if (type == 'deactivate') {
            site.hideModal('#deactivateModal');
          }
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
  };

  $scope.displayDetailsAccount = function (account) {
    $scope.error = '';
    $scope.viewAccount(account);
    $scope.trainee = {};
    site.showModal('#traineeViewModal');
  };

  $scope.viewAccount = function (account) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/user/view',
      data: {
        id: account.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.trainee = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteAccount = function (account) {
    $scope.error = '';
    $scope.viewAccount(account);
    $scope.trainee = {};
    site.showModal('#traineeDeleteModal');
  };

  $scope.deleteAccount = function (account) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/user/delete',
      data: {
        id: account.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#traineeDeleteModal');
          $scope.getAccountList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };



  $scope.getAccountList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    where = where || {};
    where['role.name'] = 'trainee';

    $http({
      method: 'POST',
      url: '/api/users/all',
      data: {
        where: where,
        search: $scope.general_search,
      },
    }).then(
      function (response) {
        $scope.busy = false;

        if (response.data.done && response.data.users && response.data.users.length > 0) {
          $scope.list = response.data.users;
          $scope.count = response.data.count;
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

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#traineeSearchModal');
  };

  $scope.getAccountList();
  $scope.getAccountsType();
  $scope.getGender();
});
