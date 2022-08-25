app.controller('questions', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.question = {};

  $scope.displayAddQuestion = function () {
    $scope.error = '';
    $scope.question = {
      image: '/images/question.png',
      answers_list: [{}],
      active: true,
    };

    site.showModal('#questionAddModal');
  };

  $scope.addQuestion = function () {
    $scope.error = '';
    const v = site.validated('#questionAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/questions/add',
      data: $scope.question,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#questionAddModal');
          site.resetValidated('#questionAddModal');
          $scope.getQuestionList();
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

  $scope.displayUpdateQuestion = function (question) {
    $scope.error = '';
    $scope.viewQuestion(question);
    $scope.question = {};
    site.showModal('#questionUpdateModal');
  };

  $scope.updateQuestion = function (question) {
    $scope.error = '';
    const v = site.validated('#questionUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/questions/update',
      data: question,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#questionUpdateModal');
          site.resetValidated('#questionUpdateModal');
          $scope.getQuestionList();
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
      url: '/api/questions/update',
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


  $scope.displayDetailsQuestion = function (question) {
    $scope.error = '';
    $scope.viewQuestion(question);
    $scope.question = {};
    site.showModal('#questionViewModal');
  };

  $scope.viewQuestion = function (question) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/questions/view',
      data: {
        id: question.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.question = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteQuestion = function (question) {
    $scope.error = '';
    $scope.viewQuestion(question);
    $scope.question = {};
    site.showModal('#questionDeleteModal');
  };

  $scope.deleteQuestion = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/questions/delete',
      data: {
        id: $scope.question.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#questionDeleteModal');
          $scope.getQuestionList();
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
    $scope.getQuestionList($scope.search);
    site.hideModal('#questionSearchModal');
    $scope.search = {};
  };

  $scope.getQuestionList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/questions/all',
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

  $scope.getDifficulty = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.difficultyList = [];
    $http({
      method: 'POST',
      url: '/api/difficulty/all',
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.difficultyList = response.data;
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

  $scope.getTrainingCategoryList = function (training_type) {
    $scope.busy = true;
    $scope.trainingCategoryList = [];
    if (training_type && training_type.id) {
      $http({
        method: 'POST',
        url: '/api/trainings_categories/all',
        data: {
          where: { active: true, 'training_type.id': training_type.id },
          select: { id: 1,   name_ar: 1, name_en: 1 },
        },
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done && response.data.list &&  response.data.list.length > 0) {
            $scope.trainingCategoryList = response.data.list;
          }
        },
        function (err) {
          $scope.busy = false;
          $scope.error = err;
        }
      );
    }
  };

 

  $scope.checkCorrect = function (index) {
    $scope.error = '';
    $scope.question.answers_list.forEach((_a, i) => {
      if (i != index) {
        _a.correct = false;
      }
    });
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#questionSearchModal');
  };

  $scope.getQuestionList();
  $scope.getDifficulty();
  $scope.getTrainingTypeList();
});
