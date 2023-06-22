var app = app || angular.module('myApp', []);

/*let btn = document.querySelector('.sitebar .tab-link');
if (btn) {
    btn.click();
}*/

site.showTabs(event, '#main_tabs');

app.controller('navbar', ($scope, $http) => {
  if(site.setting.logo){

    $scope.logo_url = site.setting.logo.url;
  } 
  $scope.register = function () {
    site.showModal('#registerModal');
  };
  $scope.user_id = site.toNumber('##user.id##');
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
});
