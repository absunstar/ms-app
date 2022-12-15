module.exports = function init(site) {
  const $training_center = site.connectCollection('TrainingCenters');

  site.get({
    name: 'TrainingCenters',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/trainings_centers/add', (req, res) => {
    let response = {
      done: false,
    };

    let training_center_doc = req.body;
    training_center_doc.$req = req;
    training_center_doc.$res = res;

    training_center_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $training_center.findOne(
      {
        where: {
          $or: [
            {
              name_ar: training_center_doc.name_ar,
            },
            {
              name_en: training_center_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = 'Name Exists';
          res.json(response);
        } else {
          $training_center.add(training_center_doc, (err, doc) => {
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

  site.post('/api/trainings_centers/update', (req, res) => {
    let response = {
      done: false,
    };

    let training_center_doc = req.body;

    training_center_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (training_center_doc.id) {
      $training_center.findOne(
        {
          where: {
            $or: [
              {
                name_ar: training_center_doc.name_ar,
              },
              {
                name_en: training_center_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != training_center_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $training_center.edit(
              {
                where: {
                  id: training_center_doc.id,
                },
                set: training_center_doc,
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

  site.post('/api/trainings_centers/view', (req, res) => {
    let response = {
      done: false,
    };

    $training_center.findOne(
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

  site.post('/api/trainings_centers/delete', (req, res) => {
    let response = {
      done: false,
    };

    let id = req.body.id;

    if (id) {
      $training_center.delete(
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

  site.post('/api/trainings_centers/all', (req, res) => {
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

    if (where['phone']) {
      where['phone'] = where['phone'];
    }
    if (where['sub_partner']) {
      where['sub_partner.id'] = where['sub_partner'].id;
      delete where['sub_partner'];
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

    $training_center.findMany(
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

  site.getTrainingCenter = function (obj, callback) {
    callback = callback || function () {};

    $training_center.findMany({ where: obj.where || {}, select: obj.select || {} }, (err, sub_partners) => {
      callback(sub_partners);
    });
  };

  site.addTrainingCenter = function (obj, callback) {
    $training_center.add(obj, callback);
  };
};
