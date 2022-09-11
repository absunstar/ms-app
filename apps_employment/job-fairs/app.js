module.exports = function init(site) {
  const $job_fairs = site.connectCollection('JobFairs');

  site.get({
    name: 'JobFairs',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  function addZero(code, number) {
    let c = number - code.toString().length;
    for (let i = 0; i < c; i++) {
      code = '0' + code.toString();
    }
    return code;
  }

  $job_fairs.newCode = function (fair_id, user_id) {
    user_id = user_id || 'x';
    let y = new Date().getFullYear().toString().substr(2, 2);
    let d = new Date().getDate();
    return user_id + y + fair_id + addZero(d, 2) + addZero(fair_id, 4);
  };

  site.post('/api/job_fairs/add', (req, res) => {
    let response = {
      done: false,
    };



    let job_fairs_doc = req.body;
    job_fairs_doc.$req = req;
    job_fairs_doc.$res = res;

    job_fairs_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $job_fairs.findOne(
      {
        where: {
          $or: [
            {
              name_ar: job_fairs_doc.name_ar,
            },
            {
              name_en: job_fairs_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = 'Name Exists';
          res.json(response);
        } else {
          $job_fairs.add(job_fairs_doc, (err, doc) => {
            if (!err) {
              response.done = true;
              response.doc = doc;
            } else {
              response.error = err.message;
            }
            res.json(response);
          });
        }
      }
    );
  });

  site.post('/api/job_fairs/update', (req, res) => {
    let response = {
      done: false,
    };



    let job_fairs_doc = req.body;

    job_fairs_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (job_fairs_doc.id) {
      $job_fairs.findOne(
        {
          where: {
            $or: [
              {
                name_ar: job_fairs_doc.name_ar,
              },
              {
                name_en: job_fairs_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != job_fairs_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $job_fairs.edit(
              {
                where: {
                  id: job_fairs_doc.id,
                },
                set: job_fairs_doc,
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
          }
        }
      );
    } else {
      response.error = 'no id';
      res.json(response);
    }
  });

  site.post('/api/job_fairs/apply', (req, res) => {
    let response = {
      done: false,
    };

    let job_fair = req.body;

    response.found_apply = false;

    $job_fairs.findOne(
      {
        where: {
          id: job_fair.id,
        },
      },
      (err, doc) => {
        if (!err) {
          response.done = true;
          if (job_fair.$type == 'admin') {
            doc.apply_list.forEach((_app) => {
              if (_app.id == job_fair.$apply.id) {
                response.found_apply = true;
              }
            });
            if (!response.found_apply) {
              doc.apply_list.push({
                code: $job_fairs.newCode(job_fair.id, job_fair.$apply.id),
                first_name: job_fair.$apply.first_name,
                last_name: job_fair.$apply.last_name,
                job_title: job_fair.$apply.job_title,
                email: job_fair.$apply.email,
                apply_date: job_fair.$apply.apply_date,
                id: job_fair.$apply.id,
                is_attendance: false,
              });
            }
          } else if (job_fair.$type == 'job_seeker') {
            doc.apply_list.forEach((_app) => {
              if (_app.id == req.session.user.id) {
                response.found_apply = true;
              }
            });
      
            if (!response.found_apply) {
              doc.apply_list.push({
                code: $job_fairs.newCode(job_fair.id, req.session.user.id),
                first_name: req.session.user.first_name,
                last_name: req.session.user.last_name,
                job_title: req.session.user.job_title,
                email: req.session.user.email,
                apply_date: new Date(),
                id: req.session.user.id,
                is_attendance: false,
              });
            }
          }
          if (response.found_apply) {
            response.error = 'You have registered to this Job Fair before';
            res.json(response);
            return;
          }
          $job_fairs.update(doc);
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  site.post('/api/job_fairs/view', (req, res) => {
    let response = {
      done: false,
    };



    $job_fairs.findOne(
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

  site.post('/api/job_fairs/attendance', (req, res) => {
    let response = {
      done: false,
    };


    $job_fairs.findOne(
      {
        where: {
          id: req.body.id,
          'apply_list.code': req.body.attendance_code.toString(),
        },
      },
      (err, doc) => {
        if (!err) {
          if (doc && doc.id) {
            let select_apply = {};
            doc.apply_list.forEach((_app, i) => {
              if (_app.code == req.body.attendance_code) {
                select_apply = _app;
                select_apply.$index = i;
              }
            });

            if (select_apply.id) {
              if (select_apply.is_attendance) {
                response.error = 'You have Attendance to this Job Fair before';
                res.json(response);
                return;
              } else {
                response.done = true;
                doc.apply_list[select_apply.$index].is_attendance = true
                $job_fairs.update(doc);
              }
            }
          } else {
            response.error = 'Invalid Attendance Code';
            res.json(response);
            return;
          }
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  site.post('/api/job_fairs/delete', (req, res) => {
    let response = {
      done: false,
    };



    let id = req.body.id;

    if (id) {
      $job_fairs.delete(
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

  site.post('/api/job_fairs/all', (req, res) => {
    let response = {
      done: false,
    };



    let where = req.body.where || {};

    if (req.session.user.role.name == 'job_seeker') {
      where.event_date = {
        $gte: new Date(),
      };
    }

    if (where['name_ar']) {
      where['name_ar'] = site.get_RegExp(where['name_ar'], 'i');
    }

    if (where['name_en']) {
      where['name_en'] = site.get_RegExp(where['name_en'], 'i');
    }

    if (where['website']) {
      where['website'] = site.get_RegExp(where['website'], 'i');
    }

    if (where['field']) {
      where['field'] = site.get_RegExp(where['field'], 'i');
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

    $job_fairs.findMany(
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
