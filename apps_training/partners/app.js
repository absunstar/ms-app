module.exports = function init(site) {
  const $partners = site.connectCollection('Partners');

  site.get({
    name: 'Partners',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/partners/add', (req, res) => {
    let response = {
      done: false,
    };

    let partner_doc = req.body;
    partner_doc.$req = req;
    partner_doc.$res = res;

    partner_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $partners.findOne(
      {
        where: {
          $or: [
            {
              name_ar: partner_doc.name_ar,
            },
            {
              name_en: partner_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = 'Name Exists';
          res.json(response);
        } else {
          $partners.add(partner_doc, (err, doc) => {
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

  site.post('/api/partners/update', (req, res) => {
    let response = {
      done: false,
    };

    let partner_doc = req.body;

    partner_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (partner_doc.id) {
      $partners.findOne(
        {
          where: {
            $or: [
              {
                name_ar: partner_doc.name_ar,
              },
              {
                name_en: partner_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != partner_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $partners.edit(
              {
                where: {
                  id: partner_doc.id,
                },
                set: partner_doc,
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

  site.post('/api/partners/view', (req, res) => {
    let response = {
      done: false,
    };

    $partners.findOne(
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

  site.post('/api/partners/delete', (req, res) => {
    let response = {
      done: false,
    };

    let id = req.body.id;

    if (id) {
      $partners.delete(
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

  site.post({ name: '/api/partners/all', public: true }, (req, res) => {
    let response = {
      done: false,
    };

    let where = req.body.where || {};
    let search = req.body.search;

    if (req.session.user && req.session.user.role) {
      if (req.session.user.role.name == 'trainer' || req.session.user.role.name == 'partner') {
        let partnersId = [];
        req.session.user.partners_list.forEach((_p) => {
          if (_p.partner.id) {
            partnersId.push(_p.partner.id);
          }
        });
        where['id'] = { $in: partnersId };
      }
    }

    if (search) {
      where.$or = [];

      where.$or.push({
        name_ar: site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        name_en: site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        phone: site.get_RegExp(search, 'i'),
      });
    }

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

    $partners.findMany(
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

  site.addPartners = function (obj) {
    $partners.add(obj, (err) => {
      if (err) {
        console.log(err, 'Partners');
      } else {
        return;
      }
    })
  };

  site.getPartners = function (obj, callback) {
    callback = callback || function () { };

    $partners.findMany({ where: obj.where || {}, select: obj.select || {} }, (err, partners) => {
     callback(partners);
    })

  };
};
