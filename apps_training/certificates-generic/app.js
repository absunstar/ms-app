module.exports = function init(site) {
  const $certificates = site.connectCollection('Certificates');

  site.get({
    name: 'CertificatesGeneric',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/certificates/add', (req, res) => {
    let response = {
      done: false,
    };



    let certificates_doc = req.body;
    certificates_doc.$req = req;
    certificates_doc.$res = res;

    certificates_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $certificates.add(certificates_doc, (err, doc) => {
      if (!err) {
        response.done = true;
        response.doc = doc;
      } else {
        response.error = err.message;
      }
      res.json(response);
    });
  });

  site.post('/api/certificates/update', (req, res) => {
    let response = {
      done: false,
    };



    let certificates_doc = req.body;

    certificates_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (certificates_doc.id) {
      $certificates.edit(
        {
          where: {
            id: certificates_doc.id,
          },
          set: certificates_doc,
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

  site.post('/api/certificates/view', (req, res) => {
    let response = {
      done: false,
    };



    $certificates.findOne(
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

  site.post('/api/certificates/delete', (req, res) => {
    let response = {
      done: false,
    };



    let id = req.body.id;

    if (id) {
      $certificates.delete(
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

  site.post('/api/certificates/all', (req, res) => {
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

    if (where['partner'] && where['partner'].id) {
      where['partner.id'] = where['partner'].id;
      delete where['partner'];
    }

    if (where['training_type'] && where['training_type'].id) {
      where['training_type.id'] = where['training_type'].id;
      delete where['training_type'];
    }

    if (where['training_category'] && where['training_category'].id) {
      where['training_category.id'] = where['training_category'].id;
      delete where['training_category'];
    }

    if (where['training_center'] && where['training_center'].id) {
      where['training_center.id'] = where['training_center'].id;
      delete where['training_center'];
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
    $certificates.findMany(
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

  site.getCertificates = function (where, callback) {
    $certificates.findMany(
      {
        where: where,
      },
      (err, docs) => {
        if (!err) {
          if (docs) {
            callback(docs);
          } else {
            callback(false);
          }
        }
      }
    );
  };

};
