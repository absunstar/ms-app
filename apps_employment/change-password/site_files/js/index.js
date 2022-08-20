app.controller('changePassword', function ($scope, $http, $timeout) {
  $scope.user = {};

  $scope.loadUser = function () {
    $scope.user = {};
    $scope.busy = true;

    let id = site.toNumber('##user.id##');
    $http({
      method: 'POST',
      url: '/api/user/view',
      data: { id: id },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.user = response.data.doc;        
   
        } else {
          $scope.user = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.changePassword = function () {
    $scope.busy = true;

    const v = site.validated('#changePasswordModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $http({
      method: 'POST',
      url: '/api/user/change_password',
      data: {
        user: $scope.user,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.busy = false;

          $scope.login(response.data.doc);
        } else if(response.data.error) {
          $scope.error = response.data.error;
          if (response.data.error.like('*Password does not match*')) {
            $scope.error = '##word.password_err_match##';
          } else if (response.data.error.like('*Current Password Error*')) {
            $scope.error = '##word.current_password_incorrect##';
          }
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.login = function (user) {
    $scope.error = '';
    $scope.busy = true;

    $http({
      method: 'POST',
      url: '/api/user/login',
      data: {
        $encript: '123',
        email: site.to123(user.email),
        password: site.to123(user.password),
      },
    }).then(
      function (response) {
        if (response.data.done) {
          window.location.href = "/";
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };
  $scope.loadUser();
});
