app.controller('trainingCenters', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.training_center = {};

  $scope.displayAddTrainingCenter = function () {
    $scope.error = '';
    $scope.training_center = {
      image: '/images/training_center.png',
      active: true,
      sub_partner: $scope.sub_partner || null,
    };

    site.showModal('#trainingCenterAddModal');
  };

  $scope.addTrainingCenter = function () {
    $scope.error = '';
    const v = site.validated('#trainingCenterAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/trainings_centers/add',
      data: $scope.training_center,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCenterAddModal');
          site.resetValidated('#trainingCenterAddModal');
          $scope.getTrainingCenterList();
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

  $scope.displayUpdateTrainingCenter = function (training_center) {
    $scope.error = '';
    $scope.viewTrainingCenter(training_center);
    $scope.training_center = {};
    site.showModal('#trainingCenterUpdateModal');
  };

  $scope.updateTrainingCenter = function (training_center) {
    $scope.error = '';
    const v = site.validated('#trainingCenterUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/trainings_centers/update',
      data: training_center,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCenterUpdateModal');
          site.resetValidated('#trainingCenterUpdateModal');
          $scope.getTrainingCenterList();
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

  $scope.updateActivate = function (training_center) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/trainings_centers/update',
      data: training_center,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
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

  $scope.displayDetailsTrainingCenter = function (training_center) {
    $scope.error = '';
    $scope.viewTrainingCenter(training_center);
    $scope.training_center = {};
    site.showModal('#trainingCenterViewModal');
  };

  $scope.viewTrainingCenter = function (training_center) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/trainings_centers/view',
      data: {
        id: training_center.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.training_center = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteTrainingCenter = function (training_center) {
    $scope.error = '';
    $scope.viewTrainingCenter(training_center);
    $scope.training_center = {};
    site.showModal('#trainingCenterDeleteModal');
  };

  $scope.deleteTrainingCenter = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/trainings_centers/delete',
      data: {
        id: $scope.training_center.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCenterDeleteModal');
          $scope.getTrainingCenterList();
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
    $scope.getTrainingCenterList($scope.search);
    site.hideModal('#trainingCenterSearchModal');
    $scope.search = {};
  };

  $scope.getTrainingCenterList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    where = where || {};
    if ('##query.id##' != 'undefined') {
      where['sub_partner.id'] = site.toNumber('##query.id##');
    }
    $http({
      method: 'POST',
      url: '/api/trainings_centers/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#trainingCenterSearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getSubPartnerList = function () {
    $scope.busy = true;
    $scope.subPartnerList = [];

    $http({
      method: 'POST',
      url: '/api/sub_partners/all',
      data: {
        where: { active: true },
        select: { id: 1,   name_ar: 1, name_en: 1 , partners_list : 1},
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.subPartnerList = response.data.list;
          if ('##query.id##' != 'undefined') {
            $scope.sub_partner = $scope.subPartnerList.find((_subPartner) => {
              return _subPartner.id === site.toNumber('##query.id##');
            });
          }
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
    site.showModal('#trainingCenterSearchModal');
  };

  $scope.getTrainingCenterList();
  $scope.getSubPartnerList();
});
