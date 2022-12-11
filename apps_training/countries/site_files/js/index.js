app.controller('countries', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.country = {};

  $scope.displayAddCountry = function () {
    $scope.error = '';
    $scope.country = {
      active: true,
    };

    site.showModal('#countryAddModal');
  };

  $scope.addCountry = function () {
    $scope.error = '';
    const v = site.validated('#countryAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/countries/add',
      data: $scope.country,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#countryAddModal');
          site.resetValidated('#countryAddModal');
          $scope.getCountryList();
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
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/countries/update',
      data: country,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#countryUpdateModal');
          site.resetValidated('#countryUpdateModal');
          $scope.getCountryList();
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
      url: '/api/countries/update',
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
      url: '/api/countries/view',
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
      url: '/api/countries/delete',
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
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/countries/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
         
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.setCountryMigration = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/countries/migration',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
         
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
});
