module.exports = function init(site) {
  const $exam_templates = site.connectCollection('ExamTemplates');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'ExamTemplates',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.on('[company][created]', (doc) => {
    $exam_templates.add(
      {
        code: '1-Test',
        name_ar: 'مجال عمل إفتراضي',
        name_en: 'Default Exam Template',
        image: '/images/exam_templates.png',
        active: true,
      },
      (err, doc1) => {}
    );
  });

  site.post('/api/exam_templates/add', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let exam_templates_doc = req.body;
    exam_templates_doc.$req = req;
    exam_templates_doc.$res = res;

    exam_templates_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (typeof exam_templates_doc.active === 'undefined') {
      exam_templates_doc.active = true;
    }

    $exam_templates.findOne(
      {
        where: {
          $or: [
            {
              name_ar: exam_templates_doc.name_ar,
            },
            {
              name_en: exam_templates_doc.name_en,
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
          // if (!exam_templates_doc.code && !cb.auto) {
          //   response.error = 'Must Enter Code';
          //   res.json(response);
          //   return;
          // } else if (cb.auto) {
          //   exam_templates_doc.code = cb.code;
          // }

          $exam_templates.add(exam_templates_doc, (err, doc) => {
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

  site.post('/api/exam_templates/update', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let exam_templates_doc = req.body;

    exam_templates_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (exam_templates_doc.id) {
      $exam_templates.findOne(
        {
          where: {
            $or: [
              {
                name_ar: exam_templates_doc.name_ar,
              },
              {
                name_en: exam_templates_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != exam_templates_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $exam_templates.edit(
              {
                where: {
                  id: exam_templates_doc.id,
                },
                set: exam_templates_doc,
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

  site.post('/api/exam_templates/view', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    $exam_templates.findOne(
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

  site.post('/api/exam_templates/delete', (req, res) => {
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
      $exam_templates.delete(
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

  site.post('/api/exam_templates/all', (req, res) => {
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

    $exam_templates.findMany(
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
