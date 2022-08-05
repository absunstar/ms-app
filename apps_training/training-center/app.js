module.exports = function init(site) {
  const $training_center = site.connectCollection('TrainingCenter');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'TrainingCenter',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.on('[company][created]', (doc) => {
    $training_center.add(
      {
        code: '1-Test',
        name_ar: 'مركز تدريب إفتراضي',
        name_en: 'Default Training Center',
        image_url: '/images/training_center.png',
        active: true,
      },
      (err, doc1) => {}
    );
  });

  site.post('/api/training_center/add', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let training_center_doc = req.body;
    training_center_doc.$req = req;
    training_center_doc.$res = res;

    training_center_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (typeof training_center_doc.active === 'undefined') {
      training_center_doc.active = true;
    }

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
          // let d = new Date();
          // d.setFullYear(d.getFullYear() + 1);
          // d.setMonth(1);
          let num_obj = {
            screen: 'training_center',
            date: new Date(),
          };

          // let cb = site.getNumbering(num_obj);
          // if (!training_center_doc.code && !cb.auto) {
          //   response.error = 'Must Enter Code';
          //   res.json(response);
          //   return;
          // } else if (cb.auto) {
          //   training_center_doc.code = cb.code;
          // }

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

  site.post('/api/training_center/update', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

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

  site.post('/api/training_center/view', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

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

  site.post('/api/training_center/delete', (req, res) => {
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

  site.post('/api/training_center/all', (req, res) => {
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
};
