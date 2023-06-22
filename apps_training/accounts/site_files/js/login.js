app.controller('loginEmployment', function ($scope, $http, $timeout) {
  $scope.user = {};
  $scope.loginEmployment = function (ev) {
    if (ev && ev.which !== 13) {
      return;
    }
    $scope.error = '';
    const v = site.validated('#loginEmploymentModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/login',
      data: {
        $encript: '123',
        email: site.to123($scope.user.email),
        password: site.to123($scope.user.password),
      },
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
        
      }
    );
  };
});
