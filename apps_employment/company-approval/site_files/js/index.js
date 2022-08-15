app.controller('companyApproval', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.getCompanyList = function () {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: 'POST',
      url: '/api/company/all',
      data: {
        where: { active: true,'approve.id' : 1 },
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
          $scope.getCompanyList();
        } else {
          $scope.error = response.data.error;
         
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.getCompanyList();
});
