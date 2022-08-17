app.controller('employerSearch', function ($scope, $http, $timeout) {
  $scope.search = {};
  $scope.getJobList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    where = where || {};

    where['approve.id'] = 3 ;
    $http({
      method: 'POST',
      url: '/api/jobs/all',
      data: {
        where: where,
        search : true
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

  $scope.getIndustryList = function () {
    $scope.busy = true;
    $scope.industryList = [];

    $http({
      method: 'POST',
      url: '/api/industries/all',
      data: {
        where: { active: true },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.industryList = response.data.list;
          
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getQualificationList = function () {
    $scope.busy = true;
    $scope.qualificationList = [];

    $http({
      method: 'POST',
      url: '/api/qualifications/all',
      data: {
        where: { active: true },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.qualificationList = response.data.list;
          
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getCompanyList = function () {
    $scope.busy = true;
    $scope.companyList = [];
    where = {};
   
    where['approve.id'] = 2;
    where['active'] = true;

    $http({
      method: 'POST',
      url: '/api/companies/all',
      data: {
        where: where,
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.companyList = response.data.list;
          
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getYearsOfExperienceList = function () {
    $scope.busy = true;
    $scope.yearsOfExperienceList = [];

    $http({
      method: 'POST',
      url: '/api/years_of_experience/all',
      data: {
        where: { active: true },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.yearsOfExperienceList = response.data.list;
          
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getJobFieldsList = function () {
    $scope.busy = true;
    $scope.jobFieldsList = [];

    $http({
      method: 'POST',
      url: '/api/job_fields/all',
      data: {
        where: { active: true },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.jobFieldsList = response.data.list;
          
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };


  $scope.getLanguagesList = function () {
    $scope.busy = true;
    $scope.languagesList = [];

    $http({
      method: 'POST',
      url: '/api/languages/all',
      data: {
        where: { active: true },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.languagesList = response.data.list;
          
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.currentLocation = function () {
    if('##session.lang##' == 'ar') {
      if('##user.city.id##' != 'undefined') {
        $scope.search.general_locations = '##user.city.name_ar##'
      } else if('##user.country.id##' != 'undefined') {
        $scope.search.general_locations = '##user.country.name_ar##'
      }
    } else if('##session.lang##' == 'en') {
      if('##user.city.id##' != 'undefined') {
        $scope.search.general_locations = '##user.city.name_en##'
      } else if('##user.country.id##' != 'undefined') {
        $scope.search.general_locations = '##user.country.name_en##'
      }
    }
  $scope.getJobList($scope.search);

  };

  $scope.getJobList({});
  $scope.getIndustryList();
  $scope.getQualificationList();
  $scope.getCompanyList();
  $scope.getYearsOfExperienceList();
  $scope.getJobFieldsList();
  $scope.getLanguagesList();
});

