module.exports = function init(site) {
 

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
    public : true
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
    public : true
  });

  site.get({
    name: "Login",
    path: __dirname + "/site_files/html/login.html",
    parser: "html",
    compress: true,
    public : true
  })

  
  site.post({
    name: '/api/accounts_type/all',
    path: __dirname + '/site_files/json/accounts_type.json',
    public : true
  });


  site.post({name : '/api/register' ,   public : true}, (req, res) => {
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

};
