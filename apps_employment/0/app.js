module.exports = function init(site) {
  function addZero(code, number) {
    let c = number - code.toString().length;
    for (let i = 0; i < c; i++) {
      code = '0' + code.toString();
    }
    return code;
  }

  var companies = [];
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
  var applies = [];
  var oldJobs = [];
  var oldJsAccount = [];

  var $oldCountries = null;
  var $oldLanguages = null;
  var $oldYearsOfExperiences = null;
  var $oldQualifications = null;
  var $oldIndustries = null;
  var $oldJobFields = null;
  var $oldJobSeekers = null;
  var $oldAccounts = null;
  var $oldCompanies = null;
  var $oldJobFairs = null;
  var $oldJobs = null;
  var $oldFavourites = null;
  var $oldApplies = null;
  var $job_fairs = null;

  site.migrationReady = function () {
    $oldCountries = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Country', identity: { enabled: false } });
    $oldLanguages = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Languages', identity: { enabled: false } });
    $oldYearsOfExperiences = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'YearsOfExperience', identity: { enabled: false } });
    $oldQualifications = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Qualification', identity: { enabled: false } });
    $oldIndustries = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Industry', identity: { enabled: false } });
    $oldJobFields = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'JobFields', identity: { enabled: false } });
    $oldJobSeekers = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'JobSeeker', identity: { enabled: false } });
    $oldAccounts = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'UserProfile', identity: { enabled: false } });
    $oldCompanies = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Company', identity: { enabled: false } });
    $oldJobFairs = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'JobFair', identity: { enabled: false } });
    $oldJobs = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Job', identity: { enabled: false } });
    $oldFavourites = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Favourite', identity: { enabled: false } });
    $oldApplies = site.connectCollection({ db: 'TawzeefMasrDB', collection: 'Apply', identity: { enabled: false } });
    $job_fairs = site.connectCollection('JobFairs');

    if (oldJobs.length === 0) {
      $oldJobs.findMany({ limit: 1000000 }, (err, jobs) => {
        oldJobs = jobs;
      });
    }

    if (oldJsAccount.length === 0) {
      $oldAccounts.findMany({ where: { Type: 3 }, limit: 1000000 }, (err, jsAccount) => {
        oldJsAccount = jsAccount;
      });
    }

    $oldFavourites.findMany({ limit: 1000000 }, (err, favourite) => {
      favourites = favourite;
    });

    $oldApplies.findMany({ limit: 1000000 }, (err, apply) => {
      applies = apply;
    });

    site.security.getUsers({ 'role.name': 'employer' }, (errEmployers, employer) => {
      employers = employer;
    });

    site.security.getUsers({ 'role.name': 'job_seeker' }, (errEmployers, job_seeker) => {
      jobSeekers = job_seeker;
    });

    site.getCompanies({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (cpmpany) => {
      companies = cpmpany;
    });

    site.getCountries({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (country) => {
      countries = country;
    });

    site.getCities({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (city) => {
      cities = city;
    });

    site.getLanguages({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (language) => {
      languages = language;
    });

    site.getYearsOfExperiences({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (yearsOfExperience) => {
      yearsOfExperiences = yearsOfExperience;
    });

    site.getQualifications({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (qualification) => {
      qualifications = qualification;
    });

    site.getIndustries({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (industry) => {
      industries = industry;
    });

    site.getJobFields({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (jobField) => {
      jobFields = jobField;
    });

    site.getJobSubFields({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (jobSubField) => {
      jobSubFields = jobSubField;
    });
  };

  site.migrationCountries = function () {
    $oldCountries.findMany({}, (err, docs) => {
      if (!err && docs) {
        docs.forEach((_doc, i) => {
          site.addCountries(
            {
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              },
            },
            (err, doc) => {
              console.log(err || 'Country : ' + doc.id);
            }
          );
        });
      }
    });
  };

  site.migrationCities = function () {
    $oldCountries.findMany({}, (err, docs) => {
      if (!err && docs) {
        if (countries) {
          docs.forEach((_doc) => {
            let country = countries.find((_country) => {
              return _country._id.toString() === _doc._id.toString();
            });

            if (_doc.subItems && country) {
              _doc.subItems.forEach((_c) => {
                site.addCities(
                  {
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
                    },
                  },
                  (err, doc) => {
                    console.log(err || 'City : ' + doc.id);
                  }
                );
              });
            }
          });
        }
      }
    });
  };

  site.migrationLanguages = function () {
    $oldLanguages.findMany({}, (err, docs) => {
      if (!err && docs) {
        docs.forEach((_doc, i) => {
          site.addLanguages(
            {
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              },
            },
            (err, doc) => {
              console.log(err || 'Language : ' + doc.id);
            }
          );
        });
      }
    });
  };

  site.migrationYearsOfExperiences = function () {
    $oldYearsOfExperiences.findMany({}, (err, docs) => {
      if (!err && docs) {
        docs.forEach((_doc, i) => {
          site.addYearsOfExperiences(
            {
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              },
            },
            (err, doc) => {
              console.log(err || 'Experience : ' + doc.id);
            }
          );
        });
      }
    });
  };

  site.migrationQualifications = function () {
    $oldQualifications.findMany({}, (err, docs) => {
      if (!err && docs) {
        docs.forEach((_doc, i) => {
          site.addQualifications(
            {
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              },
            },
            (err, doc) => {
              console.log(err || 'Qualification : ' + doc.id);
            }
          );
        });
      }
    });
  };

  site.migrationIndustries = function () {
    $oldIndustries.findMany({}, (err, docs) => {
      if (!err && docs) {
        docs.forEach((_doc, i) => {
          site.addIndustries(
            {
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              },
            },
            (err, doc) => {
              console.log(err || 'Industries : ' + doc.id);
            }
          );
        });
      }
    });
  };

  site.migrationJobFields = function () {
    $oldJobFields.findMany({}, (err, docs) => {
      if (!err && docs) {
        docs.forEach((_doc, i) => {
          site.addJobFields(
            {
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              },
            },
            (err, doc) => {
              console.log(err || 'JobFields : ' + doc.id);
            }
          );
        });
      }
    });
  };

  site.migrationJobSubFields = function () {
    $oldJobFields.findMany({}, (err, docs) => {
      if (!err && docs) {
        if (jobFields) {
          docs.forEach((_doc) => {
            let jobField = jobFields.find((_jobField) => {
              return _jobField._id.toString() === _doc._id.toString();
            });

            if (_doc.subItems && jobField) {
              _doc.subItems.forEach((_f) => {
                site.addJobSubFields(
                  {
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
                    },
                  },
                  (err, doc) => {
                    console.log(err || 'JobSubField : ' + doc.id);
                  }
                );
              });
            }
          });
        }
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
            password: _account.Email,
            active: _account.IsActive,
            first_name: _account.Name,
            last_name: _account.Name2,
            add_user_info: {
              date: _account.CreatedAt,
            },
          };
          if (_account.Type == 1) {
            account.role = {
              id: 1,
              name: 'admin',
              en: 'Admin',
              ar: 'مشرف',
            };
          } else if (_account.Type == 2) {
            account.role = {
              id: 2,
              name: 'employer',
              en: 'Employer',
              ar: 'صاحب عمل',
            };
            account.limited_companies = _account.IsEmployerLimitedCompanies || false;
            account.MyCompanies = _account.MyCompanies;
          }

          if (account.role && account.role.id) {
            site.security.addUser(account, (err, doc) => {
              console.log(err || 'user : ' + doc.id);
            });
          }
        });
      }
    });
  };

  site.migrationJobSeeker = function (_account, callback) {
    $oldJobSeekers.findMany({}, (err, jSeekers) => {
      if (!err && jSeekers) {
        jSeekers.forEach((_jSeeker, i) => {
          if (_account._id.toString() == _jSeeker.UserId.toString()) {
            let js = {
              userId: _account._id,
              _id: _jSeeker._id,
              active: _jSeeker.IsActive,
              email: _jSeeker.Email,
              about_me: _jSeeker.About,
              job_title: _jSeeker.JobTitle,
              password: _jSeeker.Phone || _jSeeker.Email,
              phone: _jSeeker.Phone,
              birthdate: _jSeeker.DOB,
              languages: [],
              educations_list: [],
              extra_curriculars_list: [],
              work_experience_list: [],
              certificates_list: [],
              short_list: [],
              website: _jSeeker.Website,
              linkedin: _jSeeker.SocialLinkedin,
              role: {
                id: 3,
                name: 'job_seeker',
                en: 'Job Seeker',
                ar: 'باحث عن عمل',
              },
              first_name: _jSeeker.Name,
              add_user_info: {
                date: _jSeeker.CreatedAt,
              },
            };

            if (_jSeeker.IdType == 1) {
              js.id_type == 'national_id';
            } else if (_jSeeker.IdType == 2) {
              js.id_type == 'passport';
            }

            if (_jSeeker.ProfilePicture) {
              js.image = {
                name: js._id,
                path: _jSeeker.ProfilePicture,
                url: '/api/old-path/ProfilePicture/' + _jSeeker.ProfilePicture,
                size: 1024,
              };
            }

            if (_jSeeker.CoverLetterFile) {
              js.upload_cover_letter = {
                name: js._id,
                path: _jSeeker.CoverLetterFile,
                url: '/api/old-path/CoverLetterFile/' + _jSeeker.CoverLetterFile,
                size: 1024,
              };
            }


            if (_jSeeker.ResumeFile) {
              js.upload_resume = {
                name: js._id,
                path: _jSeeker.ResumeFile,
                url: '/api/old-path/Resume/' + _jSeeker.ResumeFile,
                size: 1024,
              };
            }


            if (_jSeeker.Gender == 1 || _jSeeker.Gender == 0) {
              js.gender = {
                id: '1',
                en: 'Male',
                ar: 'ذكر',
              };
            } else if (_jSeeker.Gender == 2) {
              js.gender = {
                id: '2',
                en: 'Female',
                ar: 'أنثى',
              };
            }
            favourites.forEach((_f) => {
              for (let i = 0; i < employers.length; i++) {
                if (_f.UserId.toString() == employers[i]._id.toString() && _f.EntityId.toString() == js._id.toString() && _f.Type == 2) {
                  console.log('done Favourite');
                  js.short_list.push(employers[i].id);
                }
              }
            });

            if (_jSeeker.Languages && _jSeeker.Languages.length > 0) {
              for (let i = 0; i < _jSeeker.Languages.length; i++) {
                let language = languages.find((_language) => {
                  return _language._id.toString() === _jSeeker.Languages[i]._id.toString();
                });
                if (_jSeeker.Languages[i]._id.toString() == language._id.toString()) {
                  js.languages.push(language);
                }
              }
            }

            if (_jSeeker.Education && _jSeeker.Education.length > 0) {
              for (let i = 0; i < _jSeeker.Education.length; i++) {
                js.educations_list.push({
                  university_name: _jSeeker.Education[i].Name,
                  faculty_name: _jSeeker.Education[i].SubTitle,
                  joining_date: _jSeeker.Education[i].StartDate,
                  end_date: _jSeeker.Education[i].EndDate,
                  description: _jSeeker.Education[i].Description,
                });
              }
            }

            if (_jSeeker.ExtraCurricular && _jSeeker.ExtraCurricular.length > 0) {
              for (let i = 0; i < _jSeeker.ExtraCurricular.length; i++) {
                js.extra_curriculars_list.push({
                  organization_name: _jSeeker.ExtraCurricular[i].Name,
                  job_title: _jSeeker.ExtraCurricular[i].SubTitle,
                  joining_date: _jSeeker.ExtraCurricular[i].StartDate,
                  end_date: _jSeeker.ExtraCurricular[i].EndDate,
                  description: _jSeeker.ExtraCurricular[i].Description,
                });
              }
            }

            if (_jSeeker.WorkHistory && _jSeeker.WorkHistory.length > 0) {
              for (let i = 0; i < _jSeeker.WorkHistory.length; i++) {
                js.work_experience_list.push({
                  company_name: _jSeeker.WorkHistory[i].Name,
                  job_title: _jSeeker.WorkHistory[i].SubTitle,
                  joining_date: _jSeeker.WorkHistory[i].StartDate,
                  end_date: _jSeeker.WorkHistory[i].EndDate,
                  description: _jSeeker.WorkHistory[i].Description,
                });
              }
            }

            if (_jSeeker.Certification && _jSeeker.Certification.length > 0) {
              for (let i = 0; i < _jSeeker.Certification.length; i++) {
                js.certificates_list.push({
                  certificate_name: _jSeeker.Certification[i].Name,
                  certificate_date: _jSeeker.Certification[i].StartDate,
                  description: _jSeeker.Certification[i].Description,
                });
              }
            }

            if (_jSeeker.Qualification && _jSeeker.Qualification._id) {
              for (let i = 0; i < qualifications.length; i++) {
                if (qualifications[i]._id.toString() == _jSeeker.Qualification._id.toString()) {
                  js.qualification = qualifications[i];
                }
              }
            }

            if (_jSeeker.Country && _jSeeker.Country._id) {
              for (let i = 0; i < countries.length; i++) {
                if (countries[i]._id.toString() == _jSeeker.Country._id.toString()) {
                  js.country = countries[i];
                }
              }
            }

            if (_jSeeker.City && _jSeeker.City._id) {
              for (let i = 0; i < cities.length; i++) {
                if (cities[i]._id.toString() == _jSeeker.City._id.toString()) {
                  js.city = cities[i];
                }
              }
            }

            if (_jSeeker.Experience && _jSeeker.Experience._id) {
              for (let i = 0; i < yearsOfExperiences.length; i++) {
                if (yearsOfExperiences[i]._id.toString() == _jSeeker.Experience._id.toString()) {
                  js.experience = yearsOfExperiences[i];
                }
              }
            }

            site.security.addUser(js, (err, doc) => {
              console.log(err || 'JobSeeker : ' + doc.id);
              setTimeout(() => {
                callback();
              }, 100);
            });
          }
        });
      }
    });
  };

  site.migrationCompanies = function () {
    $oldCompanies.findMany({}, (err, docs) => {
      if (!err && docs) {
        docs.forEach((_company, i) => {
          let employer = {};

          for (let i = 0; i < employers.length; i++) {
            if (employers[i].MyCompanies) {
              employers[i].MyCompanies.forEach((_m) => {
                if (_m._id.toString() === _company._id.toString()) {
                  employer = employers[i];
                }
              });
            }
          }

          if (employer && employer.id) {
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

              add_user_info: {
                id: employer.id,
                email: employer.email,
                date: _company.CreatedAt,
                name: employer.email,
                name_ar: employer.email,
                name_en: employer.email,
              },
            };

            if (_company.CompanyLogo) {
              company.image = {
                name: company._id,
                path: _company.CompanyLogo,
                url: '/api/old-path/CompanyLogo/' + _company.CompanyLogo,
                size: 1024,
              };
            }

            if (_company.IsApproved) {
              company.approve = {
                id: 2,
                en: 'Been Approved',
                ar: 'تم الموافقة',
              };
            } else {
              company.approve = {
                id: 1,
                en: 'Pending Approval',
                ar: 'إنتظار الموافقة',
              };
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

            site.addCompanies(company, (err, doc) => {
              console.log(err || 'Company : ' + doc.id);
            });
          }
        });
      }
    });
  };

  site.migrationJobFairs = function () {
    $job_fairs.newCode = function (fair_id, user_id) {
      user_id = user_id || 'x';
      let y = new Date().getFullYear().toString().substr(2, 2);
      let d = new Date().getDate();
      return user_id + y + fair_id + addZero(d, 2) + addZero(fair_id, 4);
    };

    $oldJobFairs.findMany({}, (err, docs) => {
      if (!err && docs) {
        docs.forEach((_doc, i_doc) => {
          let jobFair = {
            _id: _doc._id,
            active: _doc.IsActive,
            name_en: _doc.Name ? _doc.Name : _doc.Name2,
            name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
            description: _doc.ShortDescription,
            field: _doc.Field,
            apply_list: [],
            event_date: _doc.EventDate,
            location: _doc.Location,
            site: _doc.IsOnline ? 'online' : 'offline',
            add_user_info: {
              date: _doc.CreatedAt,
            },
          };

          if (_doc.Registered && _doc.Registered.length > 0) {
            for (let i = 0; i < _doc.Registered.length; i++) {
              let js = jobSeekers.find((_js) => {
                return _doc.Registered[i].UserId && _js.userId.toString() === _doc.Registered[i].UserId.toString();
              });
              if (_doc.Registered[i] && js && _doc.Registered[i].UserId.toString() == js.userId.toString()) {
                jobFair.apply_list.push({
                  id: js.id,
                  code: $job_fairs.newCode(i_doc + 1, js.id),
                  first_name: js.first_name,
                  last_name: js.last_name,
                  email: js.email,
                  job_title: js.job_title,
                  is_attendance: _doc.Registered[i].IsAttendance,
                  apply_date: _doc.Registered[i].CreatedAt,
                });
              }
            }
          }

          site.addJobFairs(jobFair, (err, doc) => {
            console.log(err || 'JobFairs : ' + doc.id);
          });
        });
      }
    });
  };

  site.migrationJob = function (_job, callback) {
    let job = {
      _id: _job._id,
      active: _job.IsActive,
      job_title: _job.Name,
      favorite_list: [],
      application_list: [],
      job_responsibilities: _job.Description,
      job_seeker_received_benefits: _job.Benefits,
      job_required_skills: _job.Skills,
      application_deadline_date: _job.Deadline,
      full_address: _job.Address,
      salary: 0,
      add_user_info: {
        date: _job.CreatedAt,
      },
    };

    favourites.forEach((_f) => {
      for (let i = 0; i < jobSeekers.length; i++) {
        if (_f.UserId.toString() == jobSeekers[i].userId.toString() && _f.EntityId == job._id.toString() && _f.Type == 1) {
          job.favorite_list.push(jobSeekers[i].id);
        }
      }
    });

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

    if (_job.Company && _job.Company._id) {
      for (let i = 0; i < companies.length; i++) {
        if (companies[i]._id.toString() == _job.Company._id.toString()) {
          job.company = {
            _id: companies[i]._id,
            name_ar: companies[i].name_ar,
            name_en: companies[i].name_en,
            id: companies[i].id,
          };
        }
      }
    }

    applies.forEach((_a) => {
      for (let i = 0; i < jobSeekers.length; i++) {
        if (job.company && _a.JobSeeker.EntityId.toString() == jobSeekers[i]._id.toString() && _a.Job.EntityId == job.company._id.toString()) {
          job.application_list.push({
            user_id: jobSeekers[i].id,
            date: _a.CreatedAt,
            message: _a.Message,
            hire : _a.IsHired,
          });
        }
      }
    });

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

    site.addJobs(job, (err, doc) => {
      console.log(err || 'Job : ' + doc.id);
      setTimeout(() => {
        callback();
      }, 100);
    });
  };

  site.jobIndex = -1;
  site.migrationJobs = function () {
    site.jobIndex++;
    if (oldJobs.length > site.jobIndex) {
      site.migrationJob(oldJobs[site.jobIndex], () => {
        site.migrationJobs();
      });
    }
  };

  site.jobSeekerIndex = -1;
  site.migrationJobSeekers = function () {
    site.jobSeekerIndex++;
    if (oldJsAccount.length > site.jobSeekerIndex) {
      site.migrationJobSeeker(oldJsAccount[site.jobSeekerIndex], () => {
        site.migrationJobSeekers();
      });
    }
  };

  site.onPOST('x-api/migration/ready', (req, res) => {
    site.migrationReady();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/Countries', (req, res) => {
    site.migrationCountries();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/Cities', (req, res) => {
    site.migrationCities();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/Languages', (req, res) => {
    site.migrationLanguages();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/YearsOfExperiences', (req, res) => {
    site.migrationYearsOfExperiences();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/Qualifications', (req, res) => {
    site.migrationQualifications();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/Industries', (req, res) => {
    site.migrationIndustries();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/JobFields', (req, res) => {
    site.migrationJobFields();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/JobSubFields', (req, res) => {
    site.migrationJobSubFields();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/Accounts', (req, res) => {
    site.migrationAccounts();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/JobSeekers', (req, res) => {
    site.migrationJobSeekers();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/Companies', (req, res) => {
    site.migrationCompanies();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/JobFairs', (req, res) => {
    site.migrationJobFairs();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/Jobs', (req, res) => {
    site.migrationJobs();
    res.json({
      done: true,
    });
  });

  site.get({
    name: '/',
    path: __dirname + '/site_files',
    public: true,
  });

  site.post({ name: '/api/gender/all', public: true }, (req, res) => {
    let response = [
      {
        id: 1,
        en: 'Male',
        ar: 'ذكر',
      },
      {
        id: 2,
        en: 'Female',
        ar: 'أنثى',
      },
    ];

    if (site.manage_doc.undefined_gender_activation) {
      response.push({
        id: 3,
        en: 'Undefined',
        ar: 'غير محدد',
      });
    }

    res.json(response);
  });
};
