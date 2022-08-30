module.exports = function init(site) {
  const $cities = site.connectCollection('Cities');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'Cities',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.on('[company][created]', (doc) => {
    $cities.add(
      {
        code: '1-Test',
        name_ar: 'مدينة إفتراضية',
        name_en: 'Default City',
        image: '/images/city.png',
        active: true,
      },
      (err, doc1) => {}
    );
  });

  site.post('/api/cities/add', (req, res) => {
    let response = {
      done: false,
    };



    let city_doc = req.body;
    city_doc.$req = req;
    city_doc.$res = res;

    city_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });



    $cities.findOne(
      {
        where: {
          $or: [
            {
              name_ar: city_doc.name_ar,
            },
            {
              name_en: city_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = 'Name Exists';
          res.json(response);
        } else {

          $cities.add(city_doc, (err, doc) => {
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

  site.post('/api/cities/update', (req, res) => {
    let response = {
      done: false,
    };



    let city_doc = req.body;

    city_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (city_doc.id) {
      $cities.findOne(
        {
          where: {
            $or: [
              {
                name_ar: city_doc.name_ar,
              },
              {
                name_en: city_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != city_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $cities.edit(
              {
                where: {
                  id: city_doc.id,
                },
                set: city_doc,
                $req: req,
                $res: res,
              },
              (err) => {
                if (!err) {
                  response.done = true;
                } else {
                  response.error = err.message;
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

  site.post('/api/cities/view', (req, res) => {
    let response = {
      done: false,
    };



    $cities.findOne(
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

  site.post('/api/cities/delete', (req, res) => {
    let response = {
      done: false,
    };



    let id = req.body.id;

    if (id) {
      $cities.delete(
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

  site.post('/api/cities/all', (req, res) => {
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

    if (where['country']) {
      where['country.id'] = where['country'].id;
      delete where['country'];
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
    $cities.findMany(
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
