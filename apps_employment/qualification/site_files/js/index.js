app.controller('qualification', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.qualification = {};

  $scope.displayAddQualification = function () {
    $scope.error = '';
    $scope.qualification = {
      image_url: '/images/qualification.png',
      active: true,
    };

    site.showModal('#qualificationAddModal');
  };

  $scope.addQualification = function () {
    $scope.error = '';
    const v = site.validated('#qualificationAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/qualification/add',
      data: $scope.qualification,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#qualificationAddModal');
          $scope.getQualificationList();
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

  $scope.displayUpdateQualification = function (qualification) {
    $scope.error = '';
    $scope.viewQualification(qualification);
    $scope.qualification = {};
    site.showModal('#qualificationUpdateModal');
  };

  $scope.updateQualification = function (qualification) {
    $scope.error = '';
    const v = site.validated('#qualificationUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/qualification/update',
      data: qualification,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#qualificationUpdateModal');
          $scope.getQualificationList();
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

   $scope.updateActivate = function (qualification) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/qualification/update',
      data: qualification,
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
 
  $scope.displayDetailsQualification = function (qualification) {
    $scope.error = '';
    $scope.viewQualification(qualification);
    $scope.qualification = {};
    site.showModal('#qualificationViewModal');
  };

  $scope.viewQualification = function (qualification) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/qualification/view',
      data: {
        id: qualification.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.qualification = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteQualification = function (qualification) {
    $scope.error = '';
    $scope.viewQualification(qualification);
    $scope.qualification = {};
    site.showModal('#qualificationDeleteModal');
  };

  $scope.deleteQualification = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/qualification/delete',
      data: {
        id: $scope.qualification.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#qualificationDeleteModal');
          $scope.getQualificationList();
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
    $scope.getQualificationList($scope.search);
    site.hideModal('#qualificationSearchModal');
    $scope.search = {};
  };

  $scope.getQualificationList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $http({
      method: 'POST',
      url: '/api/qualification/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#qualificationSearchModal');
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
        screen: 'qualification',
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
    site.showModal('#qualificationSearchModal');
  };

  $scope.getQualificationList();
  $scope.getNumberingAuto();
});
