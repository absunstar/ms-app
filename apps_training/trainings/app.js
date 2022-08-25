module.exports = function init(site) {
  const $trainings = site.connectCollection('Trainings');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

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

  site.post('/api/trainings/add', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

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
      let start = new Date(training_doc.start_date);
      if (_d.code > start.getDay()) {
        start.setTime(start.getTime() + (_d.code - start.getDay()) * 24 * 60 * 60 * 1000);
      } else if (_d.code < start.getDay()) {
        start.setTime(start.getTime() + (7 - start.getDay() + _d.code) * 24 * 60 * 60 * 1000);
      }
      first_date = new Date(start);
      training_doc.dates_list.push({ date: first_date, day: _d, trainees_list: [] });

      while (start <= new Date(training_doc.end_date)) {
        start.setTime(start.getTime() + 7 * 24 * 60 * 60 * 1000);
        if (start <= new Date(training_doc.end_date)) {
          training_doc.dates_list.push({ date: new Date(start), day: _d, trainees_list: [] });
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

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let training_doc = req.body;

    training_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    training_doc.trainees_list.forEach((_t) => {
      training_doc.dates_list.forEach((_d) => {
        let found_trainee = _d.trainees_list.find((_tr) => {
          return _tr.id === _t.id;
        });
        if (!found_trainee) {
          _d.trainees_list.push({
            id: _t.id,
            first_name: _t.first_name,
            email: _t.email,
            attendance: false,
          });
        }
      });
    });

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

  site.post('/api/trainings/view', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    $trainings.findOne(
      {
        where: {
          id: req.body.id,
        },
      },
      (err, doc) => {
        if (!err) {
          response.done = true;
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

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

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
    let search = req.body.search || '';

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
       
          response.list = docs;
          response.count = count;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });
};
