app.controller('jobSeekerFavorite', function ($scope, $http, $timeout) {

  $scope.getJobList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    where = where || {};

    where['approve.id'] = 3 ;
    where['favorite_list'] = site.toNumber('##user.id##');
    $http({
      method: 'POST',
      url: '/api/jobs/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.viewApply = function () {

    site.showModal('#applyModal');
  };

  $scope.applyAccept = function (job) {

    const v = site.validated('#applyModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    job.application_list.push({
      user_id :site.toNumber('##user.id##'),
      date : new Date(),
      message : $scope.message
    });

    $scope.updateJob(job);

    $scope.applied = true;
    site.hideModal('#applyModal');
    site.resetValidated('#applyModal');
  };

  $scope.favoriteTransaction = function (job,type) {
    if(type == 'add'){
      job.favorite_list.push(site.toNumber('##user.id##'));

    } else if(type == 'remove') {
      for(let i = 0; i < job.favorite_list.length; i++) {
        if(job.favorite_list[i] == site.toNumber('##user.id##')) {
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
          for(let i = 0; i < job.favorite_list.length; i++) {
            if(job.favorite_list[i] == site.toNumber('##user.id##')) {

              $scope.favorite = true;
            }
          }
          $scope.getJobList();
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };


  $scope.viewJob = function (job) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/jobs/view',
      data: {
        id: job.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.job = response.data.doc;
          $scope.favorite = false;
          $scope.applied = false;
        
          for(let i = 0; i < $scope.job.favorite_list.length; i++) {
            if($scope.job.favorite_list[i] == site.toNumber('##user.id##')) {
              $scope.favorite = true;
            }
          }
          for(let i = 0; i < $scope.job.application_list.length; i++) {
            if($scope.job.application_list[i].user_id == site.toNumber('##user.id##')) {
              $scope.applied = true;
            }
          }
          site.showModal('#jobViewModal');
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };
 
  $scope.getJobList();
});
