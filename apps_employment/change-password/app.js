module.exports = function init(site) {
  const $company = site.connectCollection('Companies');
  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'changePassword',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
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
          let user = { ...doc };
          if (!req.body.all) {
            delete user.password;
          }
          response.doc = user;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  
  site.post('/api/user/change_password', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    site.security.getUser(
      {
        email: req.body.user.email,
      },
      (err, user) => {
        if (!err && user) {
          let _user = { ...user };
            if (req.body.user.old_password !== _user.password) {
              response.error = 'Current Password Error';
              res.json(response);
              return;
            } else if (req.body.user.confirm_password !== req.body.user.new_password) {
              response.error = 'Password does not match';
              res.json(response);
              return;
            } else {
              _user.password = req.body.user.new_password;
            }
          
      
            site.security.updateUser(_user, (err1, user_doc) => {
              response.done = true;
              if (!err1 && user_doc) {
                response.doc = user_doc.doc;
                res.json(response);
              } else {
                response.error = 'Email is wrong';
                res.json(response);
              }
            });

        } else {
          response.error = err ? err.message : 'no doc';
        }
      })

    })

};
