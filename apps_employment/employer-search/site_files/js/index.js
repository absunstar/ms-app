app.controller('employerSearch', function ($scope, $http, $timeout) {
  $scope.search = {};
  $scope.getJobList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    where = where || {};

    where['approve.id'] = 3;
    $http({
      method: 'POST',
      url: '/api/jobs/all',
      data: {
        where: where,
        search: true,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
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
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
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
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
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
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
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
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
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
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
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
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
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
/*     if ('##session.lang##' == 'ar') {
      if ('##user.city.id##' != 'undefined') {
        $scope.search.general_locations = '##user.city.name_ar##';
      } else if ('##user.country.id##' != 'undefined') {
        $scope.search.general_locations = '##user.country.name_ar##';
      }
    } else if ('##session.lang##' == 'en') {
      if ('##user.city.id##' != 'undefined') {
        $scope.search.general_locations = '##user.city.name_en##';
      } else if ('##user.country.id##' != 'undefined') {
        $scope.search.general_locations = '##user.country.name_en##';
      }
    } */

    if ('##user.city.id##' == 'undefined' && '##user.country.id##' == 'undefined') {
      site.showModal("#alert");
      $timeout(() => {
        site.hideModal("#alert");

      }, 2000);
    } else {
      if ('##user.city.id##' != 'undefined') {
        if ('##session.lang##' == 'ar') {
          $scope.search.general_locations = '##user.city.name_ar##';
        } else if ('##session.lang##' == 'en') {
          $scope.search.general_locations = '##user.city.name_en##';
        }
      } else if ('##user.country.id##' != 'undefined') {
        if ('##session.lang##' == 'ar') {
          $scope.search.general_locations = '##user.country.name_ar##';
        } else if ('##session.lang##' == 'en') {
          $scope.search.general_locations = '##user.country.name_en##';
        }
      }
    }

    $scope.getJobList($scope.search);
  };

  if ((q = document.location.search.split('=')[1])) {
    $scope.getJobList({ general_search: q });
  } else {
    $scope.getJobList({});
  }

  $scope.getIndustryList();
  $scope.getQualificationList();
  $scope.getCompanyList();
  $scope.getYearsOfExperienceList();
  $scope.getJobFieldsList();
  $scope.getLanguagesList();
});
