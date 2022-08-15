app.controller('jobSeekerSearch', function ($scope, $http, $timeout) {

  $scope.getJobSeekerList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};

    where['profile.type'] = 'job-seeker';
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
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getJobSeekerList();
});
