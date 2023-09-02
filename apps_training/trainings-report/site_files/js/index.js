app.controller('trainingsReport', function ($scope, $http, $timeout) {
  $scope.training = {};
  $scope.chartTime = 1;

  $scope.displayChart = function (t) {
    $timeout(() => {
      let data1 = {
        data: [
          {
            Gender: 'Male',
            Count: t.maleCount,
            Color: am4core.color('#2196f3'),
          },
          {
            Gender: 'Female',
            Count: t.femaleCount,
            Color: am4core.color('#ffeb3b'),
          },
        ],
      };

      let data2 = {
        data: [
          {
            Trainees: 'Succeed',
            Count: t.succeed_trainees,
            Color: am4core.color('#4caf50'),
          },
          {
            Trainees: 'Not Pass',
            Count: t.trainees_list.length - t.succeed_trainees,
            Color: am4core.color('#f44336'),
          },
        ],
      };

      am4core.useTheme(am4themes_animated);
      let chart1 = am4core.createFromConfig(data1, 'chart1_' + t.id, am4charts.PieChart);
      let chart2 = am4core.createFromConfig(data2, 'chart2_' + t.id, am4charts.PieChart);

      if (document.querySelector('body.ar')) {
        chart1.rtl = true;
        chart2.rtl = true;
        console.log(chart1);
        console.log(chart2);
      }

      var pieSeries = chart1.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'Count';
      pieSeries.dataFields.category = 'Gender';
      pieSeries.slices.template.propertyFields.fill = 'Color';
      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;
      chart1.legend = new am4charts.Legend();

      var pieSeries = chart2.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'Count';
      pieSeries.dataFields.category = 'Trainees';
      pieSeries.slices.template.propertyFields.fill = 'Color';
      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;
      chart2.legend = new am4charts.Legend();
    }, 1000);
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

    where['approve'] = true;

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
            _l.succeed_trainees = 0;
            _l.maleCount = 0;
            _l.femaleCount = 0;
            _l.trainees_list.forEach((_t) => {
              if (_t.gender && _t.gender.id == 1) {
                _l.maleCount++;
              } else {
                _l.femaleCount++;
              }
              if (_t.trainee_degree >= _l.success_rate) {
                _l.succeed_trainees += 1;
              }
              if (window.isChart) {
                $scope.displayChart({ ..._l });
              }
            });
          });
        }
      },
      function (err) {
        $scope.busy = false;
      }
    );
  };

  $scope.displayTrainees = function (training) {
    $scope.error = '';
    $scope.training = training;
    site.showModal('#traineesModal');
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

  $scope.searchAll = function () {
    $scope.getTrainingList($scope.search);
    site.hideModal('#trainingReportSearchModal');
    $scope.search = {};
  };

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#trainingReportSearchModal');
  };

  $scope.getTrainingList();
  $scope.getPartnersList();
  $scope.getTrainingTypesList();
  $scope.getCountryList();
});
