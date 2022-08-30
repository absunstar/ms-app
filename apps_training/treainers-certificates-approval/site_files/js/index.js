app.controller('trainersCertificatesApproval', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.getTrainingsList = function (where) {
    where = where || {};
    where['approve'] = true;

    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: 'POST',
      url: '/api/trainings/trainers_certificate',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.updateTraining = function (training) {
    $scope.error = '';
    $scope.busy = true;

    $http({
      method: 'POST',
      url: '/api/trainings/update',
      data: training,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.getTrainingsList();
        } else if (response.data.error) {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.getTrainingsList();
});
