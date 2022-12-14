module.exports = function init(site) {
  const $job_subfields = site.connectCollection('JobSubFields');

  site.get({
    name: 'JobSubFields',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/job_subfields/add', (req, res) => {
    let response = {
      done: false,
    };

    let job_subfields_doc = req.body;
    job_subfields_doc.$req = req;
    job_subfields_doc.$res = res;

    job_subfields_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $job_subfields.findOne(
      {
        where: {
          $or: [
            {
              name_ar: job_subfields_doc.name_ar,
            },
            {
              name_en: job_subfields_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = 'Name Exists';
          res.json(response);
        } else {
          $job_subfields.add(job_subfields_doc, (err, doc) => {
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

  site.post('/api/job_subfields/update', (req, res) => {
    let response = {
      done: false,
    };

    let job_subfields_doc = req.body;

    job_subfields_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (job_subfields_doc.id) {
      $job_subfields.findOne(
        {
          where: {
            $or: [
              {
                name_ar: job_subfields_doc.name_ar,
              },
              {
                name_en: job_subfields_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != job_subfields_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $job_subfields.edit(
              {
                where: {
                  id: job_subfields_doc.id,
                },
                set: job_subfields_doc,
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

  site.post('/api/job_subfields/view', (req, res) => {
    let response = {
      done: false,
    };

    $job_subfields.findOne(
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

  site.post('/api/job_subfields/delete', (req, res) => {
    let response = {
      done: false,
    };

    let id = req.body.id;

    if (id) {
      $job_subfields.delete(
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

  site.post('/api/job_subfields/all', (req, res) => {
    let response = {
      done: false,
    };

    let where = req.body.where || {};

    if (where['name_ar']) {
      where['name_ar'] = site.get_RegExp(where['name_ar'], 'i');
    }

    if (where['name_en']) {
      where['name_en'] = site.get_RegExp(where['name_en'], 'i');
    }

    if (where['job_field']) {
      where['job_field.id'] = where['job_field'].id;
      delete where['job_field'];
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
    $job_subfields.findMany(
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

  site.addJobSubFields = function (obj) {
    $job_subfields.add(obj, (err) => {
      if (err) {
        console.log(err, 'JobSubFields');
      } else {
        return;
      }
    })
  };

  site.getJobSubFields = function (obj, callback) {
    callback = callback || function () { };

    $job_subfields.findMany({ where: obj.where || {}, select: obj.select || {} }, (err, JobSubFields) => {
     callback(JobSubFields);
    })

  };
};
