app.controller('partnersCertificates', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.partner_certificate = {};

  $scope.displayAddPartnerCertificates = function () {
    $scope.error = '';
    $scope.partner_certificate = {
      active: true,
      file_type: 'trainee',
    };

    site.showModal('#partnerCertificatesAddModal');
  };

  $scope.addPartnerCertificates = function () {
    $scope.error = '';
    const v = site.validated('#partnerCertificatesAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.partner_certificate.type = 'partners';
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/certificates/add',
      data: $scope.partner_certificate,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#partnerCertificatesAddModal');
          site.resetValidated('#partnerCertificatesAddModal');
          $scope.getPartnerCertificatesList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayUpdatePartnerCertificates = function (partner_certificate) {
    $scope.error = '';
    $scope.viewPartnerCertificates(partner_certificate);
    $scope.partner_certificate = {};
    site.showModal('#partnerCertificatesUpdateModal');
  };

  $scope.updatePartnerCertificates = function (partner_certificate) {
    $scope.error = '';
    const v = site.validated('#partnerCertificatesUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/certificates/update',
      data: partner_certificate,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#partnerCertificatesUpdateModal');
          site.resetValidated('#partnerCertificatesUpdateModal');
          $scope.getPartnerCertificatesList();
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

  $scope.displayDetailsPartnerCertificates = function (partner_certificate) {
    $scope.error = '';
    $scope.viewPartnerCertificates(partner_certificate);
    $scope.partner_certificate = {};
    site.showModal('#partnerCertificatesViewModal');
  };

  $scope.viewPartnerCertificates = function (partner_certificate) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/certificates/view',
      data: {
        id: partner_certificate.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.partner_certificate = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeletePartnerCertificates = function (partner_certificate) {
    $scope.error = '';
    $scope.viewPartnerCertificates(partner_certificate);
    $scope.partner_certificate = {};
    site.showModal('#partnerCertificatesDeleteModal');
  };

  $scope.deletePartnerCertificates = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/certificates/delete',
      data: {
        id: $scope.partner_certificate.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#partnerCertificatesDeleteModal');
          $scope.getPartnerCertificatesList();
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
    $scope.getPartnerCertificatesList($scope.search);
    site.hideModal('#partnerCertificatesSearchModal');
    $scope.search = {};
  };

  $scope.getPartnerCertificatesList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};
    where.type = 'partners';
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
          site.hideModal('#partnerCertificatesSearchModal');
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

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#partnerCertificatesSearchModal');
  };

  $scope.getPartnerCertificatesList();
  $scope.getPartnersList();
  $scope.getTrainingTypesList();
});
