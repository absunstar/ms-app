module.exports = function init(site) {
  const $users = site.connectCollection('users_info');
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

  site.get({
    name: 'ForgetPassWord',
    path: __dirname + '/site_files/html/forget_password.html',
    parser: 'html',
    compress: true,
    public: true,
  });

  site.get(
    {
      name: 'changePassWord',
      parser: 'html',
      compress: true,
      public: true,
    },
    (req, res) => {
      if (req.query.code) {
        site.security.getUser(
          {
            forgetPasswordCode: req.query.code,
          },
          (err, doc) => {
            if (!err && doc) {
              res.render('accounts/reset_password.html', { code: req.query.code });
            } else {
              res.json({ error: 'Code is invalid' });
            }
          }
        );
      } else {
        res.json({ error: 'Code is invalid' });
      }
    }
  );

  site.post({
    name: '/api/accounts_type/all',
    path: __dirname + '/site_files/json/accounts_type.json',
    public: true,
  });

  site.isOverEighteen = function (birthday) {
    birthday = new Date(birthday);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    var age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age >= 15) {
      return true;
    } else {
      return false;
    }
  };

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

    if (req.body.birthdate) {
      if (!site.isOverEighteen(req.body.birthdate)) {
        response.error = 'A student under 15 years old cannot register';
        res.json(response);
        return;
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

    if (!req.session.user) {
      response.error = 'You Are Not Login';
      res.json(response);
      return;
    }

    let user = req.body;
    delete user.retype_password;
    user.$req = req;
    user.$res = res;
    site.security.getUser(
      {
        'role.name': 'trainee',
        id_number: user.id_number,
      },
      (err, doc) => {
        if (!err) {
          if (doc && doc.id) {
            if (doc.email == user.email) {
              response.error = 'User Exists';
            } else if (doc.id_number == user.id_number) {
              response.error = 'Number Id Is Exists';
            }
            res.json(response);
            return;
          } else {

            if (user.birthdate) {
              if (!site.isOverEighteen(user.birthdate)) {
                response.error = 'A student under 15 years old cannot register';
                res.json(response);
                return;
              }
            }

            $users.findOne(
              {
                where: {
                  email: user.email,
                },
              },
              (err, doc) => {
                if (doc && doc.id) {
                  response.error = 'Email Is Exist';
                  res.json(response);
                  return;
                }
                $users.add(user, (err, doc) => {
                  if (!err) {
                    response.done = true;
                    response.doc = doc;
                    res.json(response);
                    doc.activationCode = Math.random().toString().replace('.', '');
                    site.security.updateUser(doc, (err) => {
                      let realHost = req.headers['origin'].replace('127.0.0.1:44442', '');

                      doc.activeLink = `${realHost}/api/user/activation?id=${doc.id}&code=${doc.activationCode}`;
                      site.sendMailMessage({
                        to: doc.email,
                        subject: `Activatin Link`,
                        message: `<a target="_blank" href="${doc.activeLink}"> Click Here To Activate Your Account </a>`,
                      });
                    });
                  } else {
                    response.error = err.message;
                    res.json(response);
                    return;
                  }
                });
              }
            );
          }
        } else {
          response.error = err.message;
          res.json(response);
        }
      }
    );
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
    user.email = user.email;
    /*     site.security.isUserExists(user, function (err, user_found) {
      if (user_found && user.id != user_found.id) {
        response.error = 'Email Is Exist';
        res.json(response);
        return;
      }
 */
    $users.findOne(
      {
        where: {
          email: user.email,
        },
      },
      (err, doc) => {
        if (doc && user.id != doc.id) {
          response.error = 'Email Is Exist';
          res.json(response);
          return;
        }

        if (user.birthdate) {
          if (!site.isOverEighteen(user.birthdate)) {
            response.error = 'A student under 15 years old cannot register';
            res.json(response);
            return;
          }
        }

        site.security.updateUser(user, (err) => {
          if (!err) {
            response.done = true;
          } else {
            response.error = err.message;
          }
          res.json(response);
        });
      }
    );
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
    let where = {};

    if (req.body.id) {
      where['id'] = req.body.id;
    }

    if (req.body.email) {
      where['email'] = req.body.email;
    }
    site.security.getUser(where, (err, doc) => {
      if (!err) {
        response.done = true;
        response.doc = doc;
      } else {
        response.error = err.message;
      }
      res.json(response);
    });
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
    let search = req.body.search;
    if (where['user_name']) {
      where['$or'] = [{ first_name: site.get_RegExp(where['user_name'], 'i') }, { last_name: site.get_RegExp(where['user_name'], 'i') }];
      delete where['user_name'];
    }
    if (where['last_name']) {
      where['last_name'] = site.get_RegExp(where['last_name'], 'i');
    }

    if (where['user_type']) {
      where['role.name'] = where['user_type'].name;
      delete where['user_type'];
    }

    if (where['email']) {
      where['email'] = site.get_RegExp(where['email'], 'i');
    }

    if (where['not_active']) {
      where['active'] = false;
      delete where['not_active'];
    }

    if (where['active_search']) {
      where['active'] = true;
      delete where['active_search'];
    }

    if (search) {
      where.$or = [];

      where.$or.push({
        first_name: site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        last_name: site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        email: site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        phone: site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        mobile: site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        id_number: search,
      });
    }

    site.security.getUsers(
      {
        where: where,
        limit: req.body.limit || 100,
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

  site.onPOST('/api/user/send-activation-link', (req, res) => {
    let response = {
      done: true,
      user: req.data,
    };
    response.user.activationCode = Math.random().toString().replace('.', '');
    site.security.updateUser(response.user, (err) => {
      if (!err) {
        response.done = true;
      } else {
        response.error = err.message;
      }
      let realHost = req.headers['origin'].replace('127.0.0.1:44442', '');

      response.link = `${realHost}/api/user/activation?id=${response.user.id}&code=${response.user.activationCode}`;
      site.sendMailMessage({
        to: response.user.email,
        subject: `Activatin Link`,
        message: `<a target="_blank" href="${response.link}"> Click Here To Activate Your Account </a>`,
      });
      res.json(response);
    });
  });

  site.onGET({ name: '/api/user/activation', public: true }, (req, res) => {
    let response = {
      done: false,
    };

    $users.findOne(
      {
        where: {
          id: req.query.id,
        },
      },
      (err, doc) => {
        if (!err && doc && doc.activationCode == req.query.code) {
          doc.forgetPasswordCode = Math.random().toString().replace('.', '');
          doc.active = true;
          site.security.updateUser(doc, () => {
            res.redirect(`/changePassWord?code=${doc.forgetPasswordCode}&activated=true`);
          });
        } else {
          response.error = 'Error While Activated User';
          res.json(response);
        }
      }
    );
  });

  site.onPOST({ name: '/api/user/send-forget-password-link', public: true }, (req, res) => {
    let response = {
      user: req.data,
    };
    $users.findOne(
      {
        where: {
          email: response.user.email,
        },
      },
      (err, doc) => {
        if (!doc) {
          response.error = 'Email Not Exist';
          res.json(response);
          return;
        }

        doc.forgetPasswordCode = Math.random().toString().replace('.', '');
        $users.update(doc, (err) => {
          if (!err) {
            response.done = true;
            let realHost = req.headers['origin'].replace('127.0.0.1:44442', '');

            response.link = `${realHost}/changePassWord?code=${doc.forgetPasswordCode}`;
            site.sendMailMessage({
              to: doc.email,
              subject: `Forget Password Link`,
              message: `<a target="_blank" href="${response.link}"> Click Here To Change Your Password </a>`,
            });
          } else {
            response.error = err.message;
          }
          res.json(response);
        });
      }
    );
  });

  site.post(
    {
      name: '/api/user/new-password',
      public: true,
    },
    (req, res) => {
      let response = {
        done: false,
      };

      let user = req.body;

      delete user.$$hashKey;

      site.security.getUser(
        {
          forgetPasswordCode: user.code,
        },
        (err, doc) => {
          if (!err && doc) {
            doc.password = user.new_password;
            delete doc.forgetPasswordCode;
            site.security.updateUser(doc);
            response.done = true;
            res.json(response);
          } else {
            response.error = 'Error Email not correct';
            res.json(response);
          }
        }
      );
    }
  );
};
