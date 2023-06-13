app.controller('industry', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.industry = {};

  $scope.displayAddIndustry = function () {
    $scope.error = '';
    $scope.industry = {
      active: true,
    };

    site.showModal('#industryAddModal');
  };

  $scope.addIndustry = function () {
    $scope.error = '';
    const v = site.validated('#industryAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/industries/add',
      data: $scope.industry,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#industryAddModal');
          site.resetValidated('#industryAddModal');
          $scope.getIndustryList();
        } else if(response.data.error){
          $scope.error = response.data.error;
          if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          }
        }
      },
      function (err) {
       
      }
    );
  };

  $scope.displayUpdateIndustry = function (industry) {
    $scope.error = '';
    $scope.viewIndustry(industry);
    $scope.industry = {};
    site.showModal('#industryUpdateModal');
  };

  $scope.updateIndustry = function (industry) {
    $scope.error = '';
    const v = site.validated('#industryUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/industries/update',
      data: industry,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#industryUpdateModal');
          site.resetValidated('#industryUpdateModal');
          $scope.getIndustryList();
        } else if(response.data.error){
          $scope.error = response.data.error;
          if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          }
        }
      },
      function (err) {
       
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
      url: '/api/industries/update',
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
       
      }
    );
  };

 
  $scope.displayDetailsIndustry = function (industry) {
    $scope.error = '';
    $scope.viewIndustry(industry);
    $scope.industry = {};
    site.showModal('#industryViewModal');
  };

  $scope.viewIndustry = function (industry) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/industries/view',
      data: {
        id: industry.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.industry = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
       
      }
    );
  };

  $scope.displayDeleteIndustry = function (industry) {
    $scope.error = '';
    $scope.viewIndustry(industry);
    $scope.industry = {};
    site.showModal('#industryDeleteModal');
  };

  $scope.deleteIndustry = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/industries/delete',
      data: {
        id: $scope.industry.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#industryDeleteModal');
          $scope.getIndustryList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
       
      }
    );
  };

  $scope.searchAll = function () {
    $scope.getIndustryList($scope.search);
    site.hideModal('#industrySearchModal');
    $scope.search = {};
  };

  $scope.getIndustryList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/industries/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#industrySearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

 

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#industrySearchModal');
  };

  $scope.getIndustryList();
});
