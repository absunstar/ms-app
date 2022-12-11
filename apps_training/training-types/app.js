module.exports = function init(site) {
  const $training_types = site.connectCollection('TrainingTypes');
  const $oldTrainingTypes = site.connectCollection({ db: 'Tadrebat', collection: 'TrainingType', identity: { enabled: false } })

  site.get({
    name: 'TrainingTypes',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/trainings_types/add', (req, res) => {
    let response = {
      done: false,
    };

    let training_types_doc = req.body;
    training_types_doc.$req = req;
    training_types_doc.$res = res;

    training_types_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $training_types.findOne(
      {
        where: {
          $or: [
            {
              name_ar: training_types_doc.name_ar,
            },
            {
              name_en: training_types_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = 'Name Exists';
          res.json(response);
        } else {
          $training_types.add(training_types_doc, (err, doc) => {
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

  site.post('/api/trainings_types/update', (req, res) => {
    let response = {
      done: false,
    };

    let training_types_doc = req.body;

    training_types_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (training_types_doc.id) {
      $training_types.findOne(
        {
          where: {
            $or: [
              {
                name_ar: training_types_doc.name_ar,
              },
              {
                name_en: training_types_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != training_types_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $training_types.edit(
              {
                where: {
                  id: training_types_doc.id,
                },
                set: training_types_doc,
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

  site.post('/api/trainings_types/view', (req, res) => {
    let response = {
      done: false,
    };

    $training_types.findOne(
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

  site.post('/api/trainings_types/delete', (req, res) => {
    let response = {
      done: false,
    };

    let id = req.body.id;

    if (id) {
      $training_types.delete(
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

  site.post('/api/trainings_types/all', (req, res) => {
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

    $training_types.findMany(
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

  site.migrationTrainingTypes = function () {
    $oldTrainingTypes.findMany(
      {},
      (err, docs, count) => {
        if (!err && docs) {
          docs.forEach((_doc, i) => {

            $training_types.add({
              _id: _doc._id,
              active: _doc.IsActive,
              name_en: _doc.Name ? _doc.Name : _doc.Name2,
              name_ar: _doc.Name2 ? _doc.Name2 : _doc.Name,
              add_user_info: {
                date: _doc.CreatedAt,
              }
            }, (err) => {
              if (err) {
                console.log(err, 'training_types');
              }
            })
          });
        }
      }
    );
  };
  //  site.migrationTrainingTypes();

};
