app.controller('city', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.city = {};

  $scope.displayAddCity = function () {
    $scope.error = '';
    $scope.city = {
      image: '/images/city.png',
      active: true,
    };

    site.showModal('#cityAddModal');
  };

  $scope.addCity = function () {
    $scope.error = '';
    const v = site.validated('#cityAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    if ('##query.id##' != 'undefined') {
      $scope.city.country = $scope.country;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/city/add',
      data: $scope.city,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#cityAddModal');
          $scope.getCityList();
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

  $scope.displayUpdateCity = function (city) {
    $scope.error = '';
    $scope.viewCity(city);
    $scope.city = {};
    site.showModal('#cityUpdateModal');
  };

  $scope.updateCity = function (city) {
    $scope.error = '';
    const v = site.validated('#cityUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/city/update',
      data: city,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#cityUpdateModal');
          $scope.getCityList();
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

  $scope.updateActivate = function (city) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/city/update',
      data: city,
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

  $scope.displayDetailsCity = function (city) {
    $scope.error = '';
    $scope.viewCity(city);
    $scope.city = {};
    site.showModal('#cityViewModal');
  };

  $scope.viewCity = function (city) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/city/view',
      data: {
        id: city.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.city = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteCity = function (city) {
    $scope.error = '';
    $scope.viewCity(city);
    $scope.city = {};
    site.showModal('#cityDeleteModal');
  };

  $scope.deleteCity = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/city/delete',
      data: {
        id: $scope.city.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#cityDeleteModal');
          $scope.getCityList();
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
    $scope.getCityList($scope.search);
    site.hideModal('#citySearchModal');
    $scope.search = {};
  };

  $scope.getCityList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};
    if ('##query.id##' != 'undefined') {
      where['country.id'] = site.toNumber('##query.id##');
    }
    $http({
      method: 'POST',
      url: '/api/city/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#citySearchModal');
          $scope.search = {};
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
          if ('##query.id##' != 'undefined') {
            $scope.country = $scope.countryList.find((_country) => {
              return _country.id === site.toNumber('##query.id##');
            });
          }
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
        screen: 'city',
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
    site.showModal('#citySearchModal');
  };

  $scope.getCityList();
  $scope.getCountryList();
  $scope.getNumberingAuto();
});
