app.controller('exam_templates', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.exam_templates = {};

  $scope.displayAddExamTemplates = function () {
    $scope.error = '';
    $scope.exam_templates = {
      image_url: '/images/exam_templates.png',
      active: true,
    };

    site.showModal('#examTemplatesAddModal');
  };

  $scope.addExamTemplates = function () {
    $scope.error = '';
    const v = site.validated('#examTemplatesAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/exam_templates/add',
      data: $scope.exam_templates,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#examTemplatesAddModal');
          $scope.getExamTemplatesList();
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

  $scope.displayUpdateExamTemplates = function (exam_templates) {
    $scope.error = '';
    $scope.viewExamTemplates(exam_templates);
    $scope.exam_templates = {};
    site.showModal('#examTemplatesUpdateModal');
  };

  $scope.updateExamTemplates = function (exam_templates) {
    $scope.error = '';
    const v = site.validated('#examTemplatesUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/exam_templates/update',
      data: exam_templates,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#examTemplatesUpdateModal');
          $scope.getExamTemplatesList();
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

   $scope.updateActivate = function (exam_templates) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/exam_templates/update',
      data: exam_templates,
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
 
  $scope.displayDetailsExamTemplates = function (exam_templates) {
    $scope.error = '';
    $scope.viewExamTemplates(exam_templates);
    $scope.exam_templates = {};
    site.showModal('#examTemplatesViewModal');
  };

  $scope.viewExamTemplates = function (exam_templates) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/exam_templates/view',
      data: {
        id: exam_templates.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.exam_templates = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteExamTemplates = function (exam_templates) {
    $scope.error = '';
    $scope.viewExamTemplates(exam_templates);
    $scope.exam_templates = {};
    site.showModal('#examTemplatesDeleteModal');
  };

  $scope.deleteExamTemplates = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/exam_templates/delete',
      data: {
        id: $scope.exam_templates.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#examTemplatesDeleteModal');
          $scope.getExamTemplatesList();
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
    $scope.getExamTemplatesList($scope.search);
    site.hideModal('#examTemplatesSearchModal');
    $scope.search = {};
  };

  $scope.getExamTemplatesList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: 'POST',
      url: '/api/exam_templates/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#examTemplatesSearchModal');
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
        screen: 'exam_templates',
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
    site.showModal('#examTemplatesSearchModal');
  };

  $scope.getExamTemplatesList();
  $scope.getNumberingAuto();
});
