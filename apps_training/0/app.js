module.exports = function init(site) {
  var trainingCategories = [];
  var Trainers = [];
  var Trainees = [];
  var partners = [];
  var sub_partners = [];
  var countries = [];
  var cities = [];
  var trainingCenters = [];
  var examTemplates = [];
  var trainingTypes = [];
  var questions = [];
  var oldExams = [];
  var oldTrainings = [];

  var $trainings = null;
  var $oldCountries = null;
  var $oldTrainingTypes = null;
  var $oldTrainingCategories = null;
  var $oldPartners = null;
  var $oldSubPartners = null;
  var $oldExamTemplates = null;
  var $oldQuestion = null;
  var $oldAccounts = null;
  var $oldTrainees = null;
  var $oldTrainings = null;
  var $oldExams = null;

  var daysList = [
    {
      id: 1,
      code: 0,
      name: 'sunday',
      en: 'Sunday',
      ar: 'الأحد',
    },
    {
      id: 2,
      code: 1,
      name: 'monday',
      en: 'Monday',
      ar: 'الإثنين',
    },
    {
      id: 3,
      code: 2,
      name: 'tuesday',
      en: 'Tuesday',
      ar: 'الثلاثاء',
    },
    {
      id: 4,
      code: 3,
      name: 'wednesday',
      en: 'Wednesday',
      ar: 'الأربعاء',
    },
    {
      id: 5,
      code: 4,
      name: 'thursday',
      en: 'Thursday',
      ar: 'الخميس',
    },
    {
      id: 6,
      code: 5,
      name: 'friday',
      en: 'Friday',
      ar: 'الجمعة',
    },
    {
      id: 7,
      code: 6,
      name: 'saturday',
      en: 'Saturday',
      ar: 'السبت',
    },
  ];

  site.migrationReady = function () {
    $trainings = site.connectCollection('Trainings');

    $oldCountries = site.connectCollection({ db: 'Tadrebat', collection: 'City', identity: { enabled: false } });
    $oldTrainingTypes = site.connectCollection({ db: 'Tadrebat', collection: 'TrainingType', identity: { enabled: false } });
    $oldTrainingCategories = site.connectCollection({ db: 'Tadrebat', collection: 'TrainingCategory', identity: { enabled: false } });
    $oldPartners = site.connectCollection({ db: 'Tadrebat', collection: 'EntityPartner', identity: { enabled: false } });
    $oldSubPartners = site.connectCollection({ db: 'Tadrebat', collection: 'EntitySubPartner', identity: { enabled: false } });
    $oldExamTemplates = site.connectCollection({ db: 'Tadrebat', collection: 'ExamTemplate', identity: { enabled: false } });
    $oldQuestion = site.connectCollection({ db: 'Tadrebat', collection: 'Question', identity: { enabled: false } });
    $oldAccounts = site.connectCollection({ db: 'Tadrebat', collection: 'UserProfile', identity: { enabled: false } });
    $oldTrainees = site.connectCollection({ db: 'Tadrebat', collection: 'Trainee', identity: { enabled: false } });
    $oldTrainings = site.connectCollection({ db: 'Tadrebat', collection: 'Training', identity: { enabled: false } });
    $oldExams = site.connectCollection({ db: 'Tadrebat', collection: 'Exam', identity: { enabled: false } });

    if (oldExams.length === 0) {
      $oldExams.findMany({ limit: 1000000 }, (err, exams) => {
        oldExams = exams;
        console.log('old exams : ' + oldExams.length);
      });
    }

    if (oldTrainings.length === 0) {
      $oldTrainings.findMany({ limit: 1000000 }, (err, trainings) => {
        oldTrainings = trainings;
        console.log('old Trainings : ' + oldTrainings.length);
      });
    }

    site.getTrainingCategories({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (tc) => {
      trainingCategories = tc;
      console.log('getTrainingCategories');
    });

    site.security.getUsers({ 'role.name': 'trainer' }, (errTrainers, Trainer) => {
      Trainers = Trainer;
      console.log('getUsers trainer');
    });

    site.security.getUsers({ 'role.name': 'trainee' }, (errTrainees, Trainee) => {
      Trainees = Trainee;
      console.log('getUsers trainee');
    });

    site.getPartners({ where: {} }, (partner) => {
      partners = partner;
      console.log('getPartners');
    });

    site.getSubPartners({ where: {}, select: { id: 1, name_ar: 1, name_en: 1, partners_list: 1, TrainingCenterIds: 1 } }, (sub_partner) => {
      sub_partners = sub_partner;
      console.log('getSubPartners');
    });

    site.getCountries({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (country) => {
      countries = country;
      console.log('getCountries');
    });

    site.getCities({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (city) => {
      cities = city;
      console.log('getCities');
    });

    site.getQuestions({ where: {}, select: { id: 1, name: 1, answers_list: 1 } }, (question) => {
      questions = question;
      console.log('getQuestions');
    });

    site.getTrainingCenter({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (trainingCenter) => {
      trainingCenters = trainingCenter;
      console.log('getTrainingCenter');
    });

    site.getExamTemplates({ where: {} }, (examTemplate) => {
      examTemplates = examTemplate;
      console.log('getExamTemplates');
    });

    site.getTrainingTypes({ where: {}, select: { id: 1, name_ar: 1, name_en: 1 } }, (trainingType) => {
      trainingTypes = trainingType;
      console.log('getTrainingTypes');
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

            if (_doc.areas) {
              _doc.areas.forEach((_area) => {
                site.addCities(
                  {
                    _id: _area._id,
                    active: _area.IsActive,
                    name_en: _area.Name ? _area.Name : _area.Name2,
                    name_ar: _area.Name2 ? _area.Name2 : _area.Name,
                    country: {
                      _id: country._id,
                      name_en: country.name_en,
                      name_ar: country.name_ar,
                      id: country.id,
                    },
                    add_user_info: {
                      date: _area.CreatedAt,
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

  site.migrationTrainingTypes = function () {
    $oldTrainingTypes.findMany({}, (err, docs, count) => {
      if (!err && docs) {
        docs.forEach((_doc, i) => {
          site.addTrainingTypes(
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
              console.log(err || 'TrainingType : ' + doc.id);
            }
          );
        });
      }
    });
  };

  site.migrationTrainingCategories = function () {
    $oldTrainingCategories.findMany({}, (err, docs) => {
      if (!err && docs) {
        if (trainingTypes) {
          docs.forEach((_doc) => {
            if (_doc.TrainingTypeId) {
              let trainingType = trainingTypes.find((_t) => {
                return _t._id.toString() === _doc.TrainingTypeId.toString();
              });

              site.addTrainingCategories(
                {
                  _id: _doc._id,
                  active: _doc.IsActive,
                  name_en: _doc.Name ? _doc.Name : _doc.Name2,
                  name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
                  training_type: {
                    _id: trainingType._id,
                    name_en: trainingType.name_en,
                    name_ar: trainingType.name_ar,
                    id: trainingType.id,
                  },
                  add_user_info: {
                    date: _doc.CreatedAt,
                  },
                },
                (err, doc) => {
                  console.log(err || 'TrainingCategory : ' + doc.id);
                }
              );
            }
          });
        }
      }
    });
  };

  site.migrationExamTemplates = function () {
    $oldExamTemplates.findMany({}, (err, docs, count) => {
      if (!err && docs) {
        docs.forEach((_doc, i) => {
          site.addExamTemplates(
            {
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name,
              name_ar: _doc.Name,
              easy: _doc.Easy,
              medium: _doc.Medium,
              hard: _doc.Hard,
              add_user_info: {
                date: _doc.CreatedAt,
              },
            },
            (err, doc) => {
              console.log(err || 'ExamTemplate : ' + doc.id);
            }
          );
        });
      }
    });
  };

  site.migrationQuestion = function () {
    $oldQuestion.findMany({}, (err, docs) => {
      if (!err && docs) {
        if (trainingTypes) {
          if (trainingCategories) {
            docs.forEach((_doc) => {
              let trainingType = trainingTypes.find((_t) => {
                return _t._id.toString() === _doc.TrainingTypeId.toString();
              });

              let trainingCategory = trainingCategories.find((_c) => {
                return _c._id.toString() === _doc.TrainingCategoryId.toString();
              });

              let question = {
                _id: _doc._id,
                active: _doc.IsActive,
                name: _doc.Name,
                training_type: trainingType,
                training_category: trainingCategory,
                answers_list: [],
                add_user_info: {
                  date: _doc.CreatedAt,
                },
              };

              if (_doc.Difficulty == 1) {
                question.difficulty = {
                  id: 1,
                  ar: 'سهل',
                  en: 'Easy',
                };
              } else if (_doc.Difficulty == 2) {
                question.difficulty = {
                  id: 2,
                  ar: 'متوسط',
                  en: 'Medium',
                };
              } else if (_doc.Difficulty == 3) {
                question.difficulty = {
                  id: 3,
                  ar: 'صعب',
                  en: 'Hard',
                };
              }
              if (_doc.Answer && _doc.Answer.length > 0) {
                for (let i = 0; i < _doc.Answer.length; i++) {
                  question.answers_list.push({
                    id: _doc.Answer[i]._id,
                    answer: _doc.Answer[i].Name,
                    correct: _doc.Answer[i].IsCorrectAnswer,
                    create_date: _doc.Answer[i].CreatedAt,
                    active: _doc.Answer[i].IsActive,
                  });
                }
              }

              site.addQuestions(question, (err, doc) => {
                console.log(err || 'question : ' + doc.id);
              });
            });
          }
        }
      }
    });
  };

  site.migrationPartners = function () {
    $oldPartners.findMany({}, (err, docs, count) => {
      if (!err && docs) {
        docs.forEach((_doc, i) => {
          site.addPartners(
            {
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name,
              name_ar: _doc.Name,
              min_hours: _doc.MinHours,
              max_hours: _doc.MaxHours,
              phone: _doc.Phone,
              add_user_info: {
                date: _doc.CreatedAt,
              },
            },
            (err, doc) => {
              console.log(err || 'Partner : ' + doc.id);
            }
          );
        });
      }
    });
  };

  site.migrationSubPartners = function () {
    $oldSubPartners.findMany({}, (err, docs) => {
      if (!err && docs) {
        if (partners) {
          docs.forEach((_doc) => {
            let subPartner = {
              _id: _doc._id,
              active: _doc.IsActive,
              phone: _doc.Phone,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              partners_list: [],
              TrainingCenterIds: _doc.TrainingCenterIds,
              add_user_info: {
                date: _doc.CreatedAt,
              },
            };

            if (_doc.PartnerIds && _doc.PartnerIds.length > 0) {
              _doc.PartnerIds.forEach((_partnerId) => {
                let partner = partners.find((_partner) => {
                  return _partner._id.toString() === _partnerId.toString();
                });
                subPartner.partners_list.push({
                  name_ar: partner.name_ar,
                  name_en: partner.name_en,
                  phone: partner.phone,
                  id: partner.id,
                  _id: partner._id,
                });
              });
            }

            site.addSubPartners(subPartner, (err, doc) => {
              console.log(err || 'subPartner : ' + doc.id);
            });
          });
        }
      }
    });
  };

  site.migrationTrainingCenter = function () {
    $oldPartners.findMany({}, (err, oldPartners, count) => {
      if (!err && oldPartners) {
        oldPartners.forEach((_doc) => {
          _doc.TrainingCenters.forEach((_trainingC) => {
            let trainingCenter = {
              _id: _trainingC._id,
              active: _trainingC.IsActive,
              name_en: _trainingC.Name,
              name_ar: _trainingC.Name,
              phone: _trainingC.Phone,
              add_user_info: {
                date: _trainingC.CreatedAt,
              },
            };

            sub_partners.forEach((sub_partner) => {
              sub_partner.TrainingCenterIds = sub_partner.TrainingCenterIds || [];
              sub_partner.TrainingCenterIds.forEach((_tcId) => {
                if (_tcId.toString() == _trainingC._id.toString()) {
                  trainingCenter.sub_partner = {
                    _id: sub_partner._id,
                    name_ar: sub_partner.name_ar,
                    name_en: sub_partner.name_en,
                    partners_list: sub_partner.partners_list,
                    id: sub_partner.id,
                  };
                }
              });
            });

            site.addTrainingCenter(trainingCenter, (err, doc) => {
              console.log(err || 'TrainingCenter : ' + doc.id);
            });
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
            partners_list: [],
            message: _account.TrainerTrainingDetails,
            add_user_info: {
              date: _account.CreatedAt,
            },
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
              name: "partner",
              en: "Partner",
              ar: "شريك"
            };
          } else if (_account.Type == 3) {
            account.role = {
              id: 3,
              name: "sub_partner",
              en: "Sub Partner",
              ar: "شريك ثانوي"
            };
          } else if (_account.Type == 4) {
            account.role = {
              id: 4,
              name: "trainer",
              en: "Trainer",
              ar: "مدرب"
            };
          }

          if (_account.MyPartnerListIds) {
            _account.MyPartnerListIds.forEach((_partner) => {
              for (let i = 0; i < partners.length; i++) {
                if (partners[i]._id.toString() == _partner.toString()) {
                  account.partners_list.push({ partner: partners[i] });
                }
              }
            });
          }

          if (_account.MySubPartnerListIds) {
            _account.MySubPartnerListIds.forEach((_subPartner) => {
              for (let i = 0; i < sub_partners.length; i++) {
                if (sub_partners[i]._id.toString() == _subPartner.toString()) {
                  account.partners_list.forEach((_p) => {
                    if (sub_partners[i].partners_list && _p.partner && sub_partners[i].partners_list.some((p) => p._id.toString() == _p.partner._id.toString())) {
                      _p.sub_partners = _p.sub_partners || [];
                      _p.sub_partners.push({
                        _id: sub_partners[i]._id,
                        id: sub_partners[i].id,
                        name_ar: sub_partners[i].name_ar,
                        name_en: sub_partners[i].name_en,
                      });
                    }
                  });
                }
              }
            });
          }

          if (_account.CityId) {
            for (let i = 0; i < countries.length; i++) {
              if (countries[i]._id.toString() == _account.CityId.toString()) {
                account.country = countries[i];
              }
            }
          }

          if (_account.AreaId) {
            for (let i = 0; i < cities.length; i++) {
              if (cities[i]._id.toString() == _account.AreaId.toString()) {
                account.city = cities[i];
              }
            }
          }

          site.security.addUser(account, (err, doc) => {
            console.log(err || 'user : ' + doc.id);
          });
        });

      }
    });
  };

  site.migrationTrainees = function () {
    $oldTrainees.findMany({}, (err, accounts) => {
      if (!err && accounts) {
        accounts.forEach((_account, i) => {
          let account = {
            _id: _account._id,
            active: _account.IsActive,
            email: _account.Email,
            mobile: _account.Mobile,
            password: '12345',
            id_number: _account.NationalId,
            birthdate: _account.DOB,
            role: {
              id: 5,
              name: "trainee",
              en: "Trainee",
              ar: "متدرب"
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

          if (_account.Gender == 1) {
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

          if (_account.CityId) {
            for (let i = 0; i < countries.length; i++) {
              if (countries[i]._id.toString() == _account.CityId.toString()) {
                account.country = countries[i];
              }
            }
          }

          if (_account.AreaId) {
            for (let i = 0; i < cities.length; i++) {
              if (cities[i]._id.toString() == _account.AreaId.toString()) {
                account.city = cities[i];
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

  site.migrationTraining = function (_training, callback) {
    let training = {
      _id: _training._id,
      active: _training.IsActive,
      start_date: _training.StartDate,
      end_date: _training.EndDate,
      location: _training.IsOnline ? 'online' : 'offline',
      approve: _training.IsAdminApproved,
      days: [],
      trainees_list: [],
      add_user_info: {
        date: _training.CreatedAt,
      },
    };

    if (_training.Type == 1) {
      training.privacy_type = {
        id: 1,
        name: 'public',
        en: 'Public',
        ar: 'عام',
      };
    } else if (_training.Type == 2) {
      training.privacy_type = {
        id: 2,
        name: 'private',
        en: 'Private',
        ar: 'خاص',
      };
    }

    _training.days.forEach((_d, i) => {
      if (_d == 0) {
        training.days.push(daysList[0]);
      } else if (_d == 1) {
        training.days.push(daysList[1]);
      } else if (_d == 2) {
        training.days.push(daysList[2]);
      } else if (_d == 3) {
        training.days.push(daysList[3]);
      } else if (_d == 4) {
        training.days.push(daysList[4]);
      } else if (_d == 5) {
        training.days.push(daysList[5]);
      } else if (_d == 6) {
        training.days.push(daysList[6]);
      } else if (_d == 7) {
        training.days.push(daysList[7]);
      }
    });

    training.dates_list = [];
    training.days.forEach((_d) => {
      let startDate = new Date(training.start_date);
      let endDate = new Date(training.end_date);
      if (_d && _d.code > startDate.getDay()) {
        startDate.setTime(startDate.getTime() + (_d.code - startDate.getDay()) * 24 * 60 * 60 * 1000);
      } else if (_d && _d.code < startDate.getDay()) {
        startDate.setTime(startDate.getTime() + (7 - startDate.getDay() + _d.code) * 24 * 60 * 60 * 1000);
      }
      if (startDate.setHours(0, 0, 0, 0) <= endDate.setHours(0, 0, 0, 0)) {
        training.dates_list.push({ date: new Date(startDate), day: _d, trainees_list: [] });
      }

      while (startDate <= endDate) {
        startDate.setTime(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        if (startDate.setHours(0, 0, 0, 0) <= endDate.setHours(0, 0, 0, 0)) {
          training.dates_list.push({ date: new Date(startDate), day: _d, trainees_list: [] });
        }
      }
    });

    training.dates_list.sort((a, b) => a.date.getTime() - b.date.getTime());

    _training.Trainees.forEach((_t) => {
      let trainee = Trainees.find((_train) => {
        return _train._id.toString() == _t._Id.toString();
      });

      if (trainee) {
        let exam = oldExams.find((_exam) => {
          return _exam.TrainingId.toString() == _training._id.toString() && _exam.TraineeId.toString() == trainee._id.toString();
        });

        let trainee_obj = {
          _id: trainee._id,
          id: trainee.id,
          first_name: trainee.first_name,
          email: trainee.email,
          mobile: trainee.mobile,
          id_number: trainee.id_number,
          approve: _t.IsApproved,
        };

        if (exam) {
          trainee_obj.exam_questions_list = [];

          for (let i = 0; i < exam.ExamTemplate.length; i++) {
            let question = questions.find((_question) => {
              return _question._id.toString() == exam.ExamTemplate[i]._id.toString();
            });
            question.answers_list.forEach((_a) => {
              if (exam.ExamTemplate[i].SelectedAnswer && exam.ExamTemplate[i].SelectedAnswer.toString() == _a.id.toString()) {
                _a.trainee_answer = true;
              }
            });

            trainee_obj.exam_questions_list.push(question);
          }

          trainee_obj.start_exam_count = 1;
          trainee_obj.trainee_degree = exam.Score;
          trainee_obj.finish_exam = exam.IsPass;
          trainee_obj.certificate = {};
        }

        training.trainees_list.push(trainee_obj);
      }
    });

    for (let i = 0; i < _training.Sessions.length; i++) {
      let session = _training.Sessions[i];
      _training.Attendances.forEach((_attend) => {
        if (session._id.toString() == _attend.SessionId.toString()) {
          training.dates_list.forEach((_d) => {
            if (
              new Date(_d.date).getDay() == new Date(session.Day).getDay() &&
              new Date(_d.date).getMonth() == new Date(session.Day).getMonth() &&
              new Date(_d.date).getFullYear() == new Date(session.Day).getFullYear()
            ) {
              _attend.Attendances.forEach((_a) => {
                let train = Trainees.find((_train) => {
                  return _train._id.toString() == _a.TraineeId.toString();
                });
                if (train) {
                  _d.trainees_list.push({
                    _id: train._id,
                    id: train.id,
                    first_name: train.first_name,
                    email: train.email,
                    attend: _a.IsAttendant,
                  });
                }
              });
            }
          });
        }
      });
    }

    if ((Trainer = Trainers.find((p) => p._id.toString() == _training.TrainerId.toString()))) {
      training.trainer = Trainer;
    }

    if ((trainingType = trainingTypes.find((p) => p._id.toString() == _training.TrainingTypeId.toString()))) {
      training.training_type = trainingType;
    }

    if ((trainingCategorie = trainingCategories.find((p) => p._id.toString() == _training.TrainingCategoryId.toString()))) {
      training.training_category = trainingCategorie;
    }

    if ((examTemplate = examTemplates.find((p) => _training.ExamTemplateId && p._id.toString() == _training.ExamTemplateId.toString()))) {
      training.exam_template = examTemplate;
    }

    if ((trainingCenter = trainingCenters.find((p) => p._id.toString() == _training.TrainingCenterId._id.toString()))) {
      training.training_center = trainingCenter;
    }

    if ((partner = partners.find((p) => p._id.toString() == _training.PartnerId._id.toString()))) {
      training.partner = partner;
    }

    if ((sub_partner = sub_partners.find((s) => s._id.toString() == _training.SubPartnerId._id.toString()))) {
      training.sub_partner = {
        _id: sub_partner._id,
        id: sub_partner.id,
        name_ar: sub_partner.name_ar,
        name_en: sub_partner.name_en,
      };
    }

    if (_training.CityId) {
      for (let i = 0; i < countries.length; i++) {
        if (countries[i]._id == _training.CityId) {
          training.country = countries[i];
        }
      }
    }

    if (_training.AreaId) {
      for (let i = 0; i < cities.length; i++) {
        if (cities[i]._id == _training.CityId) {
          training.city = cities[i];
        }
      }
    }

    console.log('try adding training : ');
    $trainings.add(training, (err, doc) => {
      console.log(err || 'training : ' + doc.id);
      setTimeout(() => {
        callback();
      }, 1000);
    });
  };

  site.trainingIndex = -1;
  site.migrationTrainings = function () {
    site.trainingIndex++;
    if (oldTrainings.length > site.trainingIndex) {
      site.migrationTraining(oldTrainings[site.trainingIndex], () => {
        site.migrationTrainings();
      });
    }
  };

  site.onPOST('x-api/migration/ready', (req, res) => {
    site.migrationReady();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/countries', (req, res) => {
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

  site.onPOST('x-api/migration/TrainingTypes', (req, res) => {
    site.migrationTrainingTypes();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/TrainingCategories', (req, res) => {
    site.migrationTrainingCategories();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/ExamTemplates', (req, res) => {
    site.migrationExamTemplates();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/Question', (req, res) => {
    site.migrationQuestion();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/Partners', (req, res) => {
    site.migrationPartners();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/SubPartners', (req, res) => {
    site.migrationSubPartners();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/TrainingCenter', (req, res) => {
    site.migrationTrainingCenter();
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

  site.onPOST('x-api/migration/Trainees', (req, res) => {
    site.migrationTrainees();
    res.json({
      done: true,
    });
  });

  site.onPOST('x-api/migration/Trainings', (req, res) => {
    site.migrationTrainings();
    res.json({
      done: true,
    });
  });

  site.get({
    name: '/',
    path: __dirname + '/site_files',
    public: true,
  });

  site.post({
    name: '/api/gender/all',
    path: __dirname + '/site_files/json/gender.json',
    public: true,
  });

};
