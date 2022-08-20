module.exports = function init(site) {
  const $manage = site.connectCollection('Manage');
  site.manage_doc = {};
  $manage.findOne({}, (err, doc) => {
    if (!err && doc) {
      site.manage_doc = doc;
    }
  });

  site.get({
    name: 'Manage',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: false,
  });

  site.get({
    name: '/images',
    path: __dirname + '/site_files/images',
  });

  site.post('/api/manage/get', (req, res) => {
    let response = {
      done: false,
    };

    if (site.manage_doc && Object.keys(site.manage_doc).length != 0) {
      response.done = true;
      response.doc = site.manage_doc;
      res.json(response);
    } else {
   
      $manage.add({partners_logo_list : []}, (err, doc) => {
        if (!err && doc) {
          response.done = true;
          response.doc = doc;
          site.manage_doc = response.doc;
          res.json(response);
        } else {
          response.error = err.message;
          res.json(response);
        }
      });
    }
  });

  site.getManage = function (callback) {
    callback = callback || function () {};
    if (site.manage_doc) {
      callback(site.manage_doc);
      return site.manage_doc;
    }

  };

  site.post('/api/manage/save', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let data = req.data;
    $manage.update(data, (err, result) => {
      if (!err) {
        response.done = true;
        site.manage_doc = data;
      } else {
        response.error = err.message;
      }
      res.json(response);
    });
  });
};
