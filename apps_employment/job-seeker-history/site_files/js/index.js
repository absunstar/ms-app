app.controller('jobSeekerHistory', function ($scope, $http, $timeout) {

  $scope.getJobList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    where = where || {};

    where['approve.id'] = 3 ;
    where['application_list.user_id'] = site.toNumber('##user.id##') ;
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
        select: { id: 1,   name_ar: 1, name_en: 1 },
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
        select: { id: 1,   name_ar: 1, name_en: 1 },
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
        select: { id: 1,   name_ar: 1, name_en: 1 },
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
        select: { id: 1,   name_ar: 1, name_en: 1 },
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
        
      }
    );
  };

  $scope.getCountryList = function () {
    $scope.busy = true;
    $scope.countryList = [];

    $http({
      method: 'POST',
      url: '/api/countries/all',
      data: {
        where: { active: true },
        select: { id: 1,   name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.countryList = response.data.list;
          
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.getCityList = function (id) {
    $scope.busy = true;
    $scope.cityList = [];

    $http({
      method: 'POST',
      url: '/api/cities/all',
      data: {
        where: { active: true,'country.id' : id },
        select: { id: 1,   name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.cityList = response.data.list;
          
        }
      },
      function (err) {
        $scope.busy = false;
        
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
        select: { id: 1,   name_ar: 1, name_en: 1 },
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
        
      }
    );
  };

  $scope.getJobSubfieldsList = function (id) {
    $scope.busy = true;
    $scope.jobSubfieldsList = [];

    $http({
      method: 'POST',
      url: '/api/job_subfields/all',
      data: {
        where: { active: true,'job_field.id' : id },
        select: { id: 1,   name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.jobSubfieldsList = response.data.list;
          
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.getJobType = function () {
    $scope.error = "";
    $scope.busy = true;
    $scope.jobTypeList = [];
    $http({
      method: "POST",
      url: "/api/job_type/all",
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.jobTypeList = response.data;
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };


  $scope.searchAll = function () {
    $scope.getJobList($scope.search);
    site.hideModal('#jobSeekerHistorySearchModal');
    $scope.search = {};
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#jobSeekerHistorySearchModal');
  };
 
  $scope.getJobList({});
  $scope.getIndustryList();
  $scope.getQualificationList();
  $scope.getCompanyList();
  $scope.getYearsOfExperienceList();
  $scope.getCountryList();
  $scope.getJobFieldsList();
  $scope.getJobType();
 
});
