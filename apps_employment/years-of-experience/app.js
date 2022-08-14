module.exports = function init(site) {
  const $years_of_experience = site.connectCollection('YearsOfExperience');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'YearsOfExperience',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.on('[company][created]', (doc) => {
    $years_of_experience.add(
      {
        code: '1-Test',
        name_ar: 'سنوات خبرة إفتراضية',
        name_en: 'Default Years Of Experience',
        image: '/images/years_of_experience.png',
        active: true,
      },
      (err, doc1) => {}
    );
  });

  site.post('/api/years_of_experience/add', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let years_of_experience_doc = req.body;
    years_of_experience_doc.$req = req;
    years_of_experience_doc.$res = res;

    years_of_experience_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (typeof years_of_experience_doc.active === 'undefined') {
      years_of_experience_doc.active = true;
    }

    $years_of_experience.findOne(
      {
        where: {
          $or: [
            {
              name_ar: years_of_experience_doc.name_ar,
            },
            {
              name_en: years_of_experience_doc.name_en,
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
            screen: 'language',
            date: new Date(),
          };

          // let cb = site.getNumbering(num_obj);
          // if (!years_of_experience_doc.code && !cb.auto) {
          //   response.error = 'Must Enter Code';
          //   res.json(response);
          //   return;
          // } else if (cb.auto) {
          //   years_of_experience_doc.code = cb.code;
          // }

          $years_of_experience.add(years_of_experience_doc, (err, doc) => {
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

  site.post('/api/years_of_experience/update', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let years_of_experience_doc = req.body;

    years_of_experience_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (years_of_experience_doc.id) {
      $years_of_experience.findOne(
        {
          where: {
            $or: [
              {
                name_ar: years_of_experience_doc.name_ar,
              },
              {
                name_en: years_of_experience_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != years_of_experience_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $years_of_experience.edit(
              {
                where: {
                  id: years_of_experience_doc.id,
                },
                set: years_of_experience_doc,
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

  site.post('/api/years_of_experience/view', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    $years_of_experience.findOne(
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

  site.post('/api/years_of_experience/delete', (req, res) => {
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
      $years_of_experience.delete(
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

  site.post('/api/years_of_experience/all', (req, res) => {
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

    $years_of_experience.findMany(
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
