app.controller('certificatesGeneric', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.certificate_partner_generic = {};
  $scope.system_generic = {};

  $scope.displayAddCertificatesPartnerGeneric = function () {
    $scope.error = '';
    $scope.certificate_partner_generic = {
      active: true,
      type: 'partners_generic',
      certificate_list: [{ file_type: 'trainee' }],
    };

    site.showModal('#certificatesPartnerGenericAddModal');
  };

  $scope.uploadCertificatesSystemGeneric = function (type) {
    $scope.error = '';
    let url = '/api/certificates/add';
    let certificate_system = $scope.certificatesSystemGenericList.find((_c) => {
      return _c.type === 'system_generic' && _c.file_type === type;
    });

    if (certificate_system && certificate_system.id) {
      url = '/api/certificates/update';

      certificate_system.certificate = type == 'trainee' ? $scope.system_generic.trainee_certificate : $scope.system_generic.trainer_certificate;
    } else {
      url = '/api/certificates/add';
      certificate_system = {
        certificate: type == 'trainee' ? $scope.system_generic.trainee_certificate : $scope.system_generic.trainer_certificate,
        file_type: type == 'trainee' ? 'trainee' : 'trainer',
        active: true,
        type: 'system_generic',
      };
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: url,
      data: certificate_system,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.system_generic = {};
          $scope.getCertificatesSystemGenericList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
       
      }
    );
  };

  $scope.addCertificatesPartnerGeneric = function () {
    $scope.error = '';
    const v = site.validated('#certificatesPartnerGenericAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/certificates/transaction',
      data: $scope.certificate_partner_generic,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#certificatesPartnerGenericAddModal');
          site.resetValidated('#certificatesPartnerGenericAddModal');
          $scope.getCertificatesPartnerGenericList();
        } else if (response.data.error) {
          $scope.error = response.data.error;
          if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          }
        }
      },
      function (err) {
       
      }
    );
  };

  $scope.displayUpdateCertificatesPartnerGeneric = function (certificate_partner_generic) {
    $scope.error = '';
    $scope.viewCertificatesPartnerGeneric(certificate_partner_generic);
    $scope.certificate_partner_generic = {};
    site.showModal('#certificatesPartnerGenericUpdateModal');
  };

  $scope.updateCertificatesPartnerGeneric = function (certificate_partner_generic) {
    $scope.error = '';
    const v = site.validated('#certificatesPartnerGenericUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/certificates/transaction',
      data: certificate_partner_generic,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#certificatesPartnerGenericUpdateModal');
          site.resetValidated('#certificatesPartnerGenericUpdateModal');
          $scope.getCertificatesPartnerGenericList();
        } else if (response.data.error) {
          $scope.error = response.data.error;
          if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          }
        }
      },
      function (err) {
       
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
       
      }
    );
  };

  $scope.displayDetailsCertificatesPartnerGeneric = function (certificate_partner_generic) {
    $scope.error = '';
    $scope.viewCertificatesPartnerGeneric(certificate_partner_generic);
    $scope.certificate_partner_generic = {};
    site.showModal('#certificatesPartnerGenericViewModal');
  };

  $scope.viewCertificatesPartnerGeneric = function (certificate_partner_generic) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/certificates/view',
      data: {
        where: { id: certificate_partner_generic.id },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.certificate_partner_generic = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
       
      }
    );
  };

  $scope.getCertificatesPartnerGeneric = function (certificate_partner_generic) {
    $scope.busy = true;
    $scope.error = '';
    if (certificate_partner_generic.partner && certificate_partner_generic.partner.id)
      $http({
        method: 'POST',
        url: '/api/certificates/view',
        data: {
          where: { 'partner.id': certificate_partner_generic.partner.id, type: 'partners_generic' },
        },
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done) {
            $scope.certificate_partner_generic = response.data.doc;
          } else {
            $scope.certificate_partner_generic = {
              active: true,
              partner: certificate_partner_generic.partner,
              type: 'partners_generic',
              certificate_list: [{ file_type: 'trainee' }],
            };
            return;
          }
     
        },
        function (err) {
          console.log(err);
        }
      );
  };

  $scope.displayDeleteCertificatesPartnerGeneric = function (certificate_partner_generic) {
    $scope.error = '';
    $scope.viewCertificatesPartnerGeneric(certificate_partner_generic);
    $scope.certificate_partner_generic = {};
    site.showModal('#certificatesPartnerGenericDeleteModal');
  };

  $scope.deleteCertificatesPartnerGeneric = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/certificates/delete',
      data: {
        id: $scope.certificate_partner_generic.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#certificatesPartnerGenericDeleteModal');
          $scope.getCertificatesPartnerGenericList();
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
       
      }
    );
  };

  $scope.searchAll = function () {
    $scope.getCertificatesPartnerGenericList($scope.search);
    site.hideModal('#certificatesPartnerGenericSearchModal');
    $scope.search = {};
  };

  $scope.getCertificatesPartnerGenericList = function (where) {
    $scope.busy = true;
    $scope.certificatesPartnerList = [];
    where = where || {};
    where.type = 'partners_generic';
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
          $scope.certificatesPartnerList = response.data.list;
          $scope.count = response.data.list.length;
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getCertificatesSystemGenericList = function (where) {
    $scope.busy = true;
    $scope.certificatesSystemGenericList = [];
    where = where || {};
    where.type = 'system_generic';
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
          $scope.certificatesSystemGenericList = response.data.list;
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

  $scope.displaySearchPartnerModal = function () {
    $scope.error = '';
    site.showModal('#certificatesPartnerGenericSearchModal');
  };

  $scope.getCertificatesPartnerGenericList();
  $scope.getCertificatesSystemGenericList();
  $scope.getPartnersList();
});
