module.exports = function init(site) {
  const $questions = site.connectCollection('Questions');

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

  site.post('/api/questions/add', (req, res) => {
    let response = {
      done: false,
    };

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
          name: questions_doc.name,
        },
      },
      (err, doc) => {
        if (!err && doc) {
          response.error = 'Question Exists';
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

    let questions_doc = req.body;

    questions_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (questions_doc.id) {
      $questions.findOne(
        {
          where: {
            name: questions_doc.name,
          },
        },
        (err, doc) => {
          if (!err && doc && doc.id != questions_doc.id) {
            response.error = 'Question Exists';
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

  site.getQuestionsToExam = function (data, callback) {
    $questions.findMany(
      {
        where: data.where,
        select: { id: 1, name: 1, answers_list: 1, difficulty: 1 },
      },
      (err, docs) => {
        if (!err) {
          if (docs && data.exam_template) {
            let easyCount = site.toNumber(((data.exam_template.easy * data.number_questions) / 100).toFixed());
            let mediumCount = site.toNumber(((data.exam_template.medium * data.number_questions) / 100).toFixed());
            let hardCount = data.number_questions - (easyCount + mediumCount);
            let easyList = docs
              .filter((_doc) => _doc.difficulty.id == 1)
              .sort(() => 0.5 - Math.random())
              .slice(0, easyCount);
            let mediumList = docs
              .filter((_doc) => _doc.difficulty.id == 2)
              .sort(() => 0.5 - Math.random())
              .slice(0, 5);
            let hardList = docs
              .filter((_doc) => _doc.difficulty.id == 3)
              .sort(() => 0.5 - Math.random())
              .slice(0, hardCount);

            let questionslist = easyList.concat(mediumList, hardList);
            questionslist.forEach((_q) => {
              delete _q.difficulty;
            });
            callback(questionslist);
          } else {
            callback(false);
          }
        }
      }
    );
  };

  site.addQuestions = function (obj) {
    $questions.add(obj, (err) => {
      if (err) {
        console.log(err, 'Questions');
      } else {
        return;
      }
    })
  };

  site.getQuestions = function (obj, callback) {
    callback = callback || function () { };

    $questions.findMany({ where: obj.where || {}, select: obj.select || {} }, (err, Question) => {
     callback(Question);
    })

  };
 
};
