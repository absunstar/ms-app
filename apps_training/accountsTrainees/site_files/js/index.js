app.controller('accounts', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.account = {};

  $scope.displayAddAccount = function () {
    $scope.error = '';
    $scope.account = {
      image: '/images/account.png',
      active: true,
    };

    site.showModal('#accountAddModal');
  };

  $scope.addAccount = function () {
    $scope.error = '';
    const v = site.validated('#accountAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/add',
      data: $scope.account,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#accountAddModal');
          site.reetValidated('#accountAddModal');
          $scope.getAccountList();
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

  $scope.displayUpdateAccount = function (account) {
    $scope.error = '';
    $scope.viewAccount(account);
    $scope.account = {};
    site.showModal('#accountUpdateModal');
  };

  $scope.showActivateModal = function (account) {
    $scope.error = '';
    $scope.account = account;
    site.showModal('#activateModal');
  };

  $scope.showDeactivateModal = function (account) {
    $scope.error = '';
    $scope.account = account;
    site.showModal('#deactivateModal');
  };

  $scope.updateAccount = function (account) {
    $scope.error = '';
    const v = site.validated('#accountUpdateModal');
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
          site.hideModal('#accountUpdateModal');
          site.resetValidated('#accountUpdateModal');
          $scope.getAccountList();
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

  $scope.displayDetailsAccount = function (account) {
    $scope.error = '';
    $scope.viewAccount(account);
    $scope.account = {};
    site.showModal('#accountViewModal');
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
          $scope.account = response.data.doc;
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
    $scope.account = {};
    site.showModal('#accountDeleteModal');
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
          site.hideModal('#accountDeleteModal');
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

  $scope.searchAll = function () {
    $scope.getAccountList($scope.search);
    site.hideModal('#accountSearchModal');
    $scope.search = {};
  };

  $scope.getAccountList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: 'POST',
      url: '/api/users/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;

        if (response.data.done && response.data.users && response.data.users.length > 0) {
          $scope.list = response.data.users;
          $scope.count = response.data.count;
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.addEmployee = function () {
    $scope.error = '';
    const v = site.validated('.employee-form');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if ($scope.user) {
      if ($scope.user.password === $scope.user.retype_password) {
        $scope.user.role = $scope.accountsTypeList[4];
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/user/add',
          data: $scope.user,
        }).then(
          function (response) {
            $scope.busy = false;
            if (response.data.done) {
              site.hideModal('#accountAddModal');
              site.resetValidated('.employee-form');
              $scope.getAccountList();
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
      } else {
        $scope.error = '##word.password_err_match##';
      }
    }
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
    site.showModal('#accountSearchModal');
  };

  $scope.getAccountList();
  $scope.getAccountsType();
  $scope.getGender();
});
