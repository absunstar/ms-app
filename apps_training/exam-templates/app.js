module.exports = function init(site) {
  const $exam_templates = site.connectCollection('ExamTemplates');

  site.get({
    name: 'ExamTemplates',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/exam_templates/add', (req, res) => {
    let response = {
      done: false,
    };

    let exam_templates_doc = req.body;
    exam_templates_doc.$req = req;
    exam_templates_doc.$res = res;

    if (exam_templates_doc.easy + exam_templates_doc.medium + exam_templates_doc.hard != 100) {
      response.error = 'The percentage sum has to be 100';
      res.json(response);
      return;
    }

    exam_templates_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

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

  site.getExamTemplates = function (obj, callback) {
    callback = callback || function () {};

    $exam_templates.findMany({ where: obj.where || {}, select: obj.select || {} }, (err, exam_templates) => {
      callback(exam_templates);
    });
  };

  site.addExamTemplates = function (obj, callback) {
    $exam_templates.add(obj, callback);
  };
};
