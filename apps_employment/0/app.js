module.exports = function init(site) {


  var countries = [];
  var languages = [];
  var yearsOfExperiences = [];
  var qualifications = [];
  var industries = [];
  var jobFields = [];
  var jobSubFields = [];
  var employers = [];
  var jobSeekers = [];
  var favourites = [];

  var $oldCountries = null;
  var $oldLanguages = null;
  var $oldYearsOfExperiences = null;
  var $oldQualifications = null;
  var $oldIndustries = null;
  var $oldJobFields = null;
  var $oldJobSeekers = null;
  var $oldAccounts = null;
  var $oldCompanies = null;
  var $oldJobs = null;
  var $oldFavourite = null;


  $oldCountries = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Country', identity: { enabled: false } })
  $oldLanguages = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Languages', identity: { enabled: false } })
  $oldYearsOfExperiences = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'YearsOfExperience', identity: { enabled: false } })
  $oldQualifications = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Qualification', identity: { enabled: false } })
  $oldIndustries = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Industry', identity: { enabled: false } })
  $oldJobFields = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'JobFields', identity: { enabled: false } })
  $oldJobSeekers = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'JobSeeker', identity: { enabled: false } })
  $oldAccounts = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'UserProfile', identity: { enabled: false } });
  $oldCompanies = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Company', identity: { enabled: false } });
  $oldJobs = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Job', identity: { enabled: false } });
  $oldFavourite = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Favourite', identity: { enabled: false } });

  setTimeout(() => {

    $oldFavourite.findMany({ limit: 1000000 }, (err, favourite) => {
      favourites = favourite;
    });

    site.security.getUsers({ 'role.name': 'employer' }, (errEmployers, employer) => {
      employers = employer;
    });

    site.security.getUsers({ 'role.name': 'job_seeker' }, (errEmployers, job_seeker) => {
      jobSeekers = job_seeker;
    });

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
            },
              (err, doc) => {
                console.log(err || 'Country : ' + doc.id);
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
                  },
                    (err, doc) => {
                      console.log(err || 'City : ' + doc.id);
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
            },
              (err, doc) => {
                console.log(err || 'Language : ' + doc.id);
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
            },
              (err, doc) => {
                console.log(err || 'Experience : ' + doc.id);
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
            },
              (err, doc) => {
                console.log(err || 'Qualification : ' + doc.id);
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
            },
              (err, doc) => {
                console.log(err || 'Industries : ' + doc.id);
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
            },
              (err, doc) => {
                console.log(err || 'JobFields : ' + doc.id);
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
                  },
                    (err, doc) => {
                      console.log(err || 'JobSubField : ' + doc.id);
                    })
                });
              }

            });
          }
        }
      }
    );
  };

  site.migrationJobSeekers = function () {
    $oldJobSeekers.findMany({}, (err, accounts) => {
      if (!err && accounts) {
        accounts.forEach((_account, i) => {
          let account = {
            _id: _account._id,
            active: _account.IsActive,
            email: _account.Email,
            about_me: _account.About,
            job_title: _account.JobTitle,
            password: '12345',
            phone: _account.Phone,
            birthdate: _account.DOB,
            languages: [],
            educations_list: [],
            extra_curriculars_list: [],
            work_experience_list: [],
            certificates_list: [],
            website: _account.Website,
            linkedin: _account.SocialLinkedin,
            role: {
              id: 3,
              name: "job_seeker",
              en: "Job Seeker",
              ar: "باحث عن عمل"
            },
            first_name: _account.Name,
            add_user_info: {
              date: _account.CreatedAt,
            },
          };

          if (_account.IdType == 1) {
            account.id_type == 'national_id';
          } else if (_account.IdType == 2) {
            account.id_type == 'passport';
          }

          if (_account.Gender == 1 || _account.Gender == 0) {
            account.gender = {
              id: '1',
              en: 'Male',
              ar: 'ذكر',
            };
          } else if (_account.Gender == 2) {
            account.gender = {
              id: '2',
              en: 'Female',
              ar: 'أنثى',
            };
          }

          if (_account.Languages && _account.Languages.length > 0) {


            for (let i = 0; i < _account.Languages.length; i++) {
              let language = languages.find((_language) => {
                return _language._id.toString() === _account.Languages[i]._id.toString();
              });
              if (_account.Languages[i]._id.toString() == language._id.toString()) {
                account.languages.push(language);
              }
            }
          }

          if (_account.Education && _account.Education.length > 0) {


            for (let i = 0; i < _account.Education.length; i++) {

              account.educations_list.push({
                university_name: _account.Education[i].Name,
                faculty_name: _account.Education[i].SubTitle,
                joining_date: _account.Education[i].StartDate,
                end_date: _account.Education[i].EndDate,
                description: _account.Education[i].Description,
              });

            }
          }

          if (_account.ExtraCurricular && _account.ExtraCurricular.length > 0) {


            for (let i = 0; i < _account.ExtraCurricular.length; i++) {

              account.extra_curriculars_list.push({
                organization_name: _account.ExtraCurricular[i].Name,
                job_title: _account.ExtraCurricular[i].SubTitle,
                joining_date: _account.ExtraCurricular[i].StartDate,
                end_date: _account.ExtraCurricular[i].EndDate,
                description: _account.ExtraCurricular[i].Description,
              });

            }
          }

          if (_account.WorkHistory && _account.WorkHistory.length > 0) {


            for (let i = 0; i < _account.WorkHistory.length; i++) {

              account.work_experience_list.push({
                company_name: _account.WorkHistory[i].Name,
                job_title: _account.WorkHistory[i].SubTitle,
                joining_date: _account.WorkHistory[i].StartDate,
                end_date: _account.WorkHistory[i].EndDate,
                description: _account.WorkHistory[i].Description,
              });

            }
          }

          if (_account.Certification && _account.Certification.length > 0) {

            for (let i = 0; i < _account.Certification.length; i++) {

              account.certificates_list.push({
                certificate_name: _account.Certification[i].Name,
                certificate_date: _account.Certification[i].StartDate,
                description: _account.Certification[i].Description,
              });

            }
          }

          if (_account.Qualification && _account.Qualification._id) {
            for (let i = 0; i < qualifications.length; i++) {
              if (qualifications[i]._id.toString() == _account.Qualification._id.toString()) {
                account.qualification = qualifications[i];
              }
            }
          }

          if (_account.Country && _account.Country._id) {
            for (let i = 0; i < countries.length; i++) {
              if (countries[i]._id.toString() == _account.Country._id.toString()) {
                account.country = countries[i];
              }
            }
          }

          if (_account.City && _account.City._id) {
            for (let i = 0; i < cities.length; i++) {
              if (cities[i]._id.toString() == _account.City._id.toString()) {
                account.city = cities[i];
              }
            }
          }

          if (_account.Experience && _account.Experience._id) {
            for (let i = 0; i < yearsOfExperiences.length; i++) {
              if (yearsOfExperiences[i]._id.toString() == _account.Experience._id.toString()) {
                account.experience = yearsOfExperiences[i];
              }
            }
          }

          site.security.addUser(account, (err, doc) => {
            console.log(err || 'Trainee : ' + doc.id);
          });
        });
      }
    });
  };

  site.migrationAccounts = function () {
    $oldAccounts.findMany({}, (err, accounts) => {
      if (!err && accounts) {
        accounts.forEach((_account, i) => {
          let account = {
            _id: _account._id,
            email: _account.Email,
            password: '12345',
            active: _account.IsActive,
            first_name: _account.Name,
            last_name: _account.Name2,
            add_user_info: {
              date: _account.CreatedAt,
            }
          };

          if (_account.Type == 1) {
            account.role = {
              id: 1,
              name: "admin",
              en: "Admin",
              ar: "مشرف"
            };
          } else if (_account.Type == 2) {
            account.role = {
              id: 2,
              name: "employer",
              en: "Employer",
              ar: "صاحب عمل"
            };
          }

          site.security.addUser(account, (err, doc) => {
            console.log(err || 'user : ' + doc.id);
          });
        });
      }
    });
  };

  site.migrationCompanies = function () {

    $oldCompanies.findMany(
      {},
      (err, docs) => {
        if (!err && docs) {
          docs.forEach((_company, i) => {
            let employer = null;
            for (let i = 0; i < employers.length; i++) {
              if (employers[i].MyCompanies) {
                employer = employers[i].MyCompanies.find((_employer) => {
                  return _employer._id.toString() === _company._id.toString();
                });
              }

            }

            if (employer) {
              let company = {
                _id: _company._id,
                active: _company.IsActive,
                name_en: _company.Name ? _company.Name : _company.Name2,
                name_ar: _company.Name2 ? _company.Name2 : _company.Name,
                email_address: _company.Email,
                website_address: _company.Website,
                about_company: _company.About,
                facebook: _company.SocialFacebook,
                twitter: _company.SocialTwitter,
                linkedin: _company.SocialLinkedin,
                google_plus: _company.SocialGooglePlus,
                full_address: _company.Address,
                phone: _company.Phone,
                est_since: _company.Establish,
                approve: {
                  id: 2,
                  en: 'Been Approved',
                  ar: 'تم الموافقة',
                },
                add_user_info: {
                  id: employer.id,
                  email: employer.email,
                  date: _company.CreatedAt,
                  name: employer.email,
                  name_ar: employer.email,
                  name_en: employer.email,
                }
              }

              if (_company.Industry && _company.Industry._id) {
                for (let i = 0; i < industries.length; i++) {
                  if (industries[i]._id.toString() == _company.Industry._id.toString()) {
                    company.industry = industries[i];
                  }
                }
              }

              if (_company.Country && _company.Country._id) {
                for (let i = 0; i < countries.length; i++) {
                  if (countries[i]._id.toString() == _company.Country._id.toString()) {
                    company.country = countries[i];
                  }
                }
              }

              if (_company.City && _company.City._id) {
                for (let i = 0; i < cities.length; i++) {
                  if (cities[i]._id.toString() == _company.City._id.toString()) {
                    company.city = cities[i];
                  }
                }
              }
              

              site.addCompanies(
                company,
                (err, doc) => {
                  console.log(err || 'Company : ' + doc.id);
                })
            }
          });
        }
      }
    );
  };

  site.migrationJobs = function () {
    $oldJobs.findMany({}, (err, docs) => {
      if (!err && docs) {
        docs.forEach((_job, i) => {
          let job = {
            _id: _job._id,
            active: _job.IsActive,
            name_en: _job.Name ? _job.Name : _job.Name2,
            name_ar: _job.Name2 ? _job.Name2 : _job.Name,
            job_title: _job.Name,
            favorite_list : [],
            job_responsibilities: _job.Description,
            job_seeker_received_benefits: _job.Benefits,
            job_required_skills: _job.Skills,
            application_deadline_date: _job.Deadline,
            full_address : _job.Address,
            salary: 0,
            add_user_info: {
              date: _job.CreatedAt,
            },
          };

          for (let i = 0; i < jobSeekers.length; i++) {
            favourites.forEach(_f => {
              if(_f.UserId == jobSeekers[i]._id.toString() && _f.EntityId == jobSeekers[i]._id.toString()) {
                job.favorite_list.push(jobSeekers[i].id)
              }
            });
          }

          if (_job.Qualification && _job.Qualification._id) {
            for (let i = 0; i < qualifications.length; i++) {
              if (qualifications[i]._id.toString() == _job.Qualification._id.toString()) {
                job.qualification = qualifications[i];
              }
            }
          }

          if (_job.Industry && _job.Industry._id) {
            for (let i = 0; i < industries.length; i++) {
              if (industries[i]._id.toString() == _job.Industry._id.toString()) {
                job.industry = industries[i];
              }
            }
          }

          if (_job.JobField && _job.JobField._id) {
            for (let i = 0; i < jobFields.length; i++) {
              if (jobFields[i]._id.toString() == _job.JobField._id.toString()) {
                job.job_field = jobFields[i];
              }
            }
          }

          if (_job.JobSubField && _job.JobSubField._id) {
            for (let i = 0; i < jobSubFields.length; i++) {
              if (jobSubFields[i]._id.toString() == _job.JobSubField._id.toString()) {
                job.job_subfield = jobSubFields[i];
              }
            }
          }

          if (_job.Country && _job.Country._id) {
            for (let i = 0; i < countries.length; i++) {
              if (countries[i]._id.toString() == _job.Country._id.toString()) {
                job.country = countries[i];
              }
            }
          }

          if (_job.City && _job.City._id) {
            for (let i = 0; i < cities.length; i++) {
              if (cities[i]._id.toString() == _job.City._id.toString()) {
                job.city = cities[i];
              }
            }
          }

          if (_job.Experience && _job.Experience._id) {
            for (let i = 0; i < yearsOfExperiences.length; i++) {
              if (yearsOfExperiences[i]._id.toString() == _job.Experience._id.toString()) {
                job.years_of_experience = yearsOfExperiences[i];
              }
            }
          }

          site.addJobs(
            job,
            (err, doc) => {
              console.log(err || 'Job : ' + doc.id);
            }
          );
        });
      }
    });
  };

  setTimeout(() => {
    // site.migrationCountries();
    // site.migrationCities();
    // site.migrationLanguages();
    // site.migrationYearsOfExperiences(); 
    // site.migrationQualifications();
    // site.migrationIndustries();
    // site.migrationJobFields();
    // site.migrationJobSubFields();
    // site.migrationJobSeekers();
    //  site.migrationAccounts();
    // site.migrationCompanies();
    // site.migrationJobs();
  }, 1000 * 10);

  site.get({
    name: '/',
    path: __dirname + '/site_files',
    public: true
  })

  site.post({ name: '/api/gender/all', public: true }, (req, res) => {

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

}