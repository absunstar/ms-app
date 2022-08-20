module.exports = function init(site) {
  const $questions = site.connectCollection('Questions');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'Questions',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post({
    name: '/api/difficulty/all',
    path: __dirname + '/site_files/json/difficulty.json',
  });

  site.on('[company][created]', (doc) => {
    $questions.add(
      {
        code: '1-Test',
        name_ar: 'سؤال إفتراضية',
        name_en: 'Default Question',
        image: '/images/question.png',
        active: true,
      },
      (err, doc1) => {}
    );
  });

  site.post('/api/questions/add', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let questions_doc = req.body;
    questions_doc.$req = req;
    questions_doc.$res = res;

    questions_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $questions.findOne(
      {
        where: {
          $or: [
            {
              name_ar: questions_doc.name_ar,
            },
            {
              name_en: questions_doc.name_en,
            },
          ],
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = 'Name Exists';
          res.json(response);
        } else {
       

          $questions.add(questions_doc, (err, doc) => {
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

  site.post('/api/questions/update', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let questions_doc = req.body;

    questions_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (questions_doc.id) {
      $questions.findOne(
        {
          where: {
            $or: [
              {
                name_ar: questions_doc.name_ar,
              },
              {
                name_en: questions_doc.name_en,
              },
            ],
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != questions_doc.id) {
            response.error = 'Name Exists';
            res.json(response);
          } else {
            $questions.edit(
              {
                where: {
                  id: questions_doc.id,
                },
                set: questions_doc,
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

  site.post('/api/questions/view', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    $questions.findOne(
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

  site.post('/api/questions/delete', (req, res) => {
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
      $questions.delete(
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

  site.post('/api/questions/all', (req, res) => {
    let response = {
      done: false,
    };

    let where = req.body.where || {};
  
    if (where['name']) {
      where['name'] = site.get_RegExp(where['name'], 'i');
    }

    if (where['training_type'] && where['training_type'].id) {
      where['training_type.id'] = where['training_type'].id;
      delete where['training_type'];
    }

    if (where['training_category'] && where['training_category'].id) {
      where['training_category.id'] = where['training_category'].id;
      delete where['training_category'];
    }

    if (where['difficulty'] && where['difficulty'].id) {
      where['difficulty.id'] = where['difficulty'].id;
      delete where['difficulty'];
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


    $questions.findMany(
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
