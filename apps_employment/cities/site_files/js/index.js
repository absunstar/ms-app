app.controller('city', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.city = {};

  $scope.displayAddCity = function () {
    $scope.error = '';
    $scope.city = {
      active: true,
      country: $scope.country || null,
    };

    site.showModal('#cityAddModal');
  };

  $scope.addCity = function () {
    $scope.error = '';
    const v = site.validated('#cityAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/cities/add',
      data: $scope.city,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#cityAddModal');
          site.resetValidated('#cityAddModal');
          $scope.getCityList();
        } else  if(response.data.error){
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
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/cities/update',
      data: city,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#cityUpdateModal');
          site.resetValidated('#cityUpdateModal');
          $scope.getCityList();
        } else if(response.data.error){
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

  $scope.showActivationModal = function (element, type) {
    if (type == 'activate') {
      site.showModal('#activateModal');
    } else if (type == 'deactivate') {
      site.showModal('#deactivateModal');
    }
    $scope.element = element;
  };

  $scope.updateActivate = function (element, type) {
    $scope.error = '';
    if (type == 'activate') {
      element.active = true;
      site.hideModal('#activateModal');
    } else if (type == 'deactivate') {
      element.active = false;
      site.hideModal('#deactivateModal');
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/cities/update',
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
      url: '/api/cities/view',
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
      url: '/api/cities/delete',
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

  $scope.getCityList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    where = where || {};
    if ('##query.id##' != 'undefined') {
      where['country.id'] = site.toNumber('##query.id##');
    }
    $http({
      method: 'POST',
      url: '/api/cities/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
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
      url: '/api/countries/all',
      data: {
        where: { active: true },
        select: { id: 1,   name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
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

  $scope.searchAll = function () {
    $scope.getCityList($scope.search);
    site.hideModal('#citySearchModal');
    $scope.search = {};
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#citySearchModal');
  };

  $scope.getCityList();
  $scope.getCountryList();
});
