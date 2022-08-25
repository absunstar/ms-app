module.exports = function init(site) {
  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
    public: true,
  });

  site.get({
    name: 'Accounts',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.get({
    name: 'Register',
    path: __dirname + '/site_files/html/register.html',
    parser: 'html',
    compress: true,
    public: true,
  });

  site.get({
    name: 'Login',
    path: __dirname + '/site_files/html/login.html',
    parser: 'html',
    compress: true,
    public: true,
  });

  site.post({
    name: '/api/accounts_type/all',
    path: __dirname + '/site_files/json/accounts_type.json',
    public: true,
  });

  site.post({ name: '/api/register', public: true }, (req, res) => {
    let response = {};

    if (req.body.$encript) {
      if (req.body.$encript === '64') {
        req.body.email = site.fromBase64(req.body.email);
        req.body.password = site.fromBase64(req.body.password);
      } else if (req.body.$encript === '123') {
        req.body.email = site.from123(req.body.email);
        req.body.password = site.from123(req.body.password);
      }
    }

    delete req.body.retype_password;

    let user = {
      ...req.body,
      ip: req.ip,
      active: true,
      created_date: new Date(),
      $req: req,
      $res: res,
    };

    site.security.register(user, function (err, doc) {
      if (!err) {
        response.user = doc;
        response.done = true;
      } else {
        response.error = err.message;
      }
      res.json(response);
    });
  });

  site.post('/api/user/add', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user && req.body.type != 'customer') {
      response.error = 'You Are Not Login';
      res.json(response);
      return;
    }

    let user = req.body;
    delete user.retype_password
    user.$req = req;
    user.$res = res;
    site.security.addUser(user, (err, _id) => {
      if (!err) {
        response.done = true;
      } else {
        response.error = err.message;
      }
      res.json(response);
    });
  });

  site.post('/api/user/update', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'You Are Not Login';
      res.json(response);
      return;
    }

    let user = req.body;
    user.$req = req;
    user.$res = res;
    delete user.$$hashKey;

    site.security.updateUser(user, (err) => {
      if (!err) {
        response.done = true;
      } else {
        response.error = err.message;
      }
      res.json(response);
    });
  });

  site.post('/api/user/delete', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'You Are Not Login';
      res.json(response);
      return;
    }

    let id = req.body.id;
    if (id) {
      site.security.deleteUser(
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
      response.error = 'No ID Requested';
      res.json(response);
    }
  });

  site.post('/api/user/view', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'You Are Not Login';
      res.json(response);
      return;
    }

    site.security.getUser(
      {
        id: req.body.id,
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

  site.post({ name: '/api/user/login', public: true }, function (req, res) {
    let response = {
      accessToken: req.session.accessToken,
    };

    if (req.body.$encript) {
      if (req.body.$encript === '64') {
        req.body.email = site.fromBase64(req.body.email);
        req.body.password = site.fromBase64(req.body.password);
      } else if (req.body.$encript === '123') {
        req.body.email = site.from123(req.body.email);
        req.body.password = site.from123(req.body.password);
      }
    }

    if (site.security.isUserLogin(req, res)) {
      response.error = 'Login Error , You Are Loged';
      response.done = true;
      res.json(response);
      return;
    }

    site.security.getUser(
      {
        email: req.body.email,
      },
      (err, doc) => {
        if (!err) {
          response.done = true;
          let user = { ...doc };

          if (user.active == false) {
            response.error = 'The account is inactive';
            response.done = true;
            res.json(response);
            return;
          }

          site.security.login(
            {
              email: req.body.email,
              password: req.body.password,
              $req: req,
              $res: res,
            },
            function (err, user) {
              if (!err) {
                response.user = user;

                response.done = true;
              } else {
                response.error = err.message;
              }

              res.json(response);
            }
          );
        } else {
          response.error = err.message;
        }
      }
    );
  });

  site.post('/api/user/logout', function (req, res) {
    let response = {
      accessToken: req.session.accessToken,
      done: true,
    };

    site.security.logout(req, res, (err, ok) => {
      if (ok) {
        response.done = true;
        res.json(response);
      } else {
        response.error = 'You Are Not Loged';
        response.done = true;
        res.json(response);
      }
    });
  });

  site.post('/api/users/all', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'You Are Not Login';
      res.json(response);
      return;
    }
    let where = req.body.where || {};

    if (where['first_name']) {
      where['first_name'] = site.get_RegExp(where['first_name'], 'i');
    }
    if (where['last_name']) {
      where['last_name'] = site.get_RegExp(where['last_name'], 'i');
    }

    if (where['job_title']) {
      where['job_title'] = site.get_RegExp(where['job_title'], 'i');
      delete where['job_title'];
    }

    if (where['email']) {
      where['email'] = site.get_RegExp(where['email'], 'i');
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

    if (req.body.search) {
      if (where['qualifications'] && where['qualifications'].length > 0) {
        where.$or = where.$or || [];
        for (let i = 0; i < where['qualifications'].length; i++) {
          let element = where['qualifications'][i];
          where.$or.push({
            'qualification.id': element.id,
          });
        }
      }

      if (where['experiences'] && where['experiences'].length > 0) {
        where.$or = where.$or || [];
        for (let i = 0; i < where['experiences'].length; i++) {
          let element = where['experiences'][i];
          where.$or.push({
            'experience.id': element.id,
          });
        }
      }

      if (where['countries'] && where['countries'].length > 0) {
        where.$or = where.$or || [];
        for (let i = 0; i < where['countries'].length; i++) {
          let element = where['countries'][i];
          where.$or.push({
            'country.id': element.id,
          });
        }
      }

      if (where['languages'] && where['languages'].length > 0) {
        where.$or = where.$or || [];
        for (let i = 0; i < where['languages'].length; i++) {
          let element = where['languages'][i];
          where.$or.push({
            'languages.id': element.id,
          });
        }
      }

      if (where['genders'] && where['genders'].length > 0) {
        where.$or = where.$or || [];
        for (let i = 0; i < where['genders'].length; i++) {
          let element = where['genders'][i];
          where.$or.push({
            'gender.id': element.id,
          });
        }
      }

    
      delete where['active_search'];
      delete where['not_active'];
      delete where['qualifications'];
      delete where['experiences'];
      delete where['countries'];
      delete where['languages'];
      delete where['genders'];
    }
    if (where['general_search']) {
      where.$or = where.$or || [];

      where.$or.push({
        job_title: site.get_RegExp(where['general_search'], 'i'),
      });

      where.$or.push({
        first_name: site.get_RegExp(where['general_search'], 'i'),
      });

      where.$or.push({
        last_name: site.get_RegExp(where['general_search'], 'i'),
      });

      where.$or.push({
        email: site.get_RegExp(where['general_search'], 'i'),
      });

      where.$or.push({
        mobile: site.get_RegExp(where['general_search'], 'i'),
      });

      where.$or.push({
        phone: site.get_RegExp(where['general_search'], 'i'),
      });
      delete where['general_search'];
    }


    site.security.getUsers(
      {
        where: where,
      },
      (err, docs, count) => {
        if (!err) {
    response.done = true;
          for (let i = 0; i < docs.length; i++) {
            let u = docs[i];
            u.image = u.image || '/images/user.png';
          }
          response.users = docs;
          response.count = count;
        }
        res.json(response);
      }
    );
  });
};
