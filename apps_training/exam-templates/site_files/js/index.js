app.controller('examTemplates', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.exam_template = {};

  $scope.displayAddExamTemplates = function () {
    $scope.error = '';
    $scope.exam_template = {
      active: true,
    };

    site.showModal('#examTemplatesAddModal');
  };

  $scope.addExamTemplates = function () {
    $scope.error = '';
    const v = site.validated('#examTemplatesAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/exam_templates/add',
      data: $scope.exam_template,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#examTemplatesAddModal');
          site.resetValidated('#examTemplatesAddModal');
          $scope.getExamTemplatesList();
        } else if(response.data.error){
          $scope.error = response.data.error;
          if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          } else if (response.data.error.like('*sum has to be 100*')) {
            $scope.error = '##word.percentage_sum_be_100##';
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayUpdateExamTemplates = function (exam_template) {
    $scope.error = '';
    $scope.viewExamTemplates(exam_template);
    $scope.exam_template = {};
    site.showModal('#examTemplatesUpdateModal');
  };

  $scope.updateExamTemplates = function (exam_template) {
    $scope.error = '';
    const v = site.validated('#examTemplatesUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/exam_templates/update',
      data: exam_template,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#examTemplatesUpdateModal');
          site.resetValidated('#examTemplatesUpdateModal');
          $scope.getExamTemplatesList();
        } else if(response.data.error){
          $scope.error = response.data.error;
          if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          } else if (response.data.error.like('*sum has to be 100*')) {
            $scope.error = '##word.percentage_sum_be_100##';
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
      url: '/api/exam_templates/update',
      data: element,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
        } else if (response.data.error) {
          $scope.error = response.data.error;
          if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          } else if (response.data.error.like('*sum has to be 100*')) {
            $scope.error = '##word.percentage_sum_be_100##';
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDetailsExamTemplates = function (exam_template) {
    $scope.error = '';
    $scope.viewExamTemplates(exam_template);
    $scope.exam_template = {};
    site.showModal('#examTemplatesViewModal');
  };

  $scope.viewExamTemplates = function (exam_template) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/exam_templates/view',
      data: {
        id: exam_template.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.exam_template = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteExamTemplates = function (exam_template) {
    $scope.error = '';
    $scope.viewExamTemplates(exam_template);
    $scope.exam_template = {};
    site.showModal('#examTemplatesDeleteModal');
  };

  $scope.deleteExamTemplates = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/exam_templates/delete',
      data: {
        id: $scope.exam_template.id,
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
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/exam_templates/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
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



  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#examTemplatesSearchModal');
  };

  $scope.getExamTemplatesList();
});
