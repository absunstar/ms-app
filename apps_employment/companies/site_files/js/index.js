app.controller('companies', function ($scope, $http, $timeout) {
  $scope._search = {};

  $scope.company = {};

  $scope.displayAddCompany = function () {
    $scope.error = '';
    $scope.company = {
      image: '/images/company.png',
      active: true,
    };

    site.showModal('#companyAddModal');
  };

  if ('##query.post##' == 'true') {
    $scope.displayAddCompany();
  }

  $scope.addCompany = function () {
    $scope.error = '';
    const v = site.validated('#companyAddModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }
    $scope.company.approve = {
      id: 1,
      en: 'Panding Approval',
      ar: 'إنتظار الموافقة',
    };
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/companies/add',
      data: $scope.company,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#companyAddModal');
          site.resetValidated('#companyAddModal');
          $scope.getCompanyList();
        } else if (response.data.error) {
          $scope.error = response.data.error;
          if (response.data.error.like('*not allowed to add other companies*')) {
            $scope.error = '##word.not_allowed_add_other_companies##';
          }
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };

  $scope.displayUpdateCompany = function (company) {
    $scope.error = '';
    $scope.viewCompany(company);
    $scope.company = {};
    site.showModal('#companyUpdateModal');
  };

  $scope.updateCompany = function (company) {
    $scope.error = '';
    const v = site.validated('#companyUpdateModal');
    if (!v.ok) {
      $scope.error = v.messages[0].ar;
      return;
    }

    company.approve = {
      id: 1,
      en: 'Panding Approval',
      ar: 'إنتظار الموافقة',
    };

    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/companies/update',
      data: company,
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#companyUpdateModal');
          site.resetValidated('#companyUpdateModal');
          $scope.getCompanyList();
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

  $scope.showActivationModal = function (element, type) {
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
    $scope.busy = true;
    $http({
      method: 'POST',
      url: '/api/companies/update',
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

  $scope.viewCompany = function (company) {
    $scope.busy = true;
    $scope.error = '';
    $http({
      method: 'POST',
      url: '/api/companies/view',
      data: {
        id: company.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          $scope.company = response.data.doc;
        } else {
          $scope.error = response.data.error;
        }
      },
      function (err) {
        console.log(err);
      }
    );
  };



  $scope.displayDeleteCompany = function (company) {
    $scope.error = '';
    $scope.viewCompany(company);
    $scope.company = {};
    site.showModal('#companyDeleteModal');
  };

  $scope.deleteCompany = function () {
    $scope.busy = true;
    $scope.error = '';

    $http({
      method: 'POST',
      url: '/api/companies/delete',
      data: {
        id: $scope.company.id,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done) {
          site.hideModal('#companyDeleteModal');
          $scope.getCompanyList();
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
    $scope.getCompanyList($scope.search);
    site.hideModal('#companySearchModal');
    $scope.search = {};
  };

  $scope.getCompanyList = function (where) {
    $scope.busy = true;
    where = where || {};

    if ('##user.role.name##' == 'employer') {
      where['add_user_info.id'] = site.toNumber('##user.id##');
    }

    $scope.list = [];
    $scope.count = 0;

    $http({
      method: 'POST',
      url: '/api/companies/all',
      data: {
        where: where,
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.list = response.data.list;
          $scope.count = response.data.count;
          site.hideModal('#companySearchModal');
          $scope.search = {};
        }
      },
      function (err) {
        $scope.busy = false;
        $scope.error = err;
      }
    );
  };

  $scope.getIndustryList = function () {
    $scope.busy = true;
    $scope.industryList = [];

    $http({
      method: 'POST',
      url: '/api/industries/all',
      data: {
        where: { active: true },
        select: { id: 1, name_ar: 1, name_en: 1 },
      },
    }).then(
      function (response) {
        $scope.busy = false;
        if (response.data.done && response.data.list && response.data.list.length > 0) {
          $scope.industryList = response.data.list;
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

  $scope.displaySearchModal = function () {
    $scope.error = '';
    site.showModal('#companySearchModal');
  };

  $scope.getCompanyList();
  $scope.getIndustryList();
  $scope.getCountryList();
});
