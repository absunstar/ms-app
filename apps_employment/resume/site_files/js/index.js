app.controller('resume', function ($scope, $http, $timeout) {
  $scope.user = {};
  $scope.education = {};
  $scope.profile = {};
  $scope.viewUser = function () {
    $scope.busy = true;

    let data = { id: site.toNumber('##user.id##') };

    if ('##query.id##' != 'undefined' && ('##user.role.name##' == 'employer' || '##user.role.name##' == 'admin')) {
      data = { id: site.toNumber('##query.id##') }
    };

    $http({
      method: "POST",
      url: "/api/user/view",
      data: data,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.user = response.data.doc;

          if ('##query.id##' != 'undefined' && ('##user.role.name##' == 'employer' || '##user.role.name##' == 'admin')) {
            $scope.short = false;
            $scope.user.short_list.forEach(_sh => {
              if(_sh == site.toNumber('##user.id##')){
                $scope.short = true;
              }
            });
          };

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

  $scope.shortList = function (user,type) {
  
    if(type == 'add') {
      user.short_list.push(site.toNumber('##user.id##'));
      $scope.short = true;
    } else if(type == 'remove'){
      for(let i = 0; i < user.short_list.length; i++) {
        if(user.short_list[i] == site.toNumber('##user.id##')) {
          user.short_list.splice(i, 1);
          $scope.short = false;

        }
      }
      site.hideModal('#removeShortModal');
    };
    $scope.update(user);

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

  $scope.getCountryList = function () {
    $scope.busy = true;
    $scope.countryList = [];

    $http({
      method: 'POST',
      url: '/api/countries/all',
      data: {
        where: { active: true },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
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
        select: { id: 1, code: 1, name_ar: 1, name_en: 1 },
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
    $scope.error = '';

    if(type=='edit'){
      profile.experience =  $scope.user.experience;
      profile.age = $scope.user.age;
      profile.languages =  $scope.user.languages;
      profile.qualification = $scope.user.qualification;
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
      $scope.user.experience = profile.experience;
      $scope.user.age = profile.age;
      $scope.user.languages = profile.languages;
      $scope.user.qualification = profile.qualification;
      $scope.update($scope.user);
    }

  };


  $scope.showEducation = function (type,education) {
    $scope.error = '';
    $scope.user.educations_list = $scope.user.educations_list || [];
    site.showModal('#educationModal');
    if(type == 'add'){
      $scope.education = {};
    } else if(type == 'edit'){
      $scope.education = education;
      $scope.education.$edit = true;
    }
  };

  $scope.educationTransaction = function (education,type) {
    $scope.error = '';
    const v = site.validated('#educationModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    };

    if(education.joining_date && education.expiry_date && new Date(education.joining_date) > new Date(education.expiry_date) ){
      $scope.error = '##word.start_date_cannot_bigger_than_end_date##';
      return;
    };


    if(type == 'add'){
      $scope.user.educations_list.push(education);
    }
    site.hideModal('#educationModal');
    site.resetValidated('#educationModal');
    $scope.update($scope.user);
  };

  $scope.showWorkExperience = function (type,work_experience) {
    $scope.error = '';
    $scope.user.work_experience_list = $scope.user.work_experience_list || [];
    site.showModal('#workExperienceModal');
    if(type == 'add'){
      $scope.work_experience = {};
    } else if(type == 'edit'){
      $scope.work_experience = work_experience;
      $scope.work_experience.$edit = true;
    }
  };

  $scope.workExperienceTransaction = function (work_experience,type) {
    $scope.error = '';
    const v = site.validated('#workExperienceModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    if(work_experience.joining_date && work_experience.expiry_date && new Date(work_experience.joining_date) > new Date(work_experience.expiry_date) ){
      $scope.error = '##word.start_date_cannot_bigger_than_end_date##';
      return;
    };

    if(type == 'add'){
      $scope.user.work_experience_list.push(work_experience);
    }
    site.hideModal('#workExperienceModal');
    site.resetValidated('#workExperienceModal');
    $scope.update($scope.user);
  };

  $scope.showCertificate = function (type,certificate) {
    $scope.error = '';
    $scope.user.certificates_list = $scope.user.certificates_list || [];
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
      $scope.user.certificates_list.push(certificate);
    }
    site.hideModal('#certificateModal');
    site.resetValidated('#certificateModal');
    $scope.update($scope.user);
  };

  $scope.showExtraCurricular = function (type,extra_curricular) {
    $scope.error = '';
    $scope.user.extra_curricular_list = $scope.user.extra_curricular_list || [];
    site.showModal('#extraCurricularModal');
    if(type == 'add'){
      $scope.extra_curricular = {};
    } else if(type == 'edit'){
      $scope.extra_curricular = extra_curricular;
      $scope.extra_curricular.$edit = true;
    }
  };

  $scope.extraCurricularTransaction = function (extra_curricular,type) {
    $scope.error = '';
    const v = site.validated('#extraCurricularModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    };

    if(extra_curricular.joining_date && extra_curricular.expiry_date && new Date(extra_curricular.joining_date) > new Date(extra_curricular.expiry_date) ){
      $scope.error = '##word.start_date_cannot_bigger_than_end_date##';
      return;
    };

    if(type == 'add'){
      $scope.user.extra_curricular_list.push(extra_curricular);
    }
    site.hideModal('#extraCurricularModal');
    site.resetValidated('#extraCurricularModal');
    $scope.update($scope.user);
  };


  $scope.viewUser();
  $scope.getGender();
  $scope.getYearsOfExperienceList();
  $scope.getCountryList();
  $scope.getLanguagesList();
  $scope.getQualificationList();
});
