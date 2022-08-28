app.controller('subPartners', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.sub_partner = {};

  $scope.displayAddSubPartner = function () {
    $scope.error = '';
    $scope.sub_partner = {
      image: '/images/sub_partner.png',
      active: true,
    };

    site.showModal('#subPartnerAddModal');
  };

  $scope.addSubPartner = function () {
    $scope.error = '';
    const v = site.validated('#subPartnerAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/sub_partners/add',
      data: $scope.sub_partner,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#subPartnerAddModal');
          site.resetValidated('#subPartnerAddModal');
          $scope.getSubPartnerList();
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

  $scope.displayUpdateSubPartner = function (sub_partner) {
    $scope.error = '';
    $scope.viewSubPartner(sub_partner);
    $scope.sub_partner = {};
    site.showModal('#subPartnerUpdateModal');
  };

  $scope.updateSubPartner = function (sub_partner, type) {
    $scope.error = '';
    const v = site.validated('#subPartnerUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/sub_partners/update',
      data: sub_partner,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          if (type == 'partner') {
            site.hideModal('#partnersModal');
          } else if (type == 'account') {
            site.hideModal('#accountsModal');
          } else if (type == 'sub_partner') {
            site.hideModal('#subPartnerUpdateModal');
            site.resetValidated('#subPartnerUpdateModal');
          }

          $scope.getSubPartnerList();
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
      url: '/api/sub_partners/update',
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

  $scope.displayDetailsSubPartner = function (sub_partner) {
    $scope.error = '';
    $scope.viewSubPartner(sub_partner);
    $scope.sub_partner = {};
    site.showModal('#subPartnerViewModal');
  };

  $scope.viewSubPartner = function (sub_partner) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/sub_partners/view',
      data: {
        id: sub_partner.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.sub_partner = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteSubPartner = function (sub_partner) {
    $scope.error = '';
    $scope.viewSubPartner(sub_partner);
    $scope.sub_partner = {};
    site.showModal('#subPartnerDeleteModal');
  };

  $scope.deleteSubPartner = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/sub_partners/delete',
      data: {
        id: $scope.sub_partner.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#subPartnerDeleteModal');
          $scope.getSubPartnerList();
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
    $scope.getSubPartnerList($scope.search);
    site.hideModal('#subPartnerSearchModal');
    $scope.search = {};
  };

  $scope.getSubPartnerList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    where = where || {};
  
    $http({
      method: 'POST',
      url: '/api/sub_partners/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#subPartnerSearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.showPartnersModal = function (sub_partner) {
    $scope.error = '';
    $scope.sub_partner = sub_partner;
    site.showModal('#partnersModal');
  };

  $scope.showAccountsManagementModal = function (sub_partner) {
    $scope.error = '';
    $scope.sub_partner = sub_partner;
    site.showModal('#accountsModal');
  };

  $scope.addAccount = function (sub_partner) {
    $scope.error = '';
    if (sub_partner.$account_select && sub_partner.$account_select.id) {
      sub_partner.accounts_list = sub_partner.accounts_list || [];
      let find_partner = sub_partner.accounts_list.find((_partner) => {
        return _partner.id === sub_partner.$account_select.id;
      });
      if (!find_partner) {
        sub_partner.accounts_list.push(sub_partner.$account_select);
      }
    } else {
      $scope.error = '##word.partner_must_be_selected##';
      return;
    }
  };

  $scope.addPartner = function (sub_partner) {
    $scope.error = '';
    if (sub_partner.$partner_select && sub_partner.$partner_select.id) {
      sub_partner.partners_list = sub_partner.partners_list || [];
      let find_partner = sub_partner.partners_list.find((_partner) => {
        return _partner.id === sub_partner.$partner_select.id;
      });
      if (!find_partner) {
        sub_partner.partners_list.push(sub_partner.$partner_select);
      }
    } else {
      $scope.error = '##word.partner_must_be_selected##';
      return;
    }
  };

  $scope.getPartnersList = function (ev) {
    $scope.error = '';
    $scope.busy = true;
    if (ev.which !== 13) {
      return;
    }

    $scope.sub_partner.$partnersList = [];
    $http({
      method: 'POST',
      url: '/api/partners/all',
      data: {
        search: $scope.sub_partner.$partner_search,
        where: {
          active: true,
        },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list.length > 0) {
          $scope.sub_partner.$partnersList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getSubPartnersAccountsList = function (ev) {
    $scope.error = '';
    $scope.busy = true;
    if (ev.which !== 13) {
      return;
    }

    $scope.sub_partner.$accountsList = [];
    $http({
      method: 'POST',
      url: '/api/users/all',
      data: {
        search: $scope.sub_partner.$partner_search,
        where: {
          active: true,
          'role.name': 'sub_partner',
          'partners_list.sub_partners.id': $scope.sub_partner.id,
        },
        select: { id: 1, first_name: 1, last_name: 1, email: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.users.length > 0) {
          $scope.sub_partner.$accountsList = response.data.users;
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
    site.showModal('#subPartnerSearchModal');
  };

  $scope.getSubPartnerList();
});
