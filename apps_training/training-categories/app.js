module.exports = function init(site) {
  const $training_categories = site.connectCollection('TrainingCategories');
  const $training_types = site.connectCollection('TrainingTypes');
  const $oldTrainingCategories = site.connectCollection({ db: 'Tadrebat', collection: 'TrainingCategory' , identity: { enabled: false }})

  site.get({
    name: 'TrainingCategories',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/trainings_categories/add', (req, res) => {
    let response = {
      done: false,
    };

    let training_categories_doc = req.body;
    training_categories_doc.$req = req;
    training_categories_doc.$res = res;

    training_categories_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $training_categories.findOne(
      {
        where: {
          $or: [
            {
              name_ar: training_categories_doc.name_ar,
            },
            {
              name_en: training_categories_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = 'Name Exists';
          res.json(response);
        } else {
          $training_categories.add(training_categories_doc, (err, doc) => {
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

  site.post('/api/trainings_categories/update', (req, res) => {
    let response = {
      done: false,
    };

    let training_categories_doc = req.body;

    training_categories_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (training_categories_doc.id) {
      $training_categories.findOne(
        {
          where: {
            $or: [
              {
                name_ar: training_categories_doc.name_ar,
              },
              {
                name_en: training_categories_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != training_categories_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $training_categories.edit(
              {
                where: {
                  id: training_categories_doc.id,
                },
                set: training_categories_doc,
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

  site.post('/api/trainings_categories/view', (req, res) => {
    let response = {
      done: false,
    };

    $training_categories.findOne(
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

  site.post('/api/trainings_categories/delete', (req, res) => {
    let response = {
      done: false,
    };

    let id = req.body.id;

    if (id) {
      $training_categories.delete(
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

  site.post('/api/trainings_categories/all', (req, res) => {
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
    $training_categories.findMany(
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

  site.migrationTrainingCategories = function () {
    $oldTrainingCategories.findMany(
      {},
      (err, docs) => {
        if (!err && docs) {
          $training_types.findMany({}, (err, trainingTypes) => {
            if (!err && trainingTypes) {

              docs.forEach((_doc) => {
                if (_doc.TrainingTypeId) {

                  let trainingType = trainingTypes.find((_t) => {
                    return _t._id.toString() === _doc.TrainingTypeId.toString();
                  });

                  $training_categories.add({
                    _id: _doc._id,
                    active: _doc.IsActive,
                    name_en: _doc.Name ? _doc.Name : _doc.Name2,
                    name_ar:_doc.Name2 ? _doc.Name2 : _doc.Name,
                    training_type: {
                      _id: trainingType._id,
                      name_en: trainingType.name_en,
                      name_ar: trainingType.name_ar,
                      id: trainingType.id,
                    },
                    add_user_info: {
                      date: _doc.CreatedAt,
                    }
                  }, (err) => {
                    if (err) {
                      console.log(err, 'training_categories');
                    }
                  })
                }

              });
            }
          });
        }
      }
    );
  };

  //  site.migrationTrainingCategories();
};
