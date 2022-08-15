app.controller('jobSeekerHistory', function ($scope, $http, $timeout) {

  $scope.getJobList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};

    where['approve.id'] = 3 ;
    where['application_list.user_id'] = site.toNumber('##user.id##') ;
    $http({
      method: 'POST',
      url: '/api/job/all',
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
      url: '/api/job/update',
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
      url: '/api/job/view',
      data: {
        id: job.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.job = response.data.doc;
          $scope.favorite = false;
          $scope.applied = true;

          for(let i = 0; i < $scope.job.favorite_list.length; i++) {
            if($scope.job.favorite_list[i] == site.toNumber('##user.id##')) {
              $scope.favorite = true;
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
