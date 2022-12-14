app.controller('partners', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.partner = {};

  $scope.displayAddPartner = function () {
    $scope.error = '';
    $scope.partner = {
      active: true,
    };

    site.showModal('#partnerAddModal');
  };

  $scope.addPartner = function () {
    $scope.error = '';
    const v = site.validated('#partnerAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/partners/add',
      data: $scope.partner,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#partnerAddModal');
          site.resetValidated('#partnerAddModal');
          $scope.getPartnerList();
        } else if (response.data.error) {
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

  $scope.displayUpdatePartner = function (partner) {
    $scope.error = '';
    $scope.viewPartner(partner);
    $scope.partner = {};
    site.showModal('#partnerUpdateModal');
  };

  $scope.updatePartner = function (partner, type, modal) {
    $scope.error = '';

    const v = site.validated(modal);
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/partners/update',
      data: partner,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          if (type == 'partner') {
            site.hideModal('#partnerUpdateModal');
            site.resetValidated('#partnerUpdateModal');
          } else if (type == 'account') {
            site.hideModal('#accountsModal');
          }

          $scope.getPartnerList();
        } else if (response.data.error) {
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
      url: '/api/partners/update',
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

  $scope.displayDetailsPartner = function (partner) {
    $scope.error = '';
    $scope.viewPartner(partner);
    $scope.partner = {};
    site.showModal('#partnerViewModal');
  };

  $scope.viewPartner = function (partner) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/partners/view',
      data: {
        id: partner.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.partner = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeletePartner = function (partner) {
    $scope.error = '';
    $scope.viewPartner(partner);
    $scope.partner = {};
    site.showModal('#partnerDeleteModal');
  };

  $scope.deletePartner = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/partners/delete',
      data: {
        id: $scope.partner.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#partnerDeleteModal');
          $scope.getPartnerList();
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
    $scope.getPartnerList($scope.search);
    site.hideModal('#partnerSearchModal');
    $scope.search = {};
  };

  $scope.showAccountsManagementModal = function (partner) {
    $scope.error = '';
    $scope.partner = partner;
    $scope.getPartnersAccountsList(partner.id);
    site.showModal('#accountsModal');

  };

  $scope.addAccount = function (partner) {
    $scope.error = '';
    if (partner.$account_select && partner.$account_select.id) {
      partner.accounts_list = partner.accounts_list || [];
      let find_partner = partner.accounts_list.find((_partner) => {
        return _partner.id === partner.$account_select.id;
      });
      if (!find_partner) {
        partner.accounts_list.push(partner.$account_select);
      } else {
        $scope.error = '##word.name_already_exists##';
        return;
      }
    } else {
      $scope.error = '##word.partner_must_be_selected##';
      return;
    }
  };

  $scope.getPartnersAccountsList = function (partnerId) {
    $scope.error = '';
    $scope.busy = true;

    $scope.accountsList = [];
    $http({
      method: 'POST',
      url: '/api/users/all',
      data: {
        where: {
          active: true,
          'role.name': 'partner',
          'partners_list.partner.id': partnerId,
        },
        select: { id: 1, first_name: 1, last_name: 1, email: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.users.length > 0) {
          $scope.accountsList = response.data.users;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getPartnerList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    where = where || {};

    $http({
      method: 'POST',
      url: '/api/partners/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#partnerSearchModal');
          $scope.search = {};
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
    site.showModal('#partnerSearchModal');
  };

  $scope.getPartnerList();
});
