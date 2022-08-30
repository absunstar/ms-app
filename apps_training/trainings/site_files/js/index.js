app.controller('trainings', function ($scope, $http, $timeout) {
  $scope.training = {};

  $scope.displayAddTraining = function () {
    $scope.error = '';
    $scope.training = {
      image: '/images/training.png',
      approve: false,
      start_date: new Date(),
      trainees_list: [],
      number_questions: 10,
      success_rate : 80,
      location: 'offline',
    };
    if ('##user.role.name##' == 'trainer') {
      $scope.getTrainersList();
    }
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

  $scope.updateTraining = function (training, type) {
    $scope.error = '';

    if (type == 'approve') {
      training.approve = true;
    } else if (type == 'update') {
      training.$edit_dates = true;
      const v = site.validated('#trainingUpdateModal');
      if (!v.ok) {
        $scope.error = v.messages[0].ar;
        return;
      }
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
          if (type == 'attend') {
            site.hideModal('#attendanceModal');
          } else if (type == 'update') {
            site.hideModal('#trainingUpdateModal');
            site.resetValidated('#trainingUpdateModal');
          }
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
    if ('##user.role.name##' == 'trainer') {
      where['trainer.id'] = site.toNumber('##user.id##');
    } else if ('##user.role.name##' == 'partner') {
      where['get_partner'] = true;
    } else if ('##user.role.name##' == 'sub_partner') {
      where['get_sub_partner'] = true;
    }

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
          $scope.list.forEach((_l) => {
            if (new Date(_l.start_date) < new Date()) {
              _l.$hide_edit = true;
            }
            if (new Date(_l.end_date) < new Date() && !_l.approve) {
              _l.$show_approved = true;
            }
          });
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
    let where = {};
    if ('##user.role.name##' == 'trainer') {
      where['id'] = site.toNumber('##user.id##');
    } else {
      where = { active: true, 'role.name': 'trainer', 'partners_list.sub_partners.id': id };
    }

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
          if ('##user.role.name##' == 'trainer') {
            $scope.training.trainer = $scope.trainersList[0];
          }
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

  $scope.getExamTemplatesList = function () {
    $scope.busy = true;
    $scope.examTemplatesList = [];

    $http({
      method: 'POST',
      url: '/api/exam_templates/all',
      data: {
        where: { active: true },
        select: { id: 1, name_ar: 1, name_en: 1, easy: 1, medium: 1, hard: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.examTemplatesList = response.data.list;
        }
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

  $scope.displayAttendingSceduleModal = function (training) {
    $scope.error = '';
    $scope.training = training;
    site.showModal('#attendingSceduleModal');
  };

  $scope.displayAttendanceModal = function (c) {
    $scope.error = '';
    $scope.attendance = c;
    if (new Date($scope.attendance.date) > new Date()) {
      $scope.error = '##word.attendance_cannot_modified_before_date##';
      return;
    } else {
      site.showModal('#attendanceModal');
    }
  };

  $scope.attendanceTraining = function (attendance, type) {
    $scope.error = '';
    attendance.trainees_list.forEach((_t) => {
      if (type == 'attend') {
        _t.attend = true;
        attendance.$absence_all = false;
      } else if (type == 'absence') {
        _t.attend = false;
        attendance.$attend_all = false;
      }
    });

    site.showModal('#attendanceModal');
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
  $scope.getExamTemplatesList();
});
