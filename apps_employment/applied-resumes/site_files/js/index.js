app.controller('appliedResumes', function ($scope, $http, $timeout) {

  $scope.viewJob = function () {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/jobs/view',
      data: {
        id: site.toNumber('##query.id##'),
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.job = response.data.doc;
          $scope.getJobSeekerList($scope.job , {});
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
       
      }
    );
  };

  $scope.viewUnhireModal = function (user) {
    $scope.user = user;
    site.showModal('#unhireModal');
  };

  $scope.hireJob = function (user,type) {
    $scope.busy = true;

    if(type == 'add') {
    
      
      for (let i = 0; i < $scope.job.application_list.length; i++) {
        let element = $scope.job.application_list[i];

        if(element.user_id == user.id){
          element.hire = true;
          user.$hire = true;
        }
        
      }

    } else if(type == 'remove') {

      for (let i = 0; i < $scope.job.application_list.length; i++) {
        let element = $scope.job.application_list[i];

        if(element.user_id == user.id){
          element.hire = false;
          user.$hire = false;
        }
      }
      site.hideModal('#unhireModal');
    }

    $http({
      method: 'POST',
      url: '/api/jobs/update',
      data: $scope.job,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
       
      }
    );

  };

  $scope.getJobSeekerList = function (job , where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};
    let id_list = [];
    
    for (let i = 0; i < job.application_list.length; i++) {
      let element = job.application_list[i];
      id_list.push(element.user_id);
    }

    where['role.name'] = 'job_seeker';
    where['id'] = { $in: id_list};

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
         for (let i = 0; i < $scope.list.length; i++) {
          let user = $scope.list[i];
          user.$hire = false;
          $scope.job.application_list.forEach(_ap => {
            if(_ap.user_id == user.id && _ap.hire) {
              user.$hire = true;
            };
          });
        
         };
        };
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#appliedResumeModal');
  };

  $scope.searchAll = function () {
    $scope.getJobSeekerList($scope.job , $scope.search);
    site.hideModal('#appliedResumeModal');
    $scope.search = {};
  };

  $scope.viewJob();
});
