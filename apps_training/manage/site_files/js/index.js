let btn1 = document.querySelector('#manage .tab-link');
if (btn1) {
  btn1.click();
}

app.controller('manage', function ($scope, $http, $timeout) {
  $scope.manage = {};
  $scope.partner_logo = {};

  $scope.loadManage = function (where) {
    $scope.error = '';
    $scope.manage = {};
    $scope.busy = true;

    $http({
      method: 'POST',
      url: '/api/manage/get',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.manage = response.data.doc;
          $scope.manage.links = $scope.manage.links || [{}];
          $scope.manage.contact = $scope.manage.contact || {};
        } else {
          $scope.manage = {};
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.saveManage = function (manage, id) {
    $scope.error = '';
    const v = site.validated(id);
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/manage/save',
      data: manage,
    }).then(
      function (response) {
        $scope.busy = false;
        if (!response.data.done) {
          $scope.error = response.data.error;
        } else {
          site.showModal('#alert');
          $timeout(() => {
            site.hideModal('#alert');
          }, 1500);
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.editManage = function (manage) {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/manage/save',
      data: manage,
    }).then(
      function (response) {
        $scope.busy = false;
        if (!response.data.done) {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.displayAddPartnerLogo = function () {
    $scope.error = '';
    $scope.partner_logo = {
      active: true,
    };
    site.resetValidated('#partnerLogoModal');
    site.showModal('#partnerLogoModal');
  };

  $scope.displayEditPartnerLogo = function (partner_logo) {
    $scope.error = '';
    $scope.partner_logo = partner_logo;
    $scope.partner_logo.$edit = true;
    site.resetValidated('#partnerLogoModal');
    site.showModal('#partnerLogoModal');
  };

  $scope.displayDeletePartnerLogo = function (partner_logo, index) {
    $scope.error = '';
    $scope.partner_logo = partner_logo;
    $scope.partner_logo.$index = index;
    site.showModal('#partnerLogoDeleteModal');
  };

  $scope.addPartnerLogo = function (partner_logo) {
    $scope.error = '';
    const v = site.validated('#partnerLogoModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    $scope.manage.partners_logo_list.push(partner_logo);
    $scope.editManage($scope.manage);

    site.hideModal('#partnerLogoModal');
  };

  $scope.editPartnerLogo = function () {
    $scope.error = '';
    const v = site.validated('#partnerLogoModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.editManage($scope.manage);

    site.hideModal('#partnerLogoModal');
  };

  $scope.deletePartnerLogo = function (partner_logo) {
    $scope.error = '';
    $scope.manage.partners_logo_list.splice(partner_logo.$index, 1);
    $scope.editManage($scope.manage);

    site.hideModal('#partnerLogoDeleteModal');
  };

  $scope.showActivationModal = function (element, type) {
    $scope.error = '';
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

    $scope.manage;
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/manage/save',
      data: $scope.manage,
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

  $scope.getFonts = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.fontsList = [];
    $http({
      method: 'POST',
      url: '/api/fonts/all',
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.fontsList = response.data;
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

  $scope.loadManage();
  $scope.getFonts();
});
