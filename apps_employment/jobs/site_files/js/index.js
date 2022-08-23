app.controller('jobs', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.job = {};

  $scope.displayAddJob = function () {
    $scope.error = '';
    $scope.job = {
      image: '/images/job.png',
      active: true,
      favorite_list : [],
      application_list : []
    };

    site.showModal('#jobAddModal');
  };

  if ('##query.post##' == 'true') {
    $scope.displayAddJob();
  }


  $scope.addJob = function (type) {
    $scope.error = '';
    const v = site.validated('#jobAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    if(type== 'add'){
      $scope.job.approve = {
        id : 1,
        en: "Draft",
        ar: "مسودة"
      };
  
    } else if(type== 'publish') {
      $scope.job.approve = {
        id : 2,
        en: "Published",
        ar: "منشور"
      };
    };

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/jobs/add',
      data: $scope.job,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobAddModal');
          site.resetValidated('#jobAddModal');
          $scope.getJobList();
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

  $scope.displayUpdateJob = function (job) {
    $scope.error = '';
    $scope.viewJob(job);
    $scope.job = {};
    site.showModal('#jobUpdateModal');
  };

  $scope.updateJob = function (job,type) {
    $scope.error = '';
    const v = site.validated('#jobUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    if(type== 'add'){
      job.approve = {
        id : 1,
        en: "Draft",
        ar: "مسودة"
      };
  
    } else if(type== 'publish') {
      job.approve = {
        id : 2,
        en: "Published",
        ar: "منشور"
      };
    };
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/jobs/update',
      data: job,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobUpdateModal');
          site.resetValidated('#jobUpdateModal');
          $scope.getJobList();
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
      url: '/api/jobs/update',
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

 
  $scope.displayDetailsJob = function (job) {
    $scope.error = '';
    $scope.viewJob(job);
    $scope.job = {};
    site.showModal('#jobViewModal');
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
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteJob = function (job) {
    $scope.error = '';
    $scope.viewJob(job);
    $scope.job = {};
    site.showModal('#jobDeleteModal');
  };

  $scope.deleteJob = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/jobs/delete',
      data: {
        id: $scope.job.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#jobDeleteModal');
          $scope.getJobList();
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
    $scope.getJobList($scope.search);
    site.hideModal('#jobSearchModal');
    $scope.search = {};
  };

  $scope.getJobList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $scope.open_jobs = 0;
    $scope.applications = 0;
    where = where || {};
    if('##user.role.name##' == 'employer') {
      where['add_user_info.id'] = site.toNumber('##user.id##') ;
    }
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
          $scope.open_jobs = response.data.open_jobs;
          $scope.applications = response.data.applications;
          
          $scope.count = response.data.count;
          site.hideModal('#jobSearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.viewCompany = function (company) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/companies/view',
      data: {
        id: company.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.company = response.data.doc;
          site.showModal('#companyViewModal');

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
        $scope.error = err;
      }
    );
  };


  $scope.getCompanyList = function () {
    $scope.busy = true;
    $scope.companyList = [];
    where = {};
    if('##user.role.name##' == 'employer'){
      where['add_user_info.id'] = site.toNumber('##user.id##');
      where['approve.id'] = 2;
      where['active'] = true;
    }

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
        $scope.error = err;
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
        $scope.error = err;
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
        $scope.error = err;
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
        $scope.error = err;
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
        $scope.error = err;
      }
    );
  };

  $scope.getJobStatus = function () {
    $scope.error = "";
    $scope.busy = true;
    $scope.jobStatusList = [];
    $http({
      method: "POST",
      url: "/api/job_status/all",
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.jobStatusList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

 

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#jobSearchModal');
  };

  $scope.getJobList();
  $scope.getJobType();
  $scope.getJobStatus();
  $scope.getCompanyList();
  $scope.getIndustryList();
  $scope.getQualificationList();
  $scope.getCountryList();
  $scope.getYearsOfExperienceList();
  $scope.getJobFieldsList();
});
