app.controller('accounts', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.account = {};
  $scope.trainer = { partners_list: [] };
  $scope.partner = { partners_list: [] };
  $scope.sub_partner = { partners_list: [] };

  $scope.showPassword = function () {
    $timeout(() => {
      document.querySelectorAll('.pass input').forEach((p) => {
        p.setAttribute('type', $scope.show_password ? 'text' : 'password');
      });
    }, 100);
  };

  $scope.displayAddAccount = function () {
    site.vTab('v-admin');
    $scope.error = '';
    $scope.account = {
      image: '/images/account.png',
      active: true,
    };

    site.showModal('#accountAddModal');
  };

  $scope.displayUpdateAccount = function (account) {
    $scope.error = '';
    $scope.viewAccount(account);
    $scope.account = {};
    site.showModal('#accountUpdateModal');
  };

  $scope.showActivateModal = function (account) {
    $scope.error = '';
    $scope.account = account;
    site.showModal('#activateModal');
  };

  $scope.showDeactivateModal = function (account) {
    $scope.error = '';
    $scope.account = account;
    site.showModal('#deactivateModal');
  };

  $scope.updateAccount = function (account) {
    $scope.error = '';
    const v = site.validated('#accountUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/update',
      data: account,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#accountUpdateModal');
          site.resetValidated('#accountUpdateModal');
          $scope.getAccountList();
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

  $scope.update = function (account, type) {
    $scope.error = '';

    if (type == 'activate') {
      account.active = true;
    } else if (type == 'deactivate') {
      account.active = false;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/user/update',
      data: account,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          if (type == 'activate') {
            site.hideModal('#activateModal');
          } else if (type == 'deactivate') {
            site.hideModal('#deactivateModal');
          }
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

  $scope.displayDetailsAccount = function (account) {
    $scope.error = '';
    $scope.viewAccount(account);
    $scope.account = {};
    site.showModal('#accountViewModal');
  };

  $scope.viewAccount = function (account) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/user/view',
      data: {
        id: account.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.account = response.data.doc;
          if ($scope.account.role.name == 'sub_partner' || $scope.account.role.name == 'trainer')
            if ($scope.account.partners_list && $scope.account.partners_list.length > 0) {
              $scope.account.partners_list.forEach((_p) => {
                if (_p.sub_partners && _p.sub_partners.length > 0) {
                  $scope.getSubPartnerList(_p);
                }
              });
            }
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteAccount = function (account) {
    $scope.error = '';
    $scope.viewAccount(account);
    $scope.account = {};
    site.showModal('#accountDeleteModal');
  };

  $scope.deleteAccount = function (account) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/user/delete',
      data: {
        id: account.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#accountDeleteModal');
          $scope.getAccountList();
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
    $scope.getAccountList($scope.search);
    site.hideModal('#accountSearchModal');
    $scope.search = {};
  };

  $scope.getAccountList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;
    where = where || {};
    where['role.id'] = { $ne: 5 };
    $http({
      method: 'POST',
      url: '/api/users/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;

        if (response.data.done && response.data.users && response.data.users.length > 0) {
          $scope.list = response.data.users;
          $scope.count = response.data.count;
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.createAdmin = function (admin) {
    $scope.error = '';
    const v = site.validated('.admin-form');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    if (admin) {
      if (admin.password === admin.retype_password) {
        admin.role = $scope.accountsTypeList[0];
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/user/add',
          data: admin,
        }).then(
          function (response) {
            $scope.busy = false;
            if (response.data.done) {
              site.hideModal('#accountAddModal');
              site.resetValidated('.admin-form');
              $scope.getAccountList();
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
      } else {
        $scope.error = '##word.password_err_match##';
      }
    }
  };

  $scope.createPartner = function (partner) {
    $scope.error = '';
    const v = site.validated('.partner-form');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    if (partner) {
      if (partner.password === partner.retype_password) {
        partner.role = $scope.accountsTypeList[1];
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/user/add',
          data: partner,
        }).then(
          function (response) {
            $scope.busy = false;
            if (response.data.done) {
              site.hideModal('#accountAddModal');
              site.resetValidated('.partner-form');
              $scope.getAccountList();
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
      } else {
        $scope.error = '##word.password_err_match##';
      }
    }
  };

  $scope.createSubPartner = function (sub_partner) {
    $scope.error = '';
    const v = site.validated('.sub-partner-form');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    if (sub_partner) {
      if (sub_partner.password === sub_partner.retype_password) {
        sub_partner.role = $scope.accountsTypeList[2];
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/user/add',
          data: sub_partner,
        }).then(
          function (response) {
            $scope.busy = false;
            if (response.data.done) {
              site.hideModal('#accountAddModal');
              site.resetValidated('.sub-partner-form');
              $scope.getAccountList();
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
      } else {
        $scope.error = '##word.password_err_match##';
      }
    }
  };

  $scope.createTrainer = function (trainer) {
    $scope.error = '';
    const v = site.validated('.trainer-form');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    if (trainer) {
      if (trainer.password === trainer.retype_password) {
        trainer.role = $scope.accountsTypeList[3];
        $scope.busy = true;
        $http({
          method: 'POST',
          url: '/api/user/add',
          data: trainer,
        }).then(
          function (response) {
            $scope.busy = false;
            if (response.data.done) {
              site.hideModal('#accountAddModal');
              site.resetValidated('.trainer-form');
              $scope.getAccountList();
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
      } else {
        $scope.error = '##word.password_err_match##';
      }
    }
  };

  $scope.getAccountsType = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.accountsTypeList = [];
    $http({
      method: 'POST',
      url: '/api/accounts_type/all',
    }).then(
      function (response) {
        $scope.busy = false;
        response.data.splice(-1, 1);
        $scope.accountsTypeList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getPartnerList = function () {
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

  $scope.getSubPartnerList = function (p) {
    $scope.busy = true;

    if (p.partner && p.partner.id) {
      p.$subPartnersList = [];
      $http({
        method: 'POST',
        url: '/api/sub_partners/all',
        data: {
          where: { active: true, 'partners_list.id': p.partner.id },
          select: { id: 1, name_ar: 1, name_en: 1 },
        },
      }).then(
        function (response) {
          $scope.busy = false;
          if (response.data.done && response.data.list && response.data.list.length > 0) {
            p.$subPartnersList = response.data.list;
          }
        },
        function (err) {
          $scope.busy = false;
          $scope.error = err;
        }
      );
    }
  };

  $scope.getGender = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.genderList = [];
    $http({
      method: 'POST',
      url: '/api/gender/all',
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.genderList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.addPartner = function (user) {
    user.partners_list = user.partners_list || [];
    user.partners_list.push({});
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#accountSearchModal');
  };

  $scope.getCountryList = function () {
    $scope.busy = true;
    $scope.countryList = [];

    $http({
      method: 'POST',
      url: '/api/countries/all',
      data: {
        where: { active: true },
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.countryList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getCityList = function (id) {
    $scope.busy = true;
    $scope.cityList = [];

    $http({
      method: 'POST',
      url: '/api/cities/all',
      data: {
        where: { active: true, 'country.id': id },
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.cityList = response.data.list;
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getAccountList();
  $scope.getAccountsType();
  $scope.getGender();
  $scope.getPartnerList();
  $scope.getCountryList();
});
