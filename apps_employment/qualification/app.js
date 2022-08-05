module.exports = function init(site) {
  const $qualification = site.connectCollection('Qualification');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'Qualification',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.on('[company][created]', (doc) => {
    $qualification.add(
      {
        code: '1-Test',
        name_ar: 'تأهيل إفتراضي',
        name_en: 'Default Qualification',
        image_url: '/images/qualification.png',
        active: true,
      },
      (err, doc1) => {}
    );
  });

  site.post('/api/qualification/add', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let qualification_doc = req.body;
    qualification_doc.$req = req;
    qualification_doc.$res = res;

    qualification_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (typeof qualification_doc.active === 'undefined') {
      qualification_doc.active = true;
    }

    $qualification.findOne(
      {
        where: {
          $or: [
            {
              name_ar: qualification_doc.name_ar,
            },
            {
              name_en: qualification_doc.name_en,
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
            screen: 'qualification',
            date: new Date(),
          };

          // let cb = site.getNumbering(num_obj);
          // if (!qualification_doc.code && !cb.auto) {
          //   response.error = 'Must Enter Code';
          //   res.json(response);
          //   return;
          // } else if (cb.auto) {
          //   qualification_doc.code = cb.code;
          // }

          $qualification.add(qualification_doc, (err, doc) => {
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

  site.post('/api/qualification/update', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let qualification_doc = req.body;

    qualification_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (qualification_doc.id) {
      $qualification.findOne(
        {
          where: {
            $or: [
              {
                name_ar: qualification_doc.name_ar,
              },
              {
                name_en: qualification_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != qualification_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $qualification.edit(
              {
                where: {
                  id: qualification_doc.id,
                },
                set: qualification_doc,
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

  site.post('/api/qualification/view', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    $qualification.findOne(
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

  site.post('/api/qualification/delete', (req, res) => {
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
      $qualification.delete(
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

  site.post('/api/qualification/all', (req, res) => {
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

    $qualification.findMany(
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
