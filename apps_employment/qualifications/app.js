module.exports = function init(site) {
  const $qualifications = site.connectCollection('Qualifications');

  site.get({
    name: 'Qualifications',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/qualifications/add', (req, res) => {
    let response = {
      done: false,
    };



    let qualification_doc = req.body;
    qualification_doc.$req = req;
    qualification_doc.$res = res;

    qualification_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $qualifications.findOne(
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
          $qualifications.add(qualification_doc, (err, doc) => {
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

  site.post('/api/qualifications/update', (req, res) => {
    let response = {
      done: false,
    };



    let qualification_doc = req.body;

    qualification_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (qualification_doc.id) {
      $qualifications.findOne(
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
            $qualifications.edit(
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

  site.post('/api/qualifications/view', (req, res) => {
    let response = {
      done: false,
    };



    $qualifications.findOne(
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

  site.post('/api/qualifications/delete', (req, res) => {
    let response = {
      done: false,
    };



    let id = req.body.id;

    if (id) {
      $qualifications.delete(
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

  site.post({ name: '/api/qualifications/all', public: true }, (req, res) => {
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

    $qualifications.findMany(
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

  site.addQualifications = function (obj , callback) {
    $qualifications.add(obj, callback)
  };

  site.getQualifications = function (obj, callback) {
    callback = callback || function () { };
    $qualifications.findMany({ where: obj.where || {}, select: obj.select || {} }, (err, Qualifications) => {
     callback(Qualifications);
    })
  };

};
