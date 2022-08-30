module.exports = function init(site) {
  const $industry = site.connectCollection('Industries');

  site.get({
    name: 'Industries',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.on('[company][created]', (doc) => {
    $industry.add(
      {
        code: '1-Test',
        name_ar: 'بلد إفتراضية',
        name_en: 'Default Industry',
        image: '/images/industry.png',
        active: true,
      },
      (err, doc1) => {}
    );
  });

  site.post('/api/industries/add', (req, res) => {
    let response = {
      done: false,
    };



    let industry_doc = req.body;
    industry_doc.$req = req;
    industry_doc.$res = res;

    industry_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $industry.findOne(
      {
        where: {
          $or: [
            {
              name_ar: industry_doc.name_ar,
            },
            {
              name_en: industry_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = err.message;
          res.json(response);
        } else {

          $industry.add(industry_doc, (err, doc) => {
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

  site.post('/api/industries/update', (req, res) => {
    let response = {
      done: false,
    };



    let industry_doc = req.body;

    industry_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (industry_doc.id) {
      $industry.findOne(
        {
          where: {
            $or: [
              {
                name_ar: industry_doc.name_ar,
              },
              {
                name_en: industry_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != industry_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $industry.edit(
              {
                where: {
                  id: industry_doc.id,
                },
                set: industry_doc,
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

  site.post('/api/industries/view', (req, res) => {
    let response = {
      done: false,
    };



    $industry.findOne(
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

  site.post('/api/industries/delete', (req, res) => {
    let response = {
      done: false,
    };



    let id = req.body.id;

    if (id) {
      $industry.delete(
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

  site.post({name : '/api/industries/all',public : true}, (req, res) => {
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

    $industry.findMany(
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
