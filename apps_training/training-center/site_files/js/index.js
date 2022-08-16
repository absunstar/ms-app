app.controller('training_center', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.training_center = {};

  $scope.displayAddTrainingCenter = function () {
    $scope.error = '';
    $scope.training_center = {
      image: '/images/training_center.png',
      active: true,
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

    if ('##query.id##' != 'undefined') {
      $scope.training_center.partner = $scope.partner;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_center/add',
      data: $scope.training_center,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCenterAddModal');
          $scope.getTrainingCenterList();
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
      url: '/api/training_center/update',
      data: training_center,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCenterUpdateModal');
          $scope.getTrainingCenterList();
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

  $scope.updateActivate = function (training_center) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/training_center/update',
      data: training_center,
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
      url: '/api/training_center/view',
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
      url: '/api/training_center/delete',
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
      where['partner.id'] = site.toNumber('##query.id##');
    }
    $http({
      method: 'POST',
      url: '/api/training_center/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
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

  $scope.getPartnerList = function () {
    $scope.busy = true;
    $scope.partnerList = [];

    $http({
      method: 'POST',
      url: '/api/partner/all',
      data: {
        where: { active: true },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1},
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.partnerList = response.data.list;
          if ('##query.id##' != 'undefined') {
            $scope.partner = $scope.partnerList.find((_partner) => {
              return _partner.id === site.toNumber('##query.id##');
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

  $scope.getNumberingAuto = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/numbering/get_automatic',
      data: {
        screen: 'training_center',
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
    site.showModal('#trainingCenterSearchModal');
  };

  $scope.getTrainingCenterList();
  $scope.getPartnerList();
  $scope.getNumberingAuto();
});
