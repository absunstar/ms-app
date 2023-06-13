app.controller('trainingCategories', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.training_category = {};



  $scope.displayAddTrainingCategories = function () {
    $scope.error = '';
    $scope.training_category = {
      active: true,
    };

    site.showModal('#trainingCategoriesAddModal');
  };

  $scope.addTrainingCategories = function () {
    $scope.error = '';
    const v = site.validated('#trainingCategoriesAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/trainings_categories/add',
      data: $scope.training_category,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCategoriesAddModal');
          site.resetValidated('#trainingCategoriesAddModal');
          $scope.getTrainingCategoriesList();
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

  $scope.displayUpdateTrainingCategories = function (training_category) {
    $scope.error = '';
    $scope.viewTrainingCategories(training_category);
    $scope.training_category = {};
    site.showModal('#trainingCategoriesUpdateModal');
  };

  $scope.updateTrainingCategories = function (training_category) {
    $scope.error = '';
    const v = site.validated('#trainingCategoriesUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/trainings_categories/update',
      data: training_category,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCategoriesUpdateModal');
          site.resetValidated('#trainingCategoriesUpdateModal');
          $scope.getTrainingCategoriesList();
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
      url: '/api/trainings_categories/update',
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

  $scope.displayDetailsTrainingCategories = function (training_category) {
    $scope.error = '';
    $scope.viewTrainingCategories(training_category);
    $scope.training_category = {};
    site.showModal('#trainingCategoriesViewModal');
  };

  $scope.viewTrainingCategories = function (training_category) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/trainings_categories/view',
      data: {
        id: training_category.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.training_category = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
       
      }
    );
  };

  $scope.displayDeleteTrainingCategories = function (training_category) {
    $scope.error = '';
    $scope.viewTrainingCategories(training_category);
    $scope.training_category = {};
    site.showModal('#trainingCategoriesDeleteModal');
  };

  $scope.deleteTrainingCategories = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/trainings_categories/delete',
      data: {
        id: $scope.training_category.id,
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
      url: '/api/trainings_categories/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          console.log($scope.list);
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
      url: '/api/trainings_types/all',
      data: {
        where: { active: true },
        select: { id: 1,   name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
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
