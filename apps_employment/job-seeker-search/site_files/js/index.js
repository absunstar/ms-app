app.controller('jobSeekerSearch', function ($scope, $http, $timeout) {

  $scope.getJobSeekerList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    where = where || {};

    where['profile.type'] = 'job-seeker';
    $http({
      method: 'POST',
      url: '/api/users/all',
      data: {
        where: where,
        search : true,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.users && response.data.users.length > 0) {
          $scope.list = response.data.users;
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
      url: '/api/qualification/all',
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
      url: '/api/country/all',
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

  $scope.searchAll = function () {
    $scope.getJobSeekerList($scope.search);
    site.hideModal('#jobSeekerSearchSearchModal');
    $scope.search = {};
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#jobSeekerSearchSearchModal');
  };

  $scope.getJobSeekerList({});
  $scope.getGender();
  $scope.getYearsOfExperienceList();
  $scope.getLanguagesList();
  $scope.getQualificationList();
  $scope.getCountryList();
});
