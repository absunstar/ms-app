app.controller('trainings', function ($scope, $http, $timeout) {
  $scope.training = {};

  $scope.displayAddTraining = function () {
    $scope.error = '';
    $scope.training = {
      image: '/images/training.png',
      approve: false,
      start_date: new Date(),
      trainees_list: [],
      location: 'offline',
    };

    site.showModal('#trainingAddModal');
  };

  $scope.addTraining = function () {
    $scope.error = '';
    const v = site.validated('#trainingAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/trainings/add',
      data: $scope.training,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingAddModal');
          site.resetValidated('#trainingAddModal');
          $scope.getTrainingList();
        } else if (response.data.error) {
          $scope.error = response.data.error;
          if (response.data.error.like('*Start Date cannot be bigger than End date*')) {
            $scope.error = '##word.start_date_cannot_bigger_than_end_date##';
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayUpdateTraining = function (training) {
    $scope.error = '';
    $scope.viewTraining(training);
    $scope.training = {};
    site.showModal('#trainingUpdateModal');
  };

  $scope.updateTraining = function (training) {
    $scope.error = '';
    const v = site.validated('#trainingUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/trainings/update',
      data: training,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingUpdateModal');
          site.resetValidated('#trainingUpdateModal');
          $scope.getTrainingList();
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

  $scope.displayDetailsTraining = function (training) {
    $scope.error = '';
    $scope.viewTraining(training);
    $scope.training = {};
    site.showModal('#trainingViewModal');
  };

  $scope.viewTraining = function (training) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/trainings/view',
      data: {
        id: training.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.training = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteTraining = function (training) {
    $scope.error = '';
    $scope.viewTraining(training);
    $scope.training = {};
    site.showModal('#trainingDeleteModal');
  };

  $scope.deleteTraining = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/trainings/delete',
      data: {
        id: $scope.training.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#trainingDeleteModal');
          $scope.getTrainingList();
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
    $scope.getTrainingList($scope.search);
    site.hideModal('#trainingSearchModal');
    $scope.search = {};
  };

  $scope.getTrainingList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    $scope.count = 0;

    where = where || {};

    $http({
      method: 'POST',
      url: '/api/trainings/all',
      data: {
        where: where,
        search: $scope.general_search,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#trainingSearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTrainersList = function (id) {
    $scope.busy = true;
    $scope.trainersList = [];
    where = { active: true, 'role.name': 'trainer', 'partners_list.sub_partners.id': id };
    $http({
      method: 'POST',
      url: '/api/users/all',
      data: {
        where: where,
        select: { id: 1, first_name: 1, last_name: 1, email: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.users && response.data.users.length > 0) {
          $scope.trainersList = response.data.users;
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

  $scope.getSubPartnersList = function (id) {
    $scope.busy = true;
    $scope.subPartnersList = [];
    where = { active: true };
    where['partners_list.id'] = id;
    $http({
      method: 'POST',
      url: '/api/sub_partners/all',
      data: {
        where: where,
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.subPartnersList = response.data.list;
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
        where: { active: true, 'sub_partner.id': id },
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
        where: { active: true, 'training_type.id': id },
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

  $scope.getPrivacyType = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.privacyTypesList = [];
    $http({
      method: 'POST',
      url: '/api/privacy_type/all',
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.privacyTypesList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getDays = function () {
    $scope.error = '';
    $scope.busy = true;
    $scope.daysList = [];
    $http({
      method: 'POST',
      url: '/api/days/all',
    }).then(
      function (response) {
        $scope.busy = false;
        $scope.daysList = response.data;
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
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

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#trainingSearchModal');
  };

  $scope.getTrainingList();
  $scope.getPartnersList();
  $scope.getTrainingTypesList();
  $scope.getPrivacyType();
  $scope.getCountryList();
  $scope.getDays();
});
