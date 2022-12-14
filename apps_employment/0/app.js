module.exports = function init(site) {

  site.get({
    name: '/',
    path: __dirname + '/site_files',
    public: true
  })

  site.post('/api/gender/all', (req, res) => {

    let response = [
      {
        id: 1,
        en: "Male",
        ar: "ذكر"
      },

      {
        id: 2,
        en: "Female",
        ar: "أنثى"
      }
    ]

    if (site.manage_doc.undefined_gender_activation) {
      response.push({
        id: 3,
        en: "Undefined",
        ar: "غير محدد"
      })
    }

    res.json(response);

  });

  const $oldCountries = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Country', identity: { enabled: false } })
  const $oldLanguages = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Languages', identity: { enabled: false } })
  const $oldYearsOfExperiences = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'YearsOfExperience', identity: { enabled: false } })
  const $oldQualifications = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Qualification', identity: { enabled: false } })
  const $oldIndustries = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Industry', identity: { enabled: false } })
  const $oldJobFields = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'JobFields', identity: { enabled: false } })

  var countries = [];
  var languages = [];
  var yearsOfExperiences = [];
  var qualifications = [];
  var industries = [];
  var jobFields = [];
  var jobSubFields = [];
 

  setTimeout(() => {
    site.getCountries({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (country) => {
      countries = country;
    })

    site.getCities({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (city) => {
      cities = city;
    })

    site.getLanguages({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (language) => {
      languages = language;
    })

    site.getYearsOfExperiences({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (yearsOfExperience) => {
      yearsOfExperiences = yearsOfExperience;
    })

    site.getQualifications({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (qualification) => {
      qualifications = qualification;
    })

    site.getIndustries({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (industry) => {
      industries = industry;
    })

    site.getJobFields({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (jobField) => {
      jobFields = jobField;
    })
    
    site.getJobSubFields({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (jobSubField) => {
      jobSubFields = jobSubField;
    })

  }, 1000 * 3);

  site.migrationCountries = function () {
    $oldCountries.findMany(
      {},
      (err, docs) => {
        if (!err && docs) {
          docs.forEach((_doc, i) => {
            site.addCountries({
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              }
            })
          });
        }
      }
    );
  };

  site.migrationCities = function () {
    $oldCountries.findMany(
      {},
      (err, docs) => {
        if (!err && docs) {


          if (countries) {

            docs.forEach((_doc) => {
              let country = countries.find((_country) => {
                return _country._id.toString() === _doc._id.toString();
              });

              if (_doc.subItems) {

                _doc.subItems.forEach(_c => {
                  site.addCities({
                    _id: _c._id,
                    active: _c.IsActive,
                    name_en: _c.Name ? _c.Name : _c.Name2,
                    name_ar: _c.Name2 ? _c.Name2 : _c.Name,
                    country: {
                      _id: country._id,
                      name_en: country.name_en,
                      name_ar: country.name_ar,
                      id: country.id,
                    },
                    add_user_info: {
                      date: _c.CreatedAt,
                    }
                  })
                });
              }

            });
          }
        }
      }
    );
  };

  site.migrationLanguages = function () {
    $oldLanguages.findMany(
      {},
      (err, docs) => {
        if (!err && docs) {
          docs.forEach((_doc, i) => {
            site.addLanguages({
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              }
            })
          });
        }
      }
    );
  };

  site.migrationYearsOfExperiences = function () {
    $oldYearsOfExperiences.findMany(
      {},
      (err, docs) => {
        if (!err && docs) {
          docs.forEach((_doc, i) => {
            site.addYearsOfExperience({
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              }
            })
          });
        }
      }
    );
  };

  site.migrationQualifications = function () {
    $oldQualifications.findMany(
      {},
      (err, docs) => {
        if (!err && docs) {
          docs.forEach((_doc, i) => {
            site.addQualifications({
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              }
            })
          });
        }
      }
    );
  };

  site.migrationIndustries = function () {
    $oldIndustries.findMany(
      {},
      (err, docs) => {
        if (!err && docs) {
          docs.forEach((_doc, i) => {
            site.addIndustries({
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              }
            })
          });
        }
      }
    );
  };

  site.migrationJobFields = function () {
    $oldJobFields.findMany(
      {},
      (err, docs) => {
        if (!err && docs) {
          docs.forEach((_doc, i) => {
            site.addJobFields({
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              }
            })
          });
        }
      }
    );
  };

  site.migrationJobSubFields = function () {
    $oldJobFields.findMany(
      {},
      (err, docs) => {
        if (!err && docs) {

          if (jobFields) {

            docs.forEach((_doc) => {
              let jobField = jobFields.find((_jobField) => {
                return _jobField._id.toString() === _doc._id.toString();
              });

              if (_doc.subItems) {

                _doc.subItems.forEach(_f => {
                  site.addJobSubFields({
                    _id: _f._id,
                    active: _f.IsActive,
                    name_en: _f.Name ? _f.Name : _f.Name2,
                    name_ar: _f.Name2 ? _f.Name2 : _f.Name,
                    job_field: {
                      _id: jobField._id,
                      name_en: jobField.name_en,
                      name_ar: jobField.name_ar,
                      id: jobField.id,
                    },
                    add_user_info: {
                      date: _f.CreatedAt,
                    }
                  })
                });
              }

            });
          }
        }
      }
    );
  };

  setTimeout(() => {
    // site.migrationCountries();
    // site.migrationCities();
    // site.migrationLanguages();
    // site.migrationYearsOfExperiences();
    // site.migrationQualifications();
    // site.migrationIndustries();
    // site.migrationJobFields();
    site.migrationJobSubFields();
  }, 1000 * 10);

}