app.controller('register', function ($scope, $http, $timeout) {
/*   $scope.user = { image: '/images/user_logo.png' };
 */
  $scope.addEmployer = function (employer) {
    $scope.error = '';
    const v = site.validated('.employer-form');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    if (employer) {
      if (employer.password === employer.retype_password) {
        employer.role = $scope.accountsTypeList[1];
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/register',
          data: employer,
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
  $scope.addJobSeeker = function (job_seeker) {
    $scope.error = '';
    const v = site.validated('.job-seeker-form');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    if (job_seeker) {
      if (job_seeker.password === job_seeker.retype_password) {
        job_seeker.role = $scope.accountsTypeList[2];
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/register',
          data: job_seeker,
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
  
  $scope.showPassword = function () {
    $timeout(() => {
      document.querySelectorAll('.pass input').forEach((p) => {
        p.setAttribute('type', $scope.show_password ? 'text' : 'password');
      });
    }, 100);
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
