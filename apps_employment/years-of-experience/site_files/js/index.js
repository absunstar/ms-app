app.controller('yearsOfExperience', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.years_of_experience = {};

  $scope.displayAddYearsOfExperience = function () {
    $scope.error = '';
    $scope.years_of_experience = {
      active: true,
    };

    site.showModal('#yearsOfExperienceAddModal');
  };

  $scope.addYearsOfExperience = function () {
    $scope.error = '';
    const v = site.validated('#yearsOfExperienceAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/years_of_experience/add',
      data: $scope.years_of_experience,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#yearsOfExperienceAddModal');
          site.resetValidated('#yearsOfExperienceAddModal');
          $scope.getYearsOfExperienceList();
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

  $scope.displayUpdateYearsOfExperience = function (years_of_experience) {
    $scope.error = '';
    $scope.viewYearsOfExperience(years_of_experience);
    $scope.years_of_experience = {};
    site.showModal('#yearsOfExperienceUpdateModal');
  };

  $scope.updateYearsOfExperience = function (years_of_experience) {
    $scope.error = '';
    const v = site.validated('#yearsOfExperienceUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/years_of_experience/update',
      data: years_of_experience,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#yearsOfExperienceUpdateModal');
          site.resetValidated('#yearsOfExperienceUpdateModal');
          $scope.getYearsOfExperienceList();
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
      url: '/api/years_of_experience/update',
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

 
  $scope.displayDetailsYearsOfExperience = function (years_of_experience) {
    $scope.error = '';
    $scope.viewYearsOfExperience(years_of_experience);
    $scope.years_of_experience = {};
    site.showModal('#yearsOfExperienceViewModal');
  };

  $scope.viewYearsOfExperience = function (years_of_experience) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/years_of_experience/view',
      data: {
        id: years_of_experience.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.years_of_experience = response.data.doc;
          console.log($scope.years_of_experience);
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteYearsOfExperience = function (years_of_experience) {
    $scope.error = '';
    $scope.viewYearsOfExperience(years_of_experience);
    $scope.years_of_experience = {};
    site.showModal('#yearsOfExperienceDeleteModal');
  };

  $scope.deleteYearsOfExperience = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/years_of_experience/delete',
      data: {
        id: $scope.years_of_experience.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#yearsOfExperienceDeleteModal');
          $scope.getYearsOfExperienceList();
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
    $scope.getYearsOfExperienceList($scope.search);
    site.hideModal('#yearsOfExperienceSearchModal');
    $scope.search = {};
  };

  $scope.getYearsOfExperienceList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/years_of_experience/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#yearsOfExperienceSearchModal');
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
    site.showModal('#yearsOfExperienceSearchModal');
  };

  $scope.getYearsOfExperienceList();
});
