app.controller('courses', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.course = {};

  $scope.displayAddCourse = function () {
    $scope.error = '';
    $scope.course = {
      image: '/images/course.png',
      active: true,
      training_category : $scope.training_category || null
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
      url: '/api/courses/add',
      data: $scope.course,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#courseAddModal');
          site.resetValidated('#courseAddModal');
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
      url: '/api/courses/update',
      data: course,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#courseUpdateModal');
          site.resetValidated('#courseUpdateModal');
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
      url: '/api/courses/update',
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
      url: '/api/courses/view',
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
      url: '/api/courses/delete',
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
    $scope.count = 0;

    where = where || {};
    if ('##query.id##' != 'undefined') {
      where['training_category.id'] = site.toNumber('##query.id##');
    }

    $http({
      method: 'POST',
      url: '/api/courses/all',
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
        select: { id: 1, name_ar: 1, name_en: 1, training_type: 1 },
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



  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#courseSearchModal');
  };

  $scope.getCourseList();
  $scope.getTrainingCategoryList();
});
