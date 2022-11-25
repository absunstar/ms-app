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

  site.get({
    name: 'ViewCompany',
    path: __dirname + '/site_files/html/view_company.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/companies/add', (req, res) => {
    let response = {
      done: false,
    };



    let company_doc = req.body;
    company_doc.$req = req;
    company_doc.$res = res;

    company_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $company.findMany(
      {
        where: {
          'add_user_info.id': req.session.user.id
        },
      },
      (err, docs) => {
        if (!err && docs && req.session.user.limited_companies == true) {
          response.error = 'It is not allowed to add other companies';
          res.json(response);
        } else {


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

  site.post('/api/companies/update', (req, res) => {
    let response = {
      done: false,
    };

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
              (err, result) => {
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

  site.post('/api/companies/view', (req, res) => {
    let response = {
      done: false,
    };



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

  site.post('/api/companies/delete', (req, res) => {
    let response = {
      done: false,
    };

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

  site.post({ name: '/api/companies/all', public: true }, (req, res) => {
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

  site.post({ name: '/api/companies/logos', public: true }, (req, res) => {
    let response = {
      done: false,
    };

    req.body.select = { image: 1 };
    let where = {};

    where['active'] = true;
    where['logo_view'] = true;

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
    if (company.id) {
      where['id'] = company.id
    }
    where['approve.id'] = 2
    $company.findMany(
      {
        where: where,
      },
      (err, docs) => {
        if (!err && docs) callback(docs);
        else callback(false);
      }
    );
  };
};
