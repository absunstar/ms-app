var app = app || angular.module('myApp', []);

/*let btn = document.querySelector('.sitebar .tab-link');
if (btn) {
    btn.click();
}*/

site.showTabs(event, '#main_tabs');

app.controller('navbar', ($scope, $http) => {
  $scope.register = function () {
    site.showModal('#registerModal');
  };

  $scope.login = function () {
    site.showModal('#loginModal');
  };

  $scope.goLogin = function () {
    document.location.href = '/login';
  };
  $scope.goRegister = function () {
    document.location.href = '/register';
  };
  $scope.showBranches = function () {
    site.showModal('#branchesModal');
  };

  /*  $scope.logout = function () {
        site.showModal('#logoutModal');
    };
 */
  $scope.logout = function () {
    $scope.error = '';
    $scope.busy = true;

    $http.post('/api/user/logout').then(
      function (response) {
        if (response.data.done) {
          window.location.href = '/';
        } else {
          $scope.error = response.data.error;
          $scope.busy = false;
        }
      },
      function (error) {
        $scope.busy = false;
        $scope.error = error;
      }
    );
  };

  $scope.changeLang = function (lang) {
    $http({
      method: 'POST',
      url: '/x-language/change',
      data: {
        name: lang,
      },
    }).then(function (response) {
      if (response.data.done) {
        window.location.reload(true);
      }
    });
  };

  $scope.getCompanyList = function () {
    let where = {};
    $scope.busy = true;
    where['active'] = true;
    where['approve.id'] = 1;
    $scope.companiesCount = 0;
    $http({
      method: 'POST',
      url: '/api/companies/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.companiesCount = response.data.list.length;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getJobList = function () {
    let where = {};
    $scope.busy = true;
    $scope.jobsCount = 0;
    where['active'] = true;
    where['approve.id'] = 2;
    $http({
      method: 'POST',
      url: '/api/jobs/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.jobsCount = response.data.list.length;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getCompanyList();
  $scope.getJobList();
});
