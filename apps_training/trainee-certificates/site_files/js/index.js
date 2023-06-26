app.controller('traineeCertificates', function ($scope, $http, $timeout) {
  $scope.search = {};

  $scope.getTrainingsList = function () {
    $scope.error = '';

    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: 'POST',
      url: '/api/trainings/trainee_trainings',
      data: {
        id: site.toNumber('##query.id##'),
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
          console.log($scope.list[1]);
          $scope.count = $scope.list.length;
        }
      },
      function (err) {
        $scope.busy = false;
      }
    );
  };

  $scope.createCertificate = function (training) {
    $scope.error = '';
    $http({
      method: 'POST',
      url: `/api/trainings/create_certificates?training_id=${training.id}&trainee_id=${site.toNumber('##req.query.id##')}&training_type_id=${training.training_type.id}`,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.path) {
          window.open('/api/download-certificate?path=' + response.data.path + '&name=' + response.data.name);
        }
      },
      function (err) {
        $scope.busy = false;
      }
    );

    site.hideModal('#examModal');
  };
  $scope.createAllCertificate = function (training) {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: 'POST',
      url: `/api/trainings/create_all_certificates?training_id=${training.id}&training_type_id=${training.training_type.id}`,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.path) {
          window.open('/api/download-certificate?path=' + response.data.path + '&name=' + response.data.name);
        }
      },
      function (err) {
        $scope.busy = false;
      }
    );

    site.hideModal('#examModal');
  };

  $scope.startExam = function (training) {
    $scope.error = '';
    $scope.questionsList = [];
    $http({
      method: 'POST',
      url: '/api/trainings/start_exam',
      data: {
        where: { active: true, 'training_type.id': training.training_type.id },
        training_id: training.id,
        trainee_id: site.toNumber('##user.id##'),
        exam_template: training.exam_template,
        number_questions: training.number_questions,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.questionsList = response.data.list;
          $scope.training = training;
          $scope.startExamTime();
          site.showModal('#examModal');
        } else if (response.data.error) {
          $scope.error = response.data.error;
          if (response.data.error.like('*no questions for the exam*')) {
            $scope.error = '##word.no_questions_for_exam##';
          } else {
            $scope.error = '##word.there_error_while_taking_exam##';
          }
        }
      },
      function (err) {
        $scope.busy = false;
      }
    );
  };

  $scope.finishExam = function (training, questions_list) {
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/trainings/finish_exam',
      data: {
        where: { 'training_type.id': training.training_type.id, 'training_type.id': training.training_type.id },
        training_id: training.id,
        trainee_id: site.toNumber('##user.id##'),
        questions_list: questions_list,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.startExamTime('finish');
          $scope.getTrainingsList();
        }
      },
      function (err) {
        $scope.busy = false;
      }
    );

    site.hideModal('#examModal');
  };

  $scope.startExamTime = function (type) {
    let minute = 44;
    let secound = 59;
    const timeExamInterval = setInterval(function () {
      if (type == 'finish') {
        clearInterval(timeExamInterval);
      }
      if ('##session.lang##' == 'ar') {
        document.getElementById('timer').innerHTML = '##word.remaining_time##' + ' ( ' + secound + ' : ' + minute + ' ) ';
      } else {
        document.getElementById('timer').innerHTML = '##word.remaining_time##' + ' ( ' + minute + ' : ' + secound + ' ) ';
      }
      secound--;
      if (secound == 0) {
        if (secound <= 1 && minute < 1) {
          clearInterval(timeExamInterval);
        }
        minute--;
        secound = 60;
      }
    }, 1000);
  };
  $scope.checkCorrect = function (answers_list, index) {
    $scope.error = '';
    answers_list.forEach((_a, i) => {
      if (i != index) {
        _a.trainee_answer = false;
      }
    });
  };

  $scope.getMyAccount = function () {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/user/view',
      data: {
        id: site.toNumber('##query.id##'),
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.user = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };

  $scope.getTrainingsList();
  $scope.getMyAccount();
});
