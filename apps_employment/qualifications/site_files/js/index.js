app.controller('qualifications', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.qualification = {};

  $scope.displayAddQualification = function () {
    $scope.error = '';
    $scope.qualification = {
      image: '/images/qualification.png',
      active: true,
    };

    site.showModal('#qualificationAddModal');
  };

  $scope.addQualification = function () {
    $scope.error = '';
    const v = site.validated('#qualificationAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/qualifications/add',
      data: $scope.qualification,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#qualificationAddModal');
          site.resetValidated('#qualificationAddModal');
          $scope.getQualificationList();
        } else if(response.data.error){
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
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/qualifications/update',
      data: qualification,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#qualificationUpdateModal');
          site.resetValidated('#qualificationUpdateModal');
          $scope.getQualificationList();
        } else if(response.data.error){
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
      url: '/api/qualifications/update',
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
      url: '/api/qualifications/view',
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
      url: '/api/qualifications/delete',
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
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/qualifications/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#qualificationSearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        
      }
    );
  };

 
  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#qualificationSearchModal');
  };

  $scope.getQualificationList();
});
