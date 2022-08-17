app.controller('loginEmployment', function ($scope, $http, $timeout) {
  $scope.user = {};
  $scope.loginEmployment = function () {
    $scope.error = '';
    const v = site.validated('#loginEmploymentModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/login',
      data: $scope.user,
    }).then(
      function (response) {
        if (response.data.error) {
          if (response.data.error.like('*account is inactive*')) {
            $scope.error = '##word.the_account_is_inactive##';
          } else {
            $scope.error = '##word.email_or_pass_error##';
          }
          $scope.busy = false;
        } else if (response.data.done) {
          window.location.href = '/';
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };
  $scope.showPass = function () {
    let x = document.getElementById('pass');
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  };
});
