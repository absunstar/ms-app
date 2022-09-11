app.controller('viewJob', function ($scope, $http, $timeout) {

  $scope.job = {};

  $scope.viewJob = function () {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/jobs/view',
      data: {
        id:site.toNumber('##query.id##'),
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.job = response.data.doc;
          for (let i = 0; i < $scope.job.favorite_list.length; i++) {
            if ($scope.job.favorite_list[i] == site.toNumber('##user.id##')) {
              $scope.favorite = true;
            }
          }
          for (let i = 0; i < $scope.job.application_list.length; i++) {
            if ($scope.job.application_list[i].user_id == site.toNumber('##user.id##')) {
              $scope.applied = true;
            }
          }
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.applyAccept = function (job) {
    const v = site.validated('#applyModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    job.application_list.push({
      user_id: site.toNumber('##user.id##'),
      date: new Date(),
      message: $scope.message,
    });

    $scope.updateJob(job);

    $scope.applied = true;
    site.hideModal('#applyModal');
    site.resetValidated('#applyModal');
  };

  $scope.favoriteTransaction = function (job, type) {
    if (type == 'add') {
      job.favorite_list.push(site.toNumber('##user.id##'));
    } else if (type == 'remove') {
      for (let i = 0; i < job.favorite_list.length; i++) {
        if (job.favorite_list[i] == site.toNumber('##user.id##')) {
          job.favorite_list.splice(i, 1);
        }
      }
    }
    $scope.updateJob(job);
  };

  $scope.updateJob = function (job) {
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/jobs/update',
      data: job,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.favorite = false;
          for (let i = 0; i < job.favorite_list.length; i++) {
            if (job.favorite_list[i] == site.toNumber('##user.id##')) {
              $scope.favorite = true;
            }
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };
  
  $scope.viewJob();
});
