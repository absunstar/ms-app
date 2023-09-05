module.exports = function init(site) {
  const $trainings = site.connectCollection('Trainings');
  const $users = site.connectCollection('users_info');
  $trainings.skip = 0;
  $trainings.count = 0;

  site.get({
    name: 'Trainings',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.get({
    name: 'Trainees',
    path: __dirname + '/site_files/html/trainees.html',
    parser: 'html',
    compress: true,
  });

  site.post({
    name: '/api/privacy_type/all',
    path: __dirname + '/site_files/json/privacy_type.json',
  });

  site.post({
    name: '/api/days/all',
    path: __dirname + '/site_files/json/days.json',
  });

  site.get({ name: '/api/trainee.xlsx', public: true }, (req, res) => {
    let path = site.path.join(site.cwd, '/apps_training/0/site_files/xls/trainee.xlsx');
    console.log(path);
    res.download(path, 'trainee.xlsx');
  });

  site.post('/api/trainings/add', (req, res) => {
    let response = {
      done: false,
    };

    let training_doc = req.body;
    training_doc.$req = req;
    training_doc.$res = res;

    training_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (training_doc.start_date && training_doc.end_date && new Date(training_doc.start_date) > new Date(training_doc.end_date)) {
      response.error = 'Start Date cannot be bigger than End date';
      res.json(response);
      return;
    }

    training_doc.dates_list = [];
    training_doc.days.forEach((_d) => {
      let startDate = new Date(training_doc.start_date);
      let endDate = new Date(training_doc.end_date);
      if (_d.code > startDate.getDay()) {
        startDate.setTime(startDate.getTime() + (_d.code - startDate.getDay()) * 24 * 60 * 60 * 1000);
      } else if (_d.code < startDate.getDay()) {
        startDate.setTime(startDate.getTime() + (7 - startDate.getDay() + _d.code) * 24 * 60 * 60 * 1000);
      }
      if (startDate.setHours(0, 0, 0, 0) <= endDate.setHours(0, 0, 0, 0)) {
        training_doc.dates_list.push({ date: new Date(startDate), day: _d, trainees_list: [] });
      }

      while (startDate <= endDate) {
        startDate.setTime(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        if (startDate.setHours(0, 0, 0, 0) <= endDate.setHours(0, 0, 0, 0)) {
          training_doc.dates_list.push({ date: new Date(startDate), day: _d, trainees_list: [] });
        }
      }
    });
    training_doc.dates_list.sort((a, b) => a.date.getTime() - b.date.getTime());

    $trainings.add(training_doc, (err, doc) => {
      if (!err) {
        response.done = true;
        response.doc = doc;
      } else {
        response.error = err.message;
      }
      res.json(response);
    });
  });

  site.post('/api/trainings/update', (req, res) => {
    let response = {
      done: false,
    };

    let training_doc = req.body;

    training_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (training_doc.$edit_dates) {
      training_doc.dates_list = [];
      training_doc.days.forEach((_d) => {
        let startDate = new Date(training_doc.start_date);
        let endDate = new Date(training_doc.end_date);
        if (_d.code > startDate.getDay()) {
          startDate.setTime(startDate.getTime() + (_d.code - startDate.getDay()) * 24 * 60 * 60 * 1000);
        } else if (_d.code < startDate.getDay()) {
          startDate.setTime(startDate.getTime() + (7 - startDate.getDay() + _d.code) * 24 * 60 * 60 * 1000);
        }
        if (startDate.setHours(0, 0, 0, 0) <= endDate.setHours(0, 0, 0, 0)) {
          training_doc.dates_list.push({ date: new Date(startDate), day: _d, trainees_list: [] });
        }

        while (startDate <= endDate) {
          startDate.setTime(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          if (startDate.setHours(0, 0, 0, 0) <= endDate.setHours(0, 0, 0, 0)) {
            training_doc.dates_list.push({ date: new Date(startDate), day: _d, trainees_list: [] });
          }
        }
      });
      training_doc.dates_list.sort((a, b) => a.date.getTime() - b.date.getTime());

      training_doc.dates_list.forEach((_d) => {
        _d.trainees_list = [];
        training_doc.trainees_list.forEach((_t) => {
          if (_t.approve) {
            _d.trainees_list.push({
              _id: _t._id,
              id: _t.id,
              first_name: _t.first_name,
              email: _t.email,
              attend: false,
            });
          }
        });
      });
    }

    if (training_doc.id) {
      $trainings.edit(
        {
          where: {
            id: training_doc.id,
          },
          set: training_doc,
          $req: req,
          $res: res,
        },
        (err) => {
          if (!err) {
            response.done = true;
          } else {
            response.error = 'Code Already Exist';
          }
          res.json(response);
        }
      );
    } else {
      response.error = 'no id';
      res.json(response);
    }
  });

  site.post('/api/trainings/apologyTrainee', (req, res) => {
    let response = {
      done: false,
    };

    $trainings.findOne(
      {
        where: {
          id: req.body.id,
        },
      },
      (err, doc) => {
        if (!err) {
          doc.dates_list.forEach((_d) => {
            if (_d.trainees_list && _d.trainees_list.length > 0) {
              let i = _d.trainees_list.findIndex((itm) => itm.id == req.body.traineeId);
              if (i !== -1) {
                _d.trainees_list[i].apology = true;
              }
            }
          });

          let index = doc.trainees_list.findIndex((itm) => itm.id == req.body.traineeId);
          if (index !== -1) {
            doc.trainees_list[index].apology = true;
          }

          $trainings.update(doc, (err1, result) => {
            response.done = true;
            response.doc = result.doc;
            res.json(response);
          });
        } else {
          response.error = err.message;
          res.json(response);
        }
      }
    );
  });

  site.post('/api/trainings/deleteTrainee', (req, res) => {
    let response = {
      done: false,
    };

    $trainings.findOne(
      {
        where: {
          id: req.body.id,
        },
      },
      (err, doc) => {
        if (!err) {
          let found = false;

          doc.dates_list.forEach((_d) => {
            if (_d.trainees_list && _d.trainees_list.length > 0) {
              if (_d.trainees_list.some((_attend) => _attend.attend && _attend.id == req.body.traineeId)) {
                found = true;
              } else {
                let i = _d.trainees_list.findIndex((itm) => itm.id == req.body.traineeId);
                if (i !== -1) {
                  _d.trainees_list.splice(i, 1);
                }
              }
            }
          });

          if (found) {
            response.error = 'The trainee cannot be deleted due to attendance';
            res.json(response);
            return;
          }

          let index = doc.trainees_list.findIndex((itm) => itm.id == req.body.traineeId);
          if (index !== -1) {
            doc.trainees_list.splice(index, 1);
          }

          $trainings.update(doc, (err1, result) => {
            response.done = true;
            response.doc = result.doc;
            res.json(response);
          });
        } else {
          response.error = err.message;
          res.json(response);
        }
      }
    );
  });

  site.post('/api/trainings/view', (req, res) => {
    let response = {
      done: false,
    };

    $trainings.findOne(
      {
        where: {
          id: req.body.id,
        },
      },
      (err, doc) => {
        if (!err) {
          response.done = true;
          if (new Date(doc.start_date) < new Date()) {
            doc.$startTraining = true;
          }
          response.doc = doc;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  site.post('/api/trainings/delete', (req, res) => {
    let response = {
      done: false,
    };

    let id = req.body.id;

    if (id) {
      $trainings.delete(
        {
          id: id,
          $req: req,
          $res: res,
        },
        (err, result) => {
          if (!err) {
            response.done = true;
          } else {
            response.error = err.message;
          }
          res.json(response);
        }
      );
    } else {
      response.error = 'no id';
      res.json(response);
    }
  });

  site.post('/api/trainings/all', (req, res) => {
    let response = {
      done: false,
    };

    let where = req.body.where || {};
    let search = req.body.search;

    if (where['get_partner'] && req.session.user.role.name == 'partner') {
      let partnersId = [];
      req.session.user.partners_list.forEach((_p) => {
        if (_p.partner.id) {
          partnersId.push(_p.partner.id);
        }
      });
      where['partner.id'] = { $in: partnersId };
      delete where['get_partner'];
    }

    if (where['get_sub_partner'] && req.session.user.role.name == 'sub_partner') {
      let subPartnersId = [];
      req.session.user.partners_list.forEach((_p) => {
        if (_p.sub_partners) {
          _p.sub_partners.forEach((_s) => {
            subPartnersId.push(_s.id);
          });
        }
      });
      where['sub_partner.id'] = { $in: subPartnersId };
      delete where['get_sub_partner'];
    }

    if (where['latest']) {
      let new_date = new Date();
      new_date.setDate(new_date.getDate() + 1);
      where['start_date'] = {
        $gt: new Date(),
      };
      delete where['latest'];
    }

    if (where['country'] && where['country'].id) {
      where['country.id'] = where['country'].id;
      delete where['country'];
    }

    if (where['city'] && where['city'].id) {
      where['city.id'] = where['city'].id;
      delete where['city'];
    }

    if (where['partner'] && where['partner'].id) {
      where['partner.id'] = where['partner'].id;
      delete where['partner'];
    }

    if (where['sub_partner'] && where['sub_partner'].id) {
      where['sub_partner.id'] = where['sub_partner'].id;
      delete where['sub_partner'];
    }

    if (where['trainer'] && where['trainer'].id) {
      where['trainer.id'] = where['trainer'].id;
      delete where['trainer'];
    }

    if (where['training_center'] && where['training_center'].id) {
      where['training_center.id'] = where['training_center'].id;
      delete where['training_center'];
    }

    if (where['training_type'] && where['training_type'].id) {
      where['training_type.id'] = where['training_type'].id;
      delete where['training_type'];
    }

    if (where['training_category'] && where['training_category'].id) {
      where['training_category.id'] = where['training_category'].id;
      delete where['training_category'];
    }

    if (where['privacy_type'] && where['privacy_type'].id) {
      where['privacy_type.id'] = where['privacy_type'].id;
      delete where['privacy_type'];
    }

    if (where['not_active']) {
      where['active'] = false;
    }

    if (where['active_search']) {
      where['active'] = true;
    }

    if (where['not_active'] && where['active_search']) {
      delete where['active'];
    }

    delete where['active_search'];
    delete where['not_active'];

    if (search) {
      where.$or = [];

      where.$or.push({
        'country.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'country.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'city.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'city.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'partner.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'partner.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'sub_partner.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'sub_partner.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'trainer.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'trainer.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'trainer.first_name': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'trainer.email': site.get_RegExp(search, 'i'),
      });
      where.$or.push({
        'training_center.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'training_center.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'training_type.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'training_type.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'training_category.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'training_category.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'privacy_type.ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'privacy_type.en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'days.ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'days.en': site.get_RegExp(search, 'i'),
      });
    }
    if (req.body.more == true) {
      $trainings.skip += $trainings.count;
    } else {
      $trainings.skip = 0;
    }
    $trainings.findMany(
      {
        select: req.body.select || {},
        where: where,
        sort: req.body.sort || {
          id: -1,
        },
        limit: req.body.limit || 30,
        skip: $trainings.skip || 0,
      },
      (err, docs, count) => {
        if (!err) {
          response.done = true;
          $trainings.count = docs.length;
          docs.forEach((_l) => {
            if (new Date(_l.start_date) < new Date()) {
              _l.$hide_edit = true;
            }
            if (new Date(_l.end_date) < new Date() && !_l.approve) {
              _l.$show_approved = true;
            }
          });
          response.list = docs;
          response.count = count;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  site.post('/api/trainings/trainee_trainings', (req, res) => {
    let response = {
      done: false,
    };

    let where = req.body.where || {};

    // where['$or'] = [{ $and: [{ approve: true }, { 'privacy_type.id': 2 }] }, { 'privacy_type.id': 1 }];

    where['trainees_list.id'] = req.body.id;
    where['trainees_list.approve'] = true;
    $trainings.findMany(
      {
        select: req.body.select || {},
        where: where,
        sort: req.body.sort || {
          id: -1,
        },
        limit: req.body.limit,
      },
      (err, docs, count) => {
        if (!err) {
          response.done = true;
          docs.forEach((_doc) => {
            console.log(_doc.id);
            let attend_count = 0;
            _doc.dates_list.forEach((_d) => {
              _d.trainees_list.forEach((_t) => {
                if (req.body.id == _t.id && _t.attend) {
                  attend_count += 1;
                }
              });
            });
            let attendance_rate = (attend_count / _doc.dates_list.length) * 100;
            if (attendance_rate >= 80) {
              _doc.$attend_rate = true;
            } else {
              _doc.$attend_rate = false;
            }
            _doc.$start_exam_count = 0;
            let index = _doc.trainees_list.findIndex((_t) => req.body.id == _t.id);
            if (index > -1) {
              _doc.$start_exam_count = _doc.trainees_list[index].start_exam_count || 0;
              if (_doc.$start_exam_count > 2) {
                _doc.$can_exam = false;
              } else {
                _doc.$can_exam = true;
              }
              if (_doc.trainees_list[index].finish_exam) {
                _doc.$finish_exam = true;
                _doc.$trainee_degree = _doc.trainees_list[index].trainee_degree;
              }
              if (_doc.trainees_list[index].certificate) {
                _doc.$certificate = _doc.trainees_list[index].certificate;
              }
            }

            // _doc.trainees_list.forEach((_t) => {
            //   _doc.$start_exam_count = _t.start_exam_count || 0;
            //   if (req.body.id == _t.id && _t.finish_exam) {
            //     _doc.$finish_exam = true;
            //     _doc.$certificate = _t.certificate;
            //     _doc.$trainee_degree = _t.trainee_degree;
            //   }
            // });
          });
          response.list = docs;
          response.count = count;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  site.post('/api/trainings/start_exam', (req, res) => {
    let response = {
      done: false,
    };

    $trainings.findOne(
      {
        where: {
          id: req.body.training_id,
        },
      },
      (err, doc) => {
        if (!err) {
          response.done = true;

          let questionsData = {
            where: {
              'training_category.id': doc.training_category.id,
            },
            exam_template: req.body.exam_template,
            number_questions: req.body.number_questions,
          };
          let index = doc.trainees_list.findIndex((_t) => req.body.trainee_id == _t.id);
          if (index > -1) {
            doc.trainees_list[index].start_exam_count = doc.trainees_list[index].start_exam_count || 0;
            if (doc.trainees_list[index].start_exam_count < 3) {
              doc.trainees_list[index].start_exam_count = doc.trainees_list[index].start_exam_count + 1;
            } else {
              response.error = 'You Excute Three Times Of Exam';
              res.json(response);
              return;
            }
          }
          // doc.trainees_list.forEach((_t) => {
          //   if (req.body.trainee_id == _t.id) {
          //     _t.start_exam_count = _t.start_exam_count || 0;
          //     if (_t.start_exam_count < 3) {
          //       _t.start_exam_count = _t.start_exam_count + 1;
          //     } else {
          //     }
          //   }
          // });

          site.getQuestionsToExam(questionsData, (examCb) => {
            if (examCb.length > 0) {
              $trainings.update(doc, (err, result) => {});
              response.list = examCb;
            } else {
              response.error = 'There are no questions for the exam';
            }
            res.json(response);
          });
        } else {
          response.error = err.message;
        }
      }
    );
  });

  site.post('/api/trainings/create_certificates', (req, res) => {
    let response = {
      done: false,
    };
    $trainings.findOne(
      {
        where: {
          id: req.query.training_id,
        },
      },
      (err, trainingDoc) => {
        if (!err) {
          site.getCertificatesToExam(trainingDoc, (err, certificatesCb) => {
            if (certificatesCb) {
              let trainee = trainingDoc.trainees_list.find((t) => t.id == req.query.trainee_id);

              if (trainee) {
                let startDate = new Date(trainingDoc.start_date);
                let endDate = new Date(trainingDoc.end_date);
                site.loadPDF({ path: certificatesCb.certificate.path }, (doc, font) => {
                  let form = doc.getForm();
                  if ((nameField = form.getTextField('Name'))) {
                    let name = trainee.first_name + ' ' + (trainee.last_name || '');
                    nameField.setText(name);
                    nameField.updateAppearances(font);
                  }

                  try {
                    if ((TrainingCategories = form.getTextField('TrainingCategories'))) {
                      TrainingCategories.setText(trainee.trainee_degree.toString() + ' % ');
                    }
                  } catch (error) {}

                  try {
                    if ((start_date = form.getTextField('StartDate'))) {
                      start_date.setText(`${startDate.getDate()}  /  ${startDate.getMonth() + 1} /  ${startDate.getFullYear()}`);
                    }
                  } catch (error) {}

                  try {
                    if ((end_date = form.getTextField('EndDate'))) {
                      end_date.setText(`${endDate.getDate()}  /  ${endDate.getMonth() + 1} /  ${endDate.getFullYear()}`);
                    }
                  } catch (error) {}

                  form.flatten();

                  doc.save().then((new_file_stream) => {
                    let file_name = trainee.id.toString() + '_' + trainingDoc.id.toString() + '.pdf';
                    certificatesCb.certificate.path = certificatesCb.certificate.path.split('\\');
                    certificatesCb.certificate.path[certificatesCb.certificate.path.length - 1] = file_name;
                    certificatesCb.certificate.path = certificatesCb.certificate.path.join('\\');
                    certificatesCb.certificate.url = certificatesCb.certificate.url.split('/');
                    certificatesCb.certificate.url[certificatesCb.certificate.url.length - 1] = file_name;
                    certificatesCb.certificate.url = certificatesCb.certificate.url.join('/');
                    certificatesCb.certificate.name = file_name;

                    site.fs.writeFileSync(certificatesCb.certificate.path, new_file_stream);
                    trainee.certificate = certificatesCb.certificate;
                    response.done = true;
                    response.path = trainee.certificate.path;
                    response.name = trainee.certificate.name;
                    res.json(response);
                  });
                });
              } else {
                response.error = 'trainee not exists in training list';
                response.trainingDoc = trainingDoc;
                res.json(response);
              }
            } else {
              response.error = 'There are no Certificates';
              res.json(response);
            }
          });
        } else {
          response.error = err.message;
          res.json(response);
        }
      }
    );
  });
  site.post('/api/trainings/genderToTraining', (req, res) => {
    let response = {
      done: true,
    };
    res.json(response);

    $trainings.findMany({ limit: 100000 }, (err, trainingDocs) => {
      if (!err && trainingDocs) {
        $users.findMany({ limit: 100000, where: { 'role.name': 'trainee' }, select: { id: 1, gender: 1 } }, (err, TraineeDocs) => {
          if (!err && TraineeDocs) {
            for (let i = 0; i < trainingDocs.length; i++) {
              if (trainingDocs[i].trainees_list) {
                trainingDocs[i].trainees_list.forEach((_t) => {
                  let index = TraineeDocs.findIndex((itm) => itm.id == _t.id);
                  if (index !== -1) {
                    _t.gender = TraineeDocs[index].gender;
                  }
                });
              }
              $trainings.update(trainingDocs[i], (err, result) => {
                console.log('Update Training Id : ' + result.doc.id);
              });
            }
          }
        });
      }
    });
  });

  site.post('/api/trainings/create_all_certificates', (req, res) => {
    let response = {
      done: false,
    };
    $trainings.findOne(
      {
        where: {
          id: req.query.training_id,
        },
      },
      (err, trainingDoc) => {
        if (!err && trainingDoc) {
          site.getCertificatesToExam(trainingDoc, (err, certificatesCb) => {
            if (!err && certificatesCb) {
              let folderName = trainingDoc.name ?? 'training' + '.zip';
              let folderPath = certificatesCb.certificate.path.split('\\');
              folderPath[folderPath.length - 1] = folderName;
              folderPath = folderPath.join('\\');
              let traineeList = [];

              trainingDoc.trainees_list.forEach((_trainee, index) => {
                let trainee = { ..._trainee };
                if (trainee && trainee.trainee_degree >= trainingDoc.success_rate) {
                  trainee.certificate = { ...certificatesCb.certificate };
                  trainee.certificate.name = trainingDoc.id.toString() + '_' + trainee.id.toString() + '.pdf';

                  trainee.startDate = new Date(trainingDoc.start_date);
                  trainee.endDate = new Date(trainingDoc.end_date);
                  site.loadPDF({ path: trainee.certificate.path }, (doc, font) => {
                    let form = doc.getForm();
                    if ((nameField = form.getTextField('Name'))) {
                      let name = trainee.first_name + ' ' + (trainee.last_name || '');
                      nameField.setText(name);
                      nameField.updateAppearances(font);
                    }

                    try {
                      if ((TrainingCategories = form.getTextField('TrainingCategories'))) {
                        TrainingCategories.setText(trainee.trainee_degree.toString() + ' % ');
                      }
                    } catch (error) {}

                    try {
                      if ((start_date = form.getTextField('StartDate'))) {
                        start_date.setText(`${trainee.startDate.getDate()}  /  ${trainee.startDate.getMonth() + 1} /  ${trainee.startDate.getFullYear()}`);
                      }
                    } catch (error) {}

                    try {
                      if ((end_date = form.getTextField('EndDate'))) {
                        end_date.setText(`${trainee.endDate.getDate()}  /  ${trainee.endDate.getMonth() + 1} /  ${trainee.endDate.getFullYear()}`);
                      }
                    } catch (error) {}

                    form.flatten();

                    doc.save().then((new_file_stream) => {
                      trainee.certificate.path = trainee.certificate.path.split('\\');
                      trainee.certificate.path[trainee.certificate.path.length - 1] = trainee.certificate.name;
                      trainee.certificate.path = trainee.certificate.path.join('\\');
                      trainee.certificate.url = trainee.certificate.url.split('/');
                      trainee.certificate.url[trainee.certificate.url.length - 1] = trainee.certificate.name;
                      trainee.certificate.url = trainee.certificate.url.join('/');
                      site.fs.writeFileSync(trainee.certificate.path, new_file_stream);
                      traineeList.push(trainee);
                    });
                  });
                }
              });
              let ii = setInterval(() => {
                if (traineeList.length == trainingDoc.trainees_list.filter((_t) => _t.trainee_degree >= trainingDoc.success_rate).length) {
                  clearInterval(ii);

                  let output = site.fs.createWriteStream(folderPath);
                  let archive = site.archiver('zip', {
                    zlib: {
                      level: 9,
                    },
                  });
                  output.on('close', function () {
                    response.done = true;
                    response.path = folderPath;
                    response.name = folderName;
                    res.json(response);
                  });

                  archive.on('error', function (err) {
                    response.err = err.message;
                    res.json(response);
                  });

                  archive.pipe(output);

                  traineeList.forEach((t) => {
                    archive.file(t.certificate.path, {
                      name: t.certificate.name,
                    });
                  });

                  archive.finalize();
                }
              }, 1000);
            } else {
              response.error = 'There are no Certificates';
              res.json(response);
            }
          });
        } else {
          response.error = err.message;
          res.json(response);
        }
      }
    );
  });

  site.get('/api/download-certificate', (req, res) => {
    res.download(req.query.path, req.query.name || 'certificate.pdf');
  });

  site.post('/api/trainings/finish_exam', (req, res) => {
    let response = {
      done: false,
    };

    $trainings.findOne(
      {
        where: {
          id: req.body.training_id,
        },
      },
      (err, trainingDoc) => {
        if (!err) {
          site.getCertificatesToExam(trainingDoc, (err, certificatesCb) => {
            response.done = true;
            let correct = 0;
            req.body.questions_list.forEach((_q) => {
              _q.answers_list.forEach((_a) => {
                delete _a.active;
                delete _a.create_date;
                if (_a.correct && _a.trainee_answer) {
                  correct += 1;
                }
              });
            });

            if (certificatesCb) {
              let file_stream = site.fs.readFileSync(certificatesCb.certificate.path);
              let file_name = req.body.trainee_id.toString() + '_' + Math.floor(Math.random() * 1000).toString() + '.pdf';
              let trainee_degree = site.toNumber((correct / req.body.questions_list.length) * 100);
              certificatesCb.certificate.path = certificatesCb.certificate.path.split('\\');
              certificatesCb.certificate.path[certificatesCb.certificate.path.length - 1] = file_name;
              certificatesCb.certificate.path = certificatesCb.certificate.path.join('\\');
              certificatesCb.certificate.url = certificatesCb.certificate.url.split('/');
              certificatesCb.certificate.url[certificatesCb.certificate.url.length - 1] = file_name;
              certificatesCb.certificate.url = certificatesCb.certificate.url.join('/');

              let startDate = new Date(trainingDoc.start_date);
              let endDate = new Date(trainingDoc.end_date);

              site.pdf.PDFDocument.load(file_stream).then((doc) => {
                let form = doc.getForm();

                let nameField = form.getTextField('Name');
                nameField.setText(req.session.user.first_name + ' ' + (req.session.user.last_name || ''));

                let TrainingCategories = form.getTextField('TrainingCategories');
                if (TrainingCategories) {
                  TrainingCategories.setText(trainee_degree.toString() + ' % ');
                }

                let start_date = form.getTextField('StartDate');
                start_date.setText(`${startDate.getDate()}  /  ${startDate.getMonth() + 1} /  ${startDate.getFullYear()}`);
                let end_date = form.getTextField('EndDate');
                end_date.setText(`${endDate.getDate()}  /  ${endDate.getMonth() + 1} /  ${endDate.getFullYear()}`);

                form.flatten();

                doc.save().then((new_file_stream) => {
                  site.fs.writeFileSync(certificatesCb.certificate.path, new_file_stream);
                });
              });

              trainingDoc.trainees_list.forEach((_t) => {
                if (req.body.trainee_id == _t.id) {
                  _t.exam_questions_list = req.body.questions_list;
                  _t.trainee_degree = trainee_degree;
                  // _t.certificate = certificatesCb.certificate;
                  _t.finish_exam = true;
                }
              });
              $trainings.update(trainingDoc);
            }
            res.json(response);
          });
        } else {
          response.error = err.message;
          res.json(response);
        }
      }
    );
  });

  site.getTraineesToTrainer = function (where, callback) {
    $trainings.findMany(
      {
        where: where,
      },
      (err, docs) => {
        if (!err) {
          if (docs) {
            let traineesId = [];
            docs.forEach((_doc) => {
              if (_doc.trainees_list && _doc.trainees_list.length > 0) {
                _doc.trainees_list.forEach((_t) => {
                  let foundId = traineesId.find((_id) => {
                    return _id === _t.id;
                  });
                  if (!foundId) {
                    traineesId.push(_t.id);
                  }
                });
              }
            });
            callback(traineesId);
          } else callback(false);
        }
      }
    );
  };

  site.onPOST({ name: '/api/trainees/excel_upload', public: true }, (req, res) => {
    let response = {
      file: {},
      done: !0,
    };

    if ((file = req.files.fileToUpload)) {
      response.file = file;
      if (site.isFileExistsSync(file.filepath)) {
        let docs = [];
        if (file.originalFilename.contains('.xlsx|.xls')) {
          let workbook = site.xlsx.readFile(file.filepath);
          docs = site.xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
          response.docs = docs || [];
        }
      }
    } else {
      response.done = !1;
      response.error = 'no file uploaded';
    }

    res.json(response);
  });

  site.getTrainings = function (obj, callback) {
    callback = callback || function () {};

    $trainings.findMany({ where: obj.where || {}, select: obj.select || {} }, (err, trainings) => {
      callback(trainings);
    });
  };

  site.addTrainings = function (obj, callback) {
    $trainings.add(obj, callback);
  };
};
