app.controller('training_categories', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.training_categories = {};

  $scope.displayAttendance = function (c) {
    $scope.error = '';
    $scope.training_categories = c;

    site.showModal('#attendanceModal');
  };

  $scope.displayAddTrainingCategories = function () {
    $scope.error = '';
    $scope.training_categories = {
      image: '/images/training_categories.png',
      active: true,
    };

    site.showModal('#trainingCategoriesAddModal');
  };

  $scope.addTrainingCategories = function () {
    $scope.error = '';
    const v = site.validated('#trainingCategoriesAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_categories/add',
      data: $scope.training_categories,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCategoriesAddModal');
          $scope.getTrainingCategoriesList();
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

  $scope.displayUpdateTrainingCategories = function (training_categories) {
    $scope.error = '';
    $scope.viewTrainingCategories(training_categories);
    $scope.training_categories = {};
    site.showModal('#trainingCategoriesUpdateModal');
  };

  $scope.updateTrainingCategories = function (training_categories) {
    $scope.error = '';
    const v = site.validated('#trainingCategoriesUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_categories/update',
      data: training_categories,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCategoriesUpdateModal');
          $scope.getTrainingCategoriesList();
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

   $scope.updateActivate = function (training_categories) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_categories/update',
      data: training_categories,
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
 
  $scope.displayDetailsTrainingCategories = function (training_categories) {
    $scope.error = '';
    $scope.viewTrainingCategories(training_categories);
    $scope.training_categories = {};
    site.showModal('#trainingCategoriesViewModal');
  };

  $scope.viewTrainingCategories = function (training_categories) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/training_categories/view',
      data: {
        id: training_categories.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.training_categories = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteTrainingCategories = function (training_categories) {
    $scope.error = '';
    $scope.viewTrainingCategories(training_categories);
    $scope.training_categories = {};
    site.showModal('#trainingCategoriesDeleteModal');
  };

  $scope.deleteTrainingCategories = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/training_categories/delete',
      data: {
        id: $scope.training_categories.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCategoriesDeleteModal');
          $scope.getTrainingCategoriesList();
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
    $scope.getTrainingCategoriesList($scope.search);
    site.hideModal('#trainingCategoriesSearchModal');
    $scope.search = {};
  };

  $scope.getTrainingCategoriesList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/training_categories/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#trainingCategoriesSearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTrainingTypeList = function () {
    $scope.busy = true;
    $scope.trainingTypeList = [];

    $http({
      method: 'POST',
      url: '/api/training_types/all',
      data: {
        where: { active: true },
        select: { id: 1,code : 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.trainingTypeList = response.data.list;
      
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
    site.showModal('#trainingCategoriesSearchModal');
  };

  $scope.getTrainingCategoriesList();
  $scope.getTrainingTypeList();
});
