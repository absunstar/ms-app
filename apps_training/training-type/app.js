module.exports = function init(site) {
  const $training_types = site.connectCollection('TrainingType');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'TrainingType',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.on('[company][created]', (doc) => {
    $training_types.add(
      {
        code: '1-Test',
        name_ar: 'معرض وظائف إفتراضي',
        name_en: 'Default Training Type',
        image_url: '/images/training_types.png',
        active: true,
      },
      (err, doc1) => {}
    );
  });

  site.post('/api/training_types/add', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let training_types_doc = req.body;
    training_types_doc.$req = req;
    training_types_doc.$res = res;

    training_types_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (typeof training_types_doc.active === 'undefined') {
      training_types_doc.active = true;
    }

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
          // let d = new Date();
          // d.setFullYear(d.getFullYear() + 1);
          // d.setMonth(1);
          let num_obj = {
            screen: 'language',
            date: new Date(),
          };

          // let cb = site.getNumbering(num_obj);
          // if (!training_types_doc.code && !cb.auto) {
          //   response.error = 'Must Enter Code';
          //   res.json(response);
          //   return;
          // } else if (cb.auto) {
          //   training_types_doc.code = cb.code;
          // }

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

  site.post('/api/training_types/update', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

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

  site.post('/api/training_types/view', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

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

  site.post('/api/training_types/delete', (req, res) => {
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

  site.post('/api/training_types/all', (req, res) => {
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
};
