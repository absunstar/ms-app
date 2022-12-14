module.exports = function init(site) {
  const $countries = site.connectCollection('Countries');


  site.get({
    name: 'Countries',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/countries/add', (req, res) => {


    let response = {
      done: false,
    };



    let country_doc = req.body;
    country_doc.$req = req;
    country_doc.$res = res;

    country_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $countries.findOne(
      {
        where: {
          $or: [
            {
              name_ar: country_doc.name_ar,
            },
            {
              name_en: country_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = err.message;
          res.json(response);
        } else {
          $countries.add(country_doc, (err, doc) => {
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

  site.post('/api/countries/update', (req, res) => {
    let response = {
      done: false,
    };

    let country_doc = req.body;

    country_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (country_doc.id) {
      $countries.findOne(
        {
          where: {
            $or: [
              {
                name_ar: country_doc.name_ar,
              },
              {
                name_en: country_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != country_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $countries.edit(
              {
                where: {
                  id: country_doc.id,
                },
                set: country_doc,
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

  site.post('/api/countries/view', (req, res) => {
    let response = {
      done: false,
    };

    $countries.findOne(
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

  site.post('/api/countries/delete', (req, res) => {
    let response = {
      done: false,
    };

    let id = req.body.id;

    if (id) {
      $countries.delete(
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

  site.post('/api/countries/all', (req, res) => {
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

    $countries.findMany(
      {
        select: req.body.select || {},
        where: where,
        sort: req.body.sort || {
          name_en: 1,
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

  site.addCountries = function (obj) {
    $countries.add(obj, (err) => {
      if (err) {
        console.log(err, 'Countries');
      } else {
        return;
      }
    })
  };

  site.getCountries = function (obj, callback) {
    callback = callback || function () { };

    $countries.findMany({ where: obj.where || {}, select: obj.select || {} }, (err, countries) => {
     callback(countries);
    })

  };
 

  // site.post('/api/countries/migration', (req, res) => {

  //   let response = {
  //     done: false,
  //   };

  //   if (!req.session.user) {
  //     response.error = 'You Are Not Login';
  //     res.json(response);
  //     return;
  //   }

  //   $oldCountries.findMany(
  //     {},
  //     (err, docs, count) => {
  //       if (!err && docs) {
  //         docs.forEach((_doc, i) => {

  //           $countries.add({
  //             _id: _doc._id,
  //             active: _doc.IsActive,
  //             name_en: _doc.Name ? _doc.Name : _doc.Name2,
  //             name_ar:_doc.Name2 ? _doc.Name2 : _doc.Name,
  //             add_user_info: {
  //               date: _doc.CreatedAt,
  //             }
  //           }, (err) => {
  //             console.log(err);
  //           })
  //         });
  //         response.done = true;
  //         response.list = docs;
  //         response.count = count;
  //       } else {
  //         response.error = err.message;
  //       }
  //       res.json(response);
  //     }
  //   );
  // });
};
