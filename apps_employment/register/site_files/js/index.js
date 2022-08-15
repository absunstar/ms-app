app.controller('register', function ($scope, $http, $timeout) {
  $scope.user = { image: '/images/user_logo.png' };

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
});
