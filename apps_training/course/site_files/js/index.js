app.controller('course', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.course = {};

  $scope.displayAddCourse = function () {
    $scope.error = '';
    $scope.course = {
      image: '/images/course.png',
      active: true,
    };

    site.showModal('#courseAddModal');
  };

  $scope.addCourse = function () {
    $scope.error = '';
    const v = site.validated('#courseAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    if ('##query.id##' != 'undefined') {
      $scope.course.training_category = $scope.training_category;
    }

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/course/add',
      data: $scope.course,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#courseAddModal');
          $scope.getCourseList();
        } else {
          $scope.error = response.data.error;
          if (response.data.error.like('*Must Enter Code*')) {
            $scope.error = '##word.must_enter_code##';
          } else if (response.data.error.like('*Name Exists*')) {
            $scope.error = '##word.name_already_exists##';
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayUpdateCourse = function (course) {
    $scope.error = '';
    $scope.viewCourse(course);
    $scope.course = {};
    site.showModal('#courseUpdateModal');
  };

  $scope.updateCourse = function (course) {
    $scope.error = '';
    const v = site.validated('#courseUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/course/update',
      data: course,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#courseUpdateModal');
          $scope.getCourseList();
        } else {
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

  $scope.updateActivate = function (course) {
    $scope.error = '';

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/course/update',
      data: course,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
        } else {
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

  $scope.displayDetailsCourse = function (course) {
    $scope.error = '';
    $scope.viewCourse(course);
    $scope.course = {};
    site.showModal('#courseViewModal');
  };

  $scope.viewCourse = function (course) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/course/view',
      data: {
        id: course.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.course = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayDeleteCourse = function (course) {
    $scope.error = '';
    $scope.viewCourse(course);
    $scope.course = {};
    site.showModal('#courseDeleteModal');
  };

  $scope.deleteCourse = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/course/delete',
      data: {
        id: $scope.course.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#courseDeleteModal');
          $scope.getCourseList();
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
    $scope.getCourseList($scope.search);
    site.hideModal('#courseSearchModal');
    $scope.search = {};
  };

  $scope.getCourseList = function (where) {
    $scope.busy = true;
    $scope.list = [];
    where = where || {};
    if ('##query.id##' != 'undefined') {
      where['training_category.id'] = site.toNumber('##query.id##');
    }
    $http({
      method: 'POST',
      url: '/api/course/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#courseSearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getTrainingCategoryList = function () {
    $scope.busy = true;
    $scope.trainingCategoryList = [];

    $http({
      method: 'POST',
      url: '/api/training_categories/all',
      data: {
        where: { active: true },
        select: { id: 1, code: 1, name_ar: 1, name_en: 1, training_type: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list &&  response.data.list.length > 0) {
          $scope.trainingCategoryList = response.data.list;
          if ('##query.id##' != 'undefined') {
            $scope.training_category = $scope.trainingCategoryList.find((_trainingCategory) => {
              return _trainingCategory.id === site.toNumber('##query.id##');
            });
          }
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getNumberingAuto = function () {
    $scope.error = '';
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/numbering/get_automatic',
      data: {
        screen: 'course',
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.disabledCode = response.data.isAuto;
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
    site.showModal('#courseSearchModal');
  };

  $scope.getCourseList();
  $scope.getTrainingCategoryList();
  $scope.getNumberingAuto();
});
