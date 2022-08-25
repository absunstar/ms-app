app.controller('shortListedResumes', function ($scope, $http, $timeout) {
  $scope.getJobSeekerList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};

    where['role.name'] = 'job_seeker';
    where['short_list'] = site.toNumber('##user.id##');
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

  $scope.removeShortList = function (user, type) {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/remove_short',
      data: { id: user.id },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.getJobSeekerList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };
  $scope.showResume = function (user) {
    window.open(`/Resume?id=${user.id}`);
  };
  $scope.getJobSeekerList();
});
