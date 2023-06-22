app.controller('trainingsReport', function ($scope, $http, $timeout) {
  $scope.training = {};

  $scope.getTrainingList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    where = where || {};
    if ('##user.role.name##' == 'trainer') {
      where['trainer.id'] = site.toNumber('##user.id##');
    } else if ('##user.role.name##' == 'partner') {
      where['get_partner'] = true;
    } else if ('##user.role.name##' == 'sub_partner') {
      where['get_sub_partner'] = true;
    }

    where['approve'] = true;

    $http({
      method: 'POST',
      url: '/api/trainings/all',
      data: {
        where: where,
        search: $scope.general_search,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          $scope.list.forEach((_l) => {
            _l.succeed_trainees = 0;
            _l.trainees_list.forEach((_t) => {
              if (_t.trainee_degree >= _l.success_rate) {
                _l.succeed_trainees += 1;
              }
            });
          });
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.displayTrainees = function (training) {
    $scope.error = '';
    $scope.training = training;
    site.showModal('#traineesModal');
  };

  $scope.getTrainingList();
});