app.controller('languages', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.language = {};

  $scope.displayAddLanguage = function () {
    $scope.error = '';
    $scope.language = {
      image: '/images/language.png',
      active: true,
    };

    site.showModal('#languageAddModal');
  };

  $scope.addLanguage = function () {
    $scope.error = '';
    const v = site.validated('#languageAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/languages/add',
      data: $scope.language,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#languageAddModal');
          $scope.getLanguageList();
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

  $scope.displayUpdateLanguage = function (language) {
    $scope.error = '';
    $scope.viewLanguage(language);
    $scope.language = {};
    site.showModal('#languageUpdateModal');
  };

  $scope.updateLanguage = function (language) {
    $scope.error = '';
    const v = site.validated('#languageUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/languages/update',
      data: language,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#languageUpdateModal');
          $scope.getLanguageList();
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

   $scope.updateActivate = function (language) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/languages/update',
      data: language,
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
 
  $scope.displayDetailsLanguage = function (language) {
    $scope.error = '';
    $scope.viewLanguage(language);
    $scope.language = {};
    site.showModal('#languageViewModal');
  };

  $scope.viewLanguage = function (language) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/languages/view',
      data: {
        id: language.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.language = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteLanguage = function (language) {
    $scope.error = '';
    $scope.viewLanguage(language);
    $scope.language = {};
    site.showModal('#languageDeleteModal');
  };

  $scope.deleteLanguage = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/languages/delete',
      data: {
        id: $scope.language.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#languageDeleteModal');
          $scope.getLanguageList();
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
    $scope.getLanguageList($scope.search);
    site.hideModal('#languageSearchModal');
    $scope.search = {};
  };

  $scope.getLanguageList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: 'POST',
      url: '/api/languages/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#languageSearchModal');
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
        screen: 'language',
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
    site.showModal('#languageSearchModal');
  };

  $scope.getLanguageList();
  $scope.getNumberingAuto();
});
