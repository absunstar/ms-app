app.controller('industry', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.industry = {};

  $scope.displayAddIndustry = function () {
    $scope.error = '';
    $scope.industry = {
      image: '/images/industry.png',
      active: true,
    };

    site.showModal('#industryAddModal');
  };

  $scope.addIndustry = function () {
    $scope.error = '';
    const v = site.validated('#industryAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/industry/add',
      data: $scope.industry,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#industryAddModal');
          $scope.getIndustryList();
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*Must Enter Code*')) {
            $scope.error = '##word.must_enter_code##';
          } else if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          }
        }
      },
      function (err) {
        console.log(err);
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
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/industry/update',
      data: industry,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#industryUpdateModal');
          $scope.getIndustryList();
        } else {
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

   $scope.updateActivate = function (industry) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/industry/update',
      data: industry,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
        } else {
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
      url: '/api/industry/view',
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
        console.log(err);
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
      url: '/api/industry/delete',
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
        console.log(err);
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
    $http({
      method: 'POST',
      url: '/api/industry/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
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

  $scope.getNumberingAuto = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/numbering/get_automatic',
      data: {
        screen: 'industry',
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.disabledCode = response.data.isAuto;
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
  $scope.getNumberingAuto();
});
