app.controller('trainings', function ($scope, $http, $timeout) {
  $scope.training = {};

  $scope.createAllCertificate = function (training) {
    $scope.error = '';
    $scope.busy = true;
    if ((btn = document.querySelector('#btn_approve_' + training.id))) {
      btn.style.display = 'none';
    }
    $http({
      method: 'POST',
      url: `/api/trainings/create_all_certificates?training_id=${training.id}&training_type_id=${training.training_type.id}`,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.path) {
          window.open('/api/download-certificate?path=' + response.data.path + '&name=' + response.data.name);
        }
      },
      function (err) {
        $scope.busy = false;
      }
    );

    site.hideModal('#examModal');
  };

  $scope.displayAddTraining = function () {
    $scope.error = '';
    $scope.training = {
      approve: false,
      start_date: new Date(),
      trainees_list: [],
      number_questions: 10,
      success_rate: 80,
      location: 'offline',
      exam_template: $scope.examTemplatesList[0],
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
      $scope.error = v.messages[0]['##session.lang##'];
      return;
    }
    if (!$scope.training.location) {
      $scope.training.location = 'online';
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
      function (err) {}
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
        $scope.error = v.messages[0]['##session.lang##'];
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
      function (err) {}
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
      function (err) {}
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
      function (err) {}
    );
  };

  $scope.getTrainingList = function (where, more) {
    $scope.busy = true;
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
        more: more,
        search: $scope.general_search,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          if (!more) {
            $scope.list = [];
            $scope.count = response.data.count;
          }
          response.data.list.forEach((doc) => {
            $scope.list.push(doc);
          });
          $scope.count += response.data.count;
        } else if (!more) {
          $scope.list = [];
        }
        site.hideModal('#trainingSearchModal');
      },
      function (err) {
        $scope.busy = false;
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
        select: { id: 1, first_name: 1, last_name: 1, email: 1, phone: 1 },
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
      }
    );
  };

  $scope.getDays = function (training) {
    $scope.error = '';
    $scope.busy = true;
    $scope.daysList = [];
    $http({
      method: 'POST',
      url: '/api/days/all',
    }).then(
      function (response) {
        $scope.busy = false;
        if (training.start_date && training.end_date) {
          let start = new Date(training.start_date);
          let end = new Date(training.end_date);
          let list = [];
          let index = response.data.findIndex((itm) => itm.code === start.getDay());
          if (index !== -1) {
            if (!list.some((b) => b && b.code == response.data[index].code)) {
              list.push(response.data[index]);
            }
          }
          while (new Date(start) <= new Date(end)) {
            start.setTime(start.getTime() + 1 * 24 * 60 * 60 * 1000);
            let index = response.data.findIndex((itm) => itm.code === start.getDay());
            if (index !== -1) {
              if (!list.some((b) => b && b.code == response.data[index].code)) {
                list.push(response.data[index]);
              }
            }
            if (new Date(start) == new Date(end)) {
              break;
            }
          }
          $scope.daysList = list;
          training.days = [];
        } else {
          $scope.daysList = response.data;
        }
      },
      function (err) {
        $scope.busy = false;
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
    c.$absence_all = false;
    c.$attend_all = false;
    $scope.attendance = c;
    if (new Date(c.date) > new Date()) {
      $scope.error = '##word.attendance_cannot_modified_before_date##';
      return;
    } else {
      /*       if (!$scope.attendance.trainees_list.some((_attend) => _attend.attend == true)) {
        $scope.attendance.trainees_list = [];
        $scope.training.trainees_list.forEach((_t) => {
          if (_t.approve) {
            $scope.attendance.trainees_list.push({
              _id: _t._id,
              id: _t.id,
              first_name: _t.first_name,
              email: _t.email,
              attend: false,
            });
          }
        });
      } */
      $scope.training.trainees_list.forEach((_t) => {
        let found_trainee = $scope.attendance.trainees_list.find((_tr) => {
          return _tr.id === _t.id;
        });
        if (!found_trainee && _t.approve) {
          $scope.attendance.trainees_list.push({
            _id: _t._id,
            id: _t.id,
            first_name: _t.first_name,
            email: _t.email,
            attend: false,
            apology: _t.apology,
          });
        }
      });
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
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#trainingSearchModal');
  };
  $scope.searchAll = function () {
    $scope.getTrainingList($scope.search);
    site.hideModal('#trainingReportSearchModal');
    $scope.search = {};
  };

  $scope.genderToTraining = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/trainings/genderToTraining',
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
        } else if (response.data.error) {
          $scope.error = response.data.error;
        }
      },
      function (err) {}
    );
  };
  $scope.getTrainingList();
  $scope.getPartnersList();
  $scope.getTrainingTypesList();
  $scope.getCountryList();
  $scope.getPrivacyType();
  $scope.getExamTemplatesList();
});
