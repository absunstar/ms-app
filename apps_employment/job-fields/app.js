module.exports = function init(site) {
  const $job_fields = site.connectCollection('JobFields');


  site.get({
    name: 'JobFields',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/job_fields/add', (req, res) => {
    let response = {
      done: false,
    };



    let job_fields_doc = req.body;
    job_fields_doc.$req = req;
    job_fields_doc.$res = res;

    job_fields_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $job_fields.findOne(
      {
        where: {
          $or: [
            {
              name_ar: job_fields_doc.name_ar,
            },
            {
              name_en: job_fields_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = 'Name Exists';
          res.json(response);
        } else {
        

          $job_fields.add(job_fields_doc, (err, doc) => {
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

  site.post('/api/job_fields/update', (req, res) => {
    let response = {
      done: false,
    };



    let job_fields_doc = req.body;

    job_fields_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (job_fields_doc.id) {
      $job_fields.findOne(
        {
          where: {
            $or: [
              {
                name_ar: job_fields_doc.name_ar,
              },
              {
                name_en: job_fields_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != job_fields_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $job_fields.edit(
              {
                where: {
                  id: job_fields_doc.id,
                },
                set: job_fields_doc,
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

  site.post('/api/job_fields/view', (req, res) => {
    let response = {
      done: false,
    };



    $job_fields.findOne(
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

  site.post('/api/job_fields/delete', (req, res) => {
    let response = {
      done: false,
    };



    let id = req.body.id;

    if (id) {
      $job_fields.delete(
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

  site.post({name : '/api/job_fields/all' , public :true}, (req, res) => {
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

    $job_fields.findMany(
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
