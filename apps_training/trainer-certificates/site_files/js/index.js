app.controller('trainerCertificates', function ($scope, $http, $timeout) {
  $scope.search = {};

  $scope.getTrainingsList = function (where) {
    where = where || {};
    where['approve'] = true;
    if('##user.role.name##' == 'trainer'){
      where['trainer.id'] = site.toNumber('##user.id##');

    } else {

      where['trainees_list.id'] = site.toNumber('##query.id##');

    }
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    $http({
      method: 'POST',
      url: '/api/trainings/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = $scope.list.length;
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
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
      function (err) {
       
      }
    );
  };

  $scope.getTrainingsList({});
  $scope.getMyAccount();
});
