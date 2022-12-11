module.exports = function init(site) {
  const $training_center = site.connectCollection('TrainingCenters');
  const $sub_partners = site.connectCollection('SubPartners');
  const $oldPartners = site.connectCollection({ db: 'Tadrebat', collection: 'EntityPartner', identity: { enabled: false } })

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


  site.migrationTrainingCenter = function () {
    $oldPartners.findMany(
      {},
      (err, docs, count) => {

        if (!err && docs) {

          $sub_partners.findMany({}, (err, sub_partners) => {
            if (!err && sub_partners) {



              docs.forEach(_doc => {

                _doc.TrainingCenters.forEach(_trainingC => {

                  let trainingCenter = {
                    _id: _trainingC._id,
                    active: _trainingC.IsActive,
                    name_en: _trainingC.Name,
                    name_ar: _trainingC.Name,
                    phone: _trainingC.Phone,
                    add_user_info: {
                      date: _trainingC.CreatedAt,
                    }

                  };

                  for (let i = 0; i < sub_partners.length; i++) {

                    sub_partners[i].TrainingCenterIds.forEach(_tcId => {
                        if(_tcId.toString() == _trainingC._id.toString()) {
                          trainingCenter.sub_partner = {
                            _id : sub_partners[i]._id,
                            name_ar : sub_partners[i].name_ar,
                            name_en : sub_partners[i].name_en,
                            partners_list : sub_partners[i].partners_list,
                            id : sub_partners[i].id,
                          }
                        }
                    });
                    
                  }

                  $training_center.add(trainingCenter, (err) => {
                    if (err) {
                      console.log(err, 'training_center');
                    }
                  })
                });
              });
            }
          });
        }
      }
    );
  };


   site.migrationTrainingCenter();
};
