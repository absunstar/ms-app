app.controller('country', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.country = {};

  $scope.displayAddCountry = function () {
    $scope.error = '';
    $scope.country = {
      image_url: '/images/country.png',
      active: true,
    };

    site.showModal('#countryAddModal');
  };

  $scope.addCountry = function () {
    $scope.error = '';
    const v = site.validated('#countryAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/country/add',
      data: $scope.country,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#countryAddModal');
          $scope.getCountryList();
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

  $scope.displayUpdateCountry = function (country) {
    $scope.error = '';
    $scope.viewCountry(country);
    $scope.country = {};
    site.showModal('#countryUpdateModal');
  };

  $scope.updateCountry = function (country) {
    $scope.error = '';
    const v = site.validated('#countryUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/country/update',
      data: country,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#countryUpdateModal');
          $scope.getCountryList();
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

   $scope.updateActivate = function (country) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/country/update',
      data: country,
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
 
  $scope.displayDetailsCountry = function (country) {
    $scope.error = '';
    $scope.viewCountry(country);
    $scope.country = {};
    site.showModal('#countryViewModal');
  };

  $scope.viewCountry = function (country) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/country/view',
      data: {
        id: country.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.country = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteCountry = function (country) {
    $scope.error = '';
    $scope.viewCountry(country);
    $scope.country = {};
    site.showModal('#countryDeleteModal');
  };

  $scope.deleteCountry = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/country/delete',
      data: {
        id: $scope.country.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#countryDeleteModal');
          $scope.getCountryList();
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
    $scope.getCountryList($scope.search);
    site.hideModal('#countrySearchModal');
    $scope.search = {};
  };

  $scope.getCountryList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: 'POST',
      url: '/api/country/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#countrySearchModal');
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
        screen: 'country',
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
    site.showModal('#countrySearchModal');
  };

  $scope.getCountryList();
  $scope.getNumberingAuto();
});
