app.controller('jobFairs', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.job_fairs = {};
  $scope.apply = {};

 

  $scope.displayAddJobFairs = function () {
    $scope.error = '';
    $scope.job_fairs = {
      image: '/images/job_fairs.png',
      active: true,
      site : "offline",
      apply_list : []
    };

    site.showModal('#jobFairsAddModal');
  };

  $scope.addJobFairs = function () {
    $scope.error = '';
    const v = site.validated('#jobFairsAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_fairs/add',
      data: $scope.job_fairs,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobFairsAddModal');
          site.resetValidated('#jobFairsAddModal');
          $scope.getJobFairsList();
        } else if(response.data.error){
          $scope.error = response.data.error;
          if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayUpdateJobFairs = function (job_fairs) {
    $scope.error = '';
    $scope.viewJobFairs(job_fairs);
    $scope.job_fairs = {};
    site.showModal('#jobFairsUpdateModal');
  };

  $scope.updateJobFairs = function (job_fairs) {
    $scope.error = '';
    const v = site.validated('#jobFairsUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_fairs/update',
      data: job_fairs,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobFairsUpdateModal');
          site.resetValidated('#jobFairsUpdateModal');
          $scope.getJobFairsList();
        } else if(response.data.error){
          $scope.error = response.data.error;
          if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.showActivationModal = function (element,type) {
    if(type == 'activate'){
      site.showModal('#activateModal');
    } else if(type == 'deactivate'){
      site.showModal('#deactivateModal');
    }
    $scope.element = element;
  };

  $scope.updateActivate = function (element,type) {
    $scope.error = '';
    if(type == 'activate'){
      element.active = true;
    site.hideModal('#activateModal');
    } else if(type == 'deactivate'){
      element.active = false;
    site.hideModal('#deactivateModal');
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/job_fairs/update',
      data: element,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDetailsJobFairs = function (job_fairs) {
    $scope.error = '';
    $scope.viewJobFairs(job_fairs);
    $scope.job_fairs = {};
    site.showModal('#jobFairsViewModal');
  };

  $scope.viewJobFairs = function (job_fairs) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/job_fairs/view',
      data: {
        id: job_fairs.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.job_fairs = response.data.doc;
          $scope.job_fairs_name = response.data.doc.name_ar;
          if('##session.lang##' == 'en'){
          $scope.job_fairs_name = response.data.doc.name_en;
      
          };
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteJobFairs = function (job_fairs) {
    $scope.error = '';
    $scope.viewJobFairs(job_fairs);
    $scope.job_fairs = {};
    site.showModal('#jobFairsDeleteModal');
  };

  $scope.deleteJobFairs = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/job_fairs/delete',
      data: {
        id: $scope.job_fairs.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobFairsDeleteModal');
          $scope.getJobFairsList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.searchAll = function () {
    $scope.getJobFairsList($scope.search);
    site.hideModal('#jobFairsSearchModal');
    $scope.search = {};
  };

  $scope.getJobFairsList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/job_fairs/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#jobFairsSearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getJobSeeker = function () {
    $scope.busy = true;
    $scope.jobSeekerList = [];

    $http({
      method: 'POST',
      url: '/api/users/all',
      data: {
        where: {'role.name' : 'job_seeker'},
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.users && response.data.users.length > 0) {
          $scope.jobSeekerList = response.data.users;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.selectJobSeeker = function (c) {
    $scope.error = '';
    if(c && c.id){
      $scope.apply.name = c.name;
      $scope.apply.email = c.email;
      $scope.apply.job_title = c.job_title;
    }
  };

  $scope.attendance = function (c) {
    $scope.error = '';
    const v = site.validated('#attendanceModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.updateActivate($scope.job_fairs);
    site.hideModal('#attendanceModal');
    site.resetValidated('#attendanceModal');
  };

  $scope.registerApplyJobSeeker = function (c) {
    $scope.error = '';
    $scope.job_fairs = c;
   $scope.found_apply = false;
    $scope.job_fairs.apply_list.forEach(_app => {
      if(_app.id == site.toNumber('##user.id##')){
        $scope.found_apply = true;
      }
    });

    if($scope.found_apply) {
      site.showModal('#registerApplyModal');
    } else if(!$scope.found_apply) {
      $scope.job_fairs.apply_list.push({
        name : '##user.first_name##',
        job_title : '##user.job_title##',
        email : '##user.email##',
        apply_date : new Date(),
        id : site.toNumber('##user.id##'),
      });
      $scope.updateActivate(c);
      site.showModal('#registerApplyModal');
    }

  };

  $scope.registerApply = function (c) {
    $scope.error = '';
    const v = site.validated('#applyModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    if($scope.job_seeker && $scope.job_seeker.id) {
      c.id == $scope.job_seeker.id;
    };

    $scope.job_fairs.apply_list = $scope.job_fairs.apply_list || [];
    $scope.job_fairs.apply_list.push(c);
    $scope.apply = {};
    $scope.updateActivate($scope.job_fairs);
    site.hideModal('#applyModal');
    site.resetValidated('#applyModal');
  };

  $scope.displayAttendance = function (c) {
    $scope.error = '';
    $scope.job_fairs = c;
    if('##user.role.name##' == 'admin'){
      
      site.showModal('#attendanceModal');
    } else if('##user.role.name##' == 'job_seeker') {
      $scope.job_fairs.apply_list = $scope.job_fairs.apply_list || [];
      $scope.job_fairs.apply_list.push(c);
      $scope.apply = {};
      $scope.updateActivate($scope.job_fairs);
    }
  };

  $scope.displayApply = function (c) {
    $scope.error = '';
    $scope.job_fairs = c;

    site.showModal('#applyModal');
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#jobFairsSearchModal');
  };

  $scope.getJobFairsList();
  $scope.getJobSeeker();
});
