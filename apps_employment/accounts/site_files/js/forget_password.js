app.controller('forgetPassword', function ($scope, $http, $timeout) {
  $scope.user = {};

  $scope.forgetPassword = function (user) {
    user.$sendForgetPassWordLink = true;
    $scope.error = '';
    const v = site.validated('#forgetPasswordModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/send-forget-password-link',
      data: user,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.doneSend = '##word.link_sent_your_email##';

        } else if (response.data.error) {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.changePassword = function (user) {
    $scope.error = '';
    const v = site.validated('#changePasswordModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    user.code = '##data.code##';
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/new-password',
      data: user,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          document.location.href = '/login'
        } else if (response.data.error) {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };
});
