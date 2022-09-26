app.controller('trainingCentersCertificates', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.training_center_certificate = {};

  $scope.displayAddTrainingCentersCertificates = function () {
    $scope.error = '';
    $scope.training_center_certificate = {
      active: true,
      file_type: 'trainee',
    };

    site.showModal('#trainingCentersCertificatesAddModal');
  };

  $scope.addTrainingCentersCertificates = function () {
    $scope.error = '';
    const v = site.validated('#trainingCentersCertificatesAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.training_center_certificate.type = 'training_centers';
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/certificates/add',
      data: $scope.training_center_certificate,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCentersCertificatesAddModal');
          site.resetValidated('#trainingCentersCertificatesAddModal');
          $scope.getTrainingCentersCertificatesList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayUpdateTrainingCentersCertificates = function (training_center_certificate) {
    $scope.error = '';
    $scope.viewTrainingCentersCertificates(training_center_certificate);
    $scope.training_center_certificate = {};
    site.showModal('#trainingCentersCertificatesUpdateModal');
  };

  $scope.updateTrainingCentersCertificates = function (training_center_certificate) {
    $scope.error = '';
    const v = site.validated('#trainingCentersCertificatesUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/certificates/update',
      data: training_center_certificate,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCentersCertificatesUpdateModal');
          site.resetValidated('#trainingCentersCertificatesUpdateModal');
          $scope.getTrainingCentersCertificatesList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.showActivationModal = function (element, type) {
    if (type == 'activate') {
      site.showModal('#activateModal');
    } else if (type == 'deactivate') {
      site.showModal('#deactivateModal');
    }
    $scope.element = element;
  };

  $scope.updateActivate = function (element, type) {
    $scope.error = '';
    if (type == 'activate') {
      element.active = true;
      site.hideModal('#activateModal');
    } else if (type == 'deactivate') {
      element.active = false;
      site.hideModal('#deactivateModal');
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/certificates/update',
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

  $scope.displayDetailsTrainingCentersCertificates = function (training_center_certificate) {
    $scope.error = '';
    $scope.viewTrainingCentersCertificates(training_center_certificate);
    $scope.training_center_certificate = {};
    site.showModal('#trainingCentersCertificatesViewModal');
  };

  $scope.viewTrainingCentersCertificates = function (training_center_certificate) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/certificates/view',
      data: {
        id: training_center_certificate.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.training_center_certificate = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteTrainingCentersCertificates = function (training_center_certificate) {
    $scope.error = '';
    $scope.viewTrainingCentersCertificates(training_center_certificate);
    $scope.training_center_certificate = {};
    site.showModal('#trainingCentersCertificatesDeleteModal');
  };

  $scope.deleteTrainingCentersCertificates = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/certificates/delete',
      data: {
        id: $scope.training_center_certificate.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingCentersCertificatesDeleteModal');
          $scope.getTrainingCentersCertificatesList();
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
    $scope.getTrainingCentersCertificatesList($scope.search);
    site.hideModal('#trainingCentersCertificatesSearchModal');
    $scope.search = {};
  };

  $scope.getTrainingCentersCertificatesList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};
    where.type = 'training_centers';
    $scope.count = 0;
    $http({
      method: 'POST',
      url: '/api/certificates/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#trainingCentersCertificatesSearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getPartnersList = function () {
    $scope.busy = true;
    $scope.partnersList = [];

    $http({
      method: 'POST',
      url: '/api/partners/all',
      data: {
        where: { active: true },
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.partnersList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTrainingTypesList = function () {
    $scope.busy = true;
    $scope.trainingTypesList = [];

    $http({
      method: 'POST',
      url: '/api/trainings_types/all',
      data: {
        where: { active: true },
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.trainingTypesList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTrainingCategoriesList = function (id) {
    $scope.busy = true;
    $scope.trainingCategoriesList = [];

    $http({
      method: 'POST',
      url: '/api/trainings_categories/all',
      data: {
        where: { active: true,'training_type.id' : id },
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.trainingCategoriesList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTrainingCentersList = function (id) {
    $scope.busy = true;
    $scope.trainingCentersList = [];

    $http({
      method: 'POST',
      url: '/api/trainings_centers/all',
      data: {
        where: { active: true,'sub_partner.partners_list.id' : id },
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.trainingCentersList = response.data.list;
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
    site.showModal('#trainingCentersCertificatesSearchModal');
  };

  $scope.getTrainingCentersCertificatesList();
  $scope.getPartnersList();
  $scope.getTrainingTypesList();
});
