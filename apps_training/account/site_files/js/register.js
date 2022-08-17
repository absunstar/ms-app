app.controller('register', function ($scope, $http, $timeout) {
  $scope.user = { image: '/images/user_logo.png' };

  $scope.addTrainee = function () {
    $scope.error = '';
    const v = site.validated('.trainee-form');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if ($scope.user) {
      if ($scope.user.password === $scope.user.retype_password) {
        $scope.user.role = $scope.accountsTypeList[1];
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/register',
          data: $scope.user,
        }).then(
          function (response) {
            if (response.data.error) {
              $scope.error = response.data.error;
              $scope.busy = false;
            }
            if (response.data.user) {
              window.location.href = '/';
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

  $scope.addTrainer = function () {
    $scope.error = '';
    const v = site.validated('.trainer-form');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if ($scope.user) {
      if ($scope.user.password === $scope.user.retype_password) {
        $scope.user.role = $scope.accountsTypeList[2];
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/register',
          data: $scope.user,
        }).then(
          function (response) {
            if (response.data.error) {
              $scope.error = response.data.error;
              $scope.busy = false;
            }
            if (response.data.user) {
              window.location.href = '/';
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

  $scope.addTrainingCenter = function () {
    $scope.error = '';
    const v = site.validated('.training-center-form');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if ($scope.user) {
      if ($scope.user.password === $scope.user.retype_password) {
        $scope.user.role = $scope.accountsTypeList[3];
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/register',
          data: $scope.user,
        }).then(
          function (response) {
            if (response.data.error) {
              $scope.error = response.data.error;
              $scope.busy = false;
            }
            if (response.data.user) {
              window.location.href = '/';
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

  $scope.showPass = function () {
    document.querySelectorAll('.pass input').forEach((p) => {
      p.setAttribute('type', !$scope.show_password ? 'text' : 'password');
    });
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

  $scope.getAccountsType();

});
