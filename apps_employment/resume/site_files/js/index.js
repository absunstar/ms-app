app.controller('resume', function ($scope, $http, $timeout) {
  $scope.user = {};
  $scope.education = {};
  $scope.profile = {};
  $scope.viewUser = function () {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/user/view",
      data: { id: site.toNumber('##user.id##') }
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.user = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {

      }
    )
  };

  $scope.update = function (user) {
    $scope.busy = true;
    $http({
      method: "POST",
      url: "/api/user/update",
      data:user
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#profileModal');
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {

      }
    )
  };

  $scope.getYearsOfExperienceListList = function () {
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
        if (response.data.done && response.data.list.length > 0) {
          $scope.yearsOfExperienceList = response.data.list;
          
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
        if (response.data.done && response.data.list.length > 0) {
          $scope.languagesList = response.data.list;
          
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
      url: '/api/qualification/all',
      data: {
        where: { active: true },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.qualificationList = response.data.list;
          
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
      url: '/api/country/all',
      data: {
        where: { active: true },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
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
      url: '/api/city/all',
      data: {
        where: { active: true,'country.id' : id },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.cityList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getGender = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.genderList = [];
    $http({
      method: "POST",
      url: "/api/gender/all"

    }).then(
      function (response) {
        $scope.busy = false;
        $scope.genderList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    )
  };


  $scope.editProfile = function (profile,type) {
    
    if(type=='edit'){
      profile.experience =  $scope.user.profile.experience;
      profile.age = $scope.user.profile.age;
      profile.languages =  $scope.user.profile.languages;
      profile.qualification = $scope.user.profile.qualification;
      profile.$edit_profile = true;
    } else {
      profile.$edit_profile = false;

    }

    if(type=='save'){
      const v = site.validated('#editProfileModal');
      if (!v.ok) {
        $scope.error = v.messages[0].ar;
        return;
      }
      $scope.user.profile.experience = profile.experience;
      $scope.user.profile.age = profile.age;
      $scope.user.profile.languages = profile.languages;
      $scope.user.profile.qualification = profile.qualification;
      $scope.update($scope.user);
    }

  };


  $scope.showEducation = function (type,education) {
    $scope.user.profile.educations_list = $scope.user.profile.educations_list || [];
    site.showModal('#educationModal');
    if(type == 'add'){
      $scope.education = {};
    } else if(type == 'edit'){
      $scope.education = education;
      $scope.education.$edit = true;
    }
  };

  $scope.educationTransaction = function (education,type) {
    const v = site.validated('#educationModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if(type == 'add'){
      $scope.user.profile.educations_list.push(education);
    }
    site.hideModal('#educationModal');
    $scope.update($scope.user);
  };

  $scope.showWorkExperience = function (type,work_experience) {
    $scope.user.profile.work_experience_list = $scope.user.profile.work_experience_list || [];
    site.showModal('#workExperienceModal');
    if(type == 'add'){
      $scope.work_experience = {};
    } else if(type == 'edit'){
      $scope.work_experience = work_experience;
      $scope.work_experience.$edit = true;
    }
  };

  $scope.workExperienceTransaction = function (work_experience,type) {
    const v = site.validated('#workExperienceModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if(type == 'add'){
      $scope.user.profile.work_experience_list.push(work_experience);
    }
    site.hideModal('#workExperienceModal');
    $scope.update($scope.user);
  };

  $scope.showCertificate = function (type,certificate) {
    $scope.user.profile.certificates_list = $scope.user.profile.certificates_list || [];
    site.showModal('#certificateModal');
    if(type == 'add'){
      $scope.certificate = {};
    } else if(type == 'edit'){
      $scope.certificate = certificate;
      $scope.certificate.$edit = true;
    }
  };

  $scope.certificateTransaction = function (certificate,type) {
    const v = site.validated('#certificateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if(type == 'add'){
      $scope.user.profile.certificates_list.push(certificate);
    }
    site.hideModal('#certificateModal');
    $scope.update($scope.user);
  };

  $scope.showExtraCurricular = function (type,extra_curricular) {
    $scope.user.profile.extra_curricular_list = $scope.user.profile.extra_curricular_list || [];
    site.showModal('#extraCurricularModal');
    if(type == 'add'){
      $scope.extra_curricular = {};
    } else if(type == 'edit'){
      $scope.extra_curricular = extra_curricular;
      $scope.extra_curricular.$edit = true;
    }
  };

  $scope.extraCurricularTransaction = function (extra_curricular,type) {
    const v = site.validated('#extraCurricularModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    if(type == 'add'){
      $scope.user.profile.extra_curricular_list.push(extra_curricular);
    }
    site.hideModal('#extraCurricularModal');
    $scope.update($scope.user);
  };


  $scope.viewUser();
  $scope.getGender();
  $scope.getYearsOfExperienceListList();
  $scope.getCountryList();
  $scope.getLanguagesList();
  $scope.getQualificationList();
});
