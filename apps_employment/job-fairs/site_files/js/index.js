app.controller('jobFairs', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.job_fairs = {};

  $scope.displayAddJobFairs = function () {
    $scope.error = '';
    $scope.job_fairs = {
      active: true,
      site: 'offline',
      apply_list: [],
    };

    site.showModal('#jobFairsAddModal');
  };

  $scope.addJobFairs = function () {
    $scope.error = '';
    const v = site.validated('#jobFairsAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
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
        } else if (response.data.error) {
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
      $scope.error = v.messages[0]['##session.lang##'];
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
        } else if (response.data.error) {
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

  $scope.showActivationModal = function (element, type) {
    if (type == 'activate') {
      site.showModal('#activateModal');
    } else if (type == 'deactivate') {
      site.showModal('#deactivateModal');
    }
    $scope.element = element;
  };

  $scope.updateActivate = function (element, type) {
    $scope.error = '';
    if (type == 'activate') {
      element.active = true;
      site.hideModal('#activateModal');
    } else if (type == 'deactivate') {
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
          if ('##session.lang##' == 'en') {
            $scope.job_fairs_name = response.data.doc.name_en;
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
    where = where || {};

    $http({
      method: 'POST',
      url: '/api/job_fairs/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
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
        where: { 'role.name': 'job_seeker', active: true },
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

  $scope.selectJobSeeker = function (apply) {
    $scope.error = '';
    if (apply.job_seeker && apply.job_seeker.id) {
      apply.first_name = apply.job_seeker.first_name;
      apply.email = apply.job_seeker.email;
      apply.job_title = apply.job_seeker.job_title;
      apply.id = apply.job_seeker.id;
    }
  };

  $scope.attendance = function (job_fairs) {
    $scope.error = '';
    const v = site.validated('#attendanceModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $http({
      method: 'POST',
      url: '/api/job_fairs/attendance',
      data: {
        id: job_fairs.id,
        attendance_code: job_fairs.$attendance_code,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.job_fairs = response.data.doc;
          $scope.getJobFairsList();
          site.hideModal('#attendanceModal');
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*Invalid Attend')) {
            $scope.error = '##word.invalid_attendance_code##';
          } else if (response.data.error.like('*Attendance to this Job Fair before')) {
            $scope.error = '##word.attendance_this_job_fair_before##';
          }
        }
        site.resetValidated('#attendanceModal');
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.registerApplyJobSeeker = function (jF) {
    $scope.error = '';
    jF.$type = 'job_seeker';
    $http({
      method: 'POST',
      url: '/api/job_fairs/apply',
      data: jF,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.job_fairs = jF;
          $scope.job_fairs.$found_apply = response.data.found_apply;
          site.showModal('#registerApplyModal');
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.registerApply = function (jF) {
    $scope.error = '';
    const v = site.validated('#applyModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    jF.$type = 'admin';
    $http({
      method: 'POST',
      url: '/api/job_fairs/apply',
      data: jF,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#applyModal');
          $scope.getJobFairsList();
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*registered to this Job Fair before*')) {
            $scope.error = '##word.you_registered_this_job_fair_before##';
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayAttendance = function (c) {
    $scope.error = '';
    $scope.job_fairs = c;
    site.showModal('#attendanceModal');
  };

  $scope.displayApply = function (c) {
    $scope.error = '';
    $scope.job_fairs = c;
    $scope.job_fairs.$apply = {
      apply_date: new Date(),
    };
    site.showModal('#applyModal');
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#jobFairsSearchModal');
  };

  $scope.printApplyList = function (job_fair) {
    $scope.error = '';
    $scope.job_fairs = job_fair;
    $timeout(() => {
      export_to_xlsx('a1', 'job_fairs.xlsx');
   
   }, 500);
  };

  $scope.getJobFairsList();
  $scope.getJobSeeker();
});
