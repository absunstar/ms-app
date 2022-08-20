module.exports = function init(site) {
  const $training = site.connectCollection('Training');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'Training',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post({
    name: '/api/privacy_type/all',
    path: __dirname + '/site_files/json/privacy_type.json',
  });

  site.post({
    name: '/api/days/all',
    path: __dirname + '/site_files/json/days.json',
  });

  site.on('[company][created]', (doc) => {
    $training.add(
      {
        code: '1-Test',
        name_ar: 'تدريب إفتراضي',
        name_en: 'Default Training',
        image: '/images/training.png',
        active: true,
      },
      (err, doc1) => {}
    );
  });

  site.post('/api/training/add', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let training_doc = req.body;
    training_doc.$req = req;
    training_doc.$res = res;

    training_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (training_doc.start_date && training_doc.end_date && new Date(training_doc.start_date) > new Date(training_doc.end_date)) {
      response.error = 'Start Date cannot be bigger than End date';
      res.json(response);
      return;
    }

    $training.add(training_doc, (err, doc) => {
      if (!err) {
        response.done = true;
        response.doc = doc;
      } else {
        response.error = err.message;
      }
      res.json(response);
    });
  });

  site.post('/api/training/update', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let training_doc = req.body;

    training_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (training_doc.id) {
      $training.edit(
        {
          where: {
            id: training_doc.id,
          },
          set: training_doc,
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
    } else {
      response.error = 'no id';
      res.json(response);
    }
  });

  site.post('/api/training/view', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    $training.findOne(
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

  site.post('/api/training/delete', (req, res) => {
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
      $training.delete(
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

  site.post('/api/training/all', (req, res) => {
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

    if (where['country'] && where['country'].id) {
      where['country.id'] = where['country'].id;
      delete where['country'];
    }

    if (where['city'] && where['city'].id) {
      where['city.id'] = where['city'].id;
      delete where['city'];
    }

    if (where['partner'] && where['partner'].id) {
      where['partner.id'] = where['partner'].id;
      delete where['partner'];
    }

    if (where['sub_partner'] && where['sub_partner'].id) {
      where['sub_partner.id'] = where['sub_partner'].id;
      delete where['sub_partner'];
    }

    if (where['trainer'] && where['trainer'].id) {
      where['trainer.id'] = where['trainer'].id;
      delete where['trainer'];
    }

    if (where['training_center'] && where['training_center'].id) {
      where['training_center.id'] = where['training_center'].id;
      delete where['training_center'];
    }

    if (where['training_type'] && where['training_type'].id) {
      where['training_type.id'] = where['training_type'].id;
      delete where['training_type'];
    }

    if (where['training_category'] && where['training_category'].id) {
      where['training_category.id'] = where['training_category'].id;
      delete where['training_category'];
    }

    if (where['privacy_type'] && where['privacy_type'].id) {
      where['privacy_type.id'] = where['privacy_type'].id;
      delete where['privacy_type'];
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

    $training.findMany(
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
