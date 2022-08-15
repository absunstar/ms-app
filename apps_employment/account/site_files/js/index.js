app.controller('account', function ($scope, $http, $timeout) {
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
          $scope.getAccountList();
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
          $scope.getAccountList();
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

   $scope.update = function (account,type) {
    $scope.error = '';

    if(type == 'activate'){
      account.active = true;
    } else if(type == 'deactivate'){
      account.active = false;
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
          site.hideModal('#activateModal');
          site.hideModal('#deactivateModal');
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

  $scope.deleteAccount = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/user/delete',
      data: {
        id: $scope.account.id,
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

  $scope.registerAsAdmin = function () {
    $scope.error = '';
    const v = site.validated('.admin-form');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if ($scope.user) {
      if ($scope.user.password === $scope.user.re_password) {
        $scope.user.type = 'admin';
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/register',
          data: {
            $encript: '123',
            email: site.to123($scope.user.email),
            password: site.to123($scope.user.password),
            first_name: $scope.user.first_name,
            last_name: $scope.user.last_name,
            type: $scope.user.type,
          },
        }).then(
          function (response) {
            if (response.data.error) {
              $scope.error = response.data.error;
              $scope.busy = false;
            }
            if (response.data.user) {
              site.hideModal('#accountAddModal');
            }
          },
          function (err) {
            $scope.busy = false;
            $scope.error = err;
          }
        );
      } else {
        $scope.error = '##word.password_err_match##';
      }
    }
  };

  $scope.registerAsEmployer = function () {
    $scope.error = '';
    const v = site.validated('.employer-form');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if ($scope.user) {
      if ($scope.user.password === $scope.user.re_password) {
        $scope.user.type = 'employer';
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/register',
          data: {
            $encript: '123',
            email: site.to123($scope.user.email),
            password: site.to123($scope.user.password),
            first_name: $scope.user.first_name,
            last_name: $scope.user.last_name,
            type: $scope.user.type,
          },
        }).then(
          function (response) {
            if (response.data.error) {
              $scope.error = response.data.error;
              $scope.busy = false;
            }
            if (response.data.user) {
              site.hideModal('#accountAddModal');

            }
          },
          function (err) {
            $scope.busy = false;
            $scope.error = err;
          }
        );
      } else {
        $scope.error = '##word.password_err_match##';
      }
    }
  };
  $scope.registerAsJobSeeker = function () {
    $scope.error = '';
    const v = site.validated('.job-seeker-form');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if ($scope.user) {
      if ($scope.user.password === $scope.user.re_password) {
        $scope.user.type = 'job-seeker';
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/register',
          data: {
            $encript: '123',
            email: site.to123($scope.user.email),
            password: site.to123($scope.user.password),
            first_name: $scope.user.first_name,
            last_name: $scope.user.last_name,
            type: $scope.user.type,
          },
        }).then(
          function (response) {
            if (response.data.error) {
              $scope.error = response.data.error;
              $scope.busy = false;
            }
            if (response.data.user) {
              site.hideModal('#accountAddModal');

            }
          },
          function (err) {
            $scope.busy = false;
            $scope.error = err;
          }
        );
      } else {
        $scope.error = '##word.password_err_match##';
      }
    }
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#accountSearchModal');
  };

  $scope.getAccountList();
});
