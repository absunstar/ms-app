app.controller('companyApproval', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.getCompanyList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where['active'] = true;
    where['approve.id'] = 1;
    $scope.count = 0;
    $http({
      method: 'POST',
      url: '/api/company/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = $scope.list.length;
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
      url: '/api/company/view',
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

  $scope.updateCompany = function (company,type) {
    $scope.error = '';
  
    if(type == 'approve'){
      company.approve = {
        id : 2,
        en : 'Been Approved',
        ar : 'تم الموافقة'
  
      };
  
    } else if(type == 'reject'){
      company.approve = {
        id : 3,
        en : 'Rejected',
        ar : 'تم الرفض'
      };
  
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/company/update',
      data: company,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.getCompanyList({});
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
      url: '/api/industry/all',
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


  $scope.searchAll = function () {
    $scope.getCompanyList($scope.search);
    site.hideModal('#companyApprovalSearchModal');
    $scope.search = {};
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#companyApprovalSearchModal');
  };

  $scope.getCompanyList({});
  $scope.getIndustryList();
  $scope.getCountryList();
});
