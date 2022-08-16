module.exports = function init(site) {
  const $company = site.connectCollection('Companies');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'Companies',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.on('[company][created]', (doc) => {
    $company.add(
      {
        code: '1-Test',
        name_ar: 'شركة إفتراضية',
        name_en: 'Default Company',
        image: '/images/company.png',
        active: true,
      },
      (err, doc1) => {}
    );
  });

  site.post('/api/company/add', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let company_doc = req.body;
    company_doc.$req = req;
    company_doc.$res = res;

    company_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (typeof company_doc.active === 'undefined') {
      company_doc.active = true;
    }



    $company.findMany(
      {
        where: {
          'add_user_info.id' : req.session.user.id
        },
      },
      (err, docs) => {
        if (!err && docs && req.session.user.limited_companies == true) {
          response.error = 'It is not allowed to add other companies';
          res.json(response);
        } else {
          // let d = new Date();
          // d.setFullYear(d.getFullYear() + 1);
          // d.setMonth(1);
          let num_obj = {
            screen: 'company',
            date: new Date(),
          };

          // let cb = site.getNumbering(num_obj);
          // if (!company_doc.code && !cb.auto) {
          //   response.error = 'Must Enter Code';
          //   res.json(response);
          //   return;
          // } else if (cb.auto) {
          //   company_doc.code = cb.code;
          // }

          $company.add(company_doc, (err, doc) => {
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

  site.post('/api/company/update', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let company_doc = req.body;

    company_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (company_doc.id) {
      $company.findOne(
        {
          where: {
            $or: [
              {
                name_ar: company_doc.name_ar,
              },
              {
                name_en: company_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != company_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $company.edit(
              {
                where: {
                  id: company_doc.id,
                },
                set: company_doc,
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

  site.post('/api/company/view', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    $company.findOne(
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

  site.post('/api/company/delete', (req, res) => {
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
      $company.delete(
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

  site.post('/api/company/all', (req, res) => {
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
      where['phone'] = site.get_RegExp(where['phone'], 'i');
    }

    if (where['industry'] && where['industry'].id) {
      where['industry.id'] = where['industry'].id;
      delete where['industry'];
    }

    if (where['country'] && where['country'].id) {
      where['country.id'] = where['country'].id;
      delete where['country'];
    }

    if (where['city'] && where['city'].id) {
      where['city.id'] = where['city'].id;
      delete where['city'];
    }

    if (where.date_from && !where.date_to) {
      let d1 = site.toDate(where.date_from);
      let d2 = site.toDate(where.date_from);
      d2.setDate(d2.getDate() + 1);
      where['add_user_info.date'] = {
        $gte: d1,
        $lt: d2,
      };
      delete where['date_from'];
    } else if (where && where.date_to) {
      let d1 = site.toDate(where.date_from);
      let d2 = site.toDate(where.date_to);
      d2.setDate(d2.getDate() + 1);
      where['add_user_info.date'] = {
        $gte: d1,
        $lt: d2,
      };
      delete where['date_from'];
      delete where['date_to'];
    }

    if(where['not_active']){
      where['active'] = false;
    }

    if(where['active_search']){
      where['active'] = true;
    }

    if(where['not_active'] && where['active_search']){
      delete where['active'];
    }

    delete where['active_search'];
    delete where['not_active'];

    $company.findMany(
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

  site.getCompanies = function (company, callback) {
    callback = callback || {};
    let where = {}
    if(company.id){
      where['id'] =company.id
    }
    where['approve.id'] = 2
    $company.findMany(
      {
        where: where,
      },
      (err, docs) => {
        console.log(docs.length);
        if (!err && docs) callback(docs);
        else callback(false);
      }
    );
  };
};
