app.controller('partners', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.partner = {};

  $scope.displayAddPartner = function () {
    $scope.error = '';
    $scope.partner = {
      image: '/images/partner.png',
      active: true,
    };

    site.showModal('#partnerAddModal');
  };

  $scope.addPartner = function () {
    $scope.error = '';
    const v = site.validated('#partnerAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
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

  $scope.displayUpdatePartner = function (partner) {
    $scope.error = '';
    $scope.viewPartner(partner);
    $scope.partner = {};
    site.showModal('#partnerUpdateModal');
  };

  $scope.updatePartner = function (partner) {
    $scope.error = '';
    const v = site.validated('#partnerUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
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
          site.hideModal('#partnerUpdateModal');
          site.resetValidated('#partnerUpdateModal');
          $scope.getPartnerList();
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


  $scope.showActivationModal = function (element,type) {
    if(type == 'activate'){
      site.showModal('#activateModal');
    } else if(type == 'deactivate'){
      site.showModal('#deactivateModal');
    }
    $scope.element = element;
  };

  $scope.updateActivate = function (element,type) {
    $scope.error = '';
    if(type == 'activate'){
      element.active = true;
    site.hideModal('#activateModal');
    } else if(type == 'deactivate'){
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

  $scope.getPartnerList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/partners/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
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
