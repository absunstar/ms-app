module.exports = function init(site) {
  const $sub_partners = site.connectCollection('SubPartners');

  site.get({
    name: 'SubPartners',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/sub_partners/add', (req, res) => {
    let response = {
      done: false,
    };

    let sub_partner_doc = req.body;
    sub_partner_doc.$req = req;
    sub_partner_doc.$res = res;

    sub_partner_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $sub_partners.findOne(
      {
        where: {
          $or: [
            {
              name_ar: sub_partner_doc.name_ar,
            },
            {
              name_en: sub_partner_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = 'Name Exists';
          res.json(response);
        } else {
          $sub_partners.add(sub_partner_doc, (err, doc) => {
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

  site.post('/api/sub_partners/update', (req, res) => {
    let response = {
      done: false,
    };

    let sub_partner_doc = req.body;

    sub_partner_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (sub_partner_doc.id) {
      $sub_partners.findOne(
        {
          where: {
            $or: [
              {
                name_ar: sub_partner_doc.name_ar,
              },
              {
                name_en: sub_partner_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != sub_partner_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $sub_partners.edit(
              {
                where: {
                  id: sub_partner_doc.id,
                },
                set: sub_partner_doc,
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

  site.post('/api/sub_partners/view', (req, res) => {
    let response = {
      done: false,
    };

    $sub_partners.findOne(
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

  site.post('/api/sub_partners/delete', (req, res) => {
    let response = {
      done: false,
    };

    let id = req.body.id;

    if (id) {
      $sub_partners.delete(
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

  site.post('/api/sub_partners/all', (req, res) => {
    let response = {
      done: false,
    };

    let where = req.body.where || {};
    if (req.session.user && req.session.user.role) {
      if (req.session.user.role.name == 'trainer' || req.session.user.role.name == 'partner' || req.session.user.role.name == 'sub_partner') {
        let subPartnersId = [];
        req.session.user.partners_list.forEach((_p) => {
          if (_p.sub_partners) {
            _p.sub_partners.forEach((_s) => {
              subPartnersId.push(_s.id);
            });
          }
        });
        where['id'] = { $in: subPartnersId };
      }
    }

    if (where['name_ar']) {
      where['name_ar'] = site.get_RegExp(where['name_ar'], 'i');
    }

    if (where['name_en']) {
      where['name_en'] = site.get_RegExp(where['name_en'], 'i');
    }

    if (where['phone']) {
      where['phone'] = where['phone'];
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

    $sub_partners.findMany(
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

  site.addSubPartners = function (obj, callback) {
    $sub_partners.add(obj, callback);
  };

  site.getSubPartners = function (obj, callback) {
    callback = callback || function () {};

    $sub_partners.findMany({ where: obj.where || {}, select: obj.select || {} }, (err, subPartners) => {
      callback(subPartners);
    });
  };
};
