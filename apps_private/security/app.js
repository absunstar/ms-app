module.exports = function init(site) {

  site.post('/api/security/permissions', (req, res) => {

    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    response.done = true;
    response.permissions = site.security.permissions
    res.json(response)
  })

  site.post('/api/security/roles', (req, res) => {

    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    response.done = true;
    response.roles = site.security.roles
    res.json(response)
  })

  site.get({
    name: ["security" , "security/users"],
    path: __dirname + "/site_files/html/index.html",
    parser: "html css js",
    compress: false
  })

  site.get({
    name: '/images',
    path: __dirname + '/site_files/images'
  })

  site.post('/api/users/all', (req, res) => {

    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let where = req.body.where || {}

    if (where['user_name']) {
      where['profile.name'] = site.get_RegExp(where['user_name'], 'i');
      delete where['user_name']
    }

    if (where['job_title']) {
      where['profile.job_title'] = site.get_RegExp(where['job_title'], 'i');
      delete where['job_title']
    }

    if (where['email']) {
      where['email'] = site.get_RegExp(where['email'], 'i');
    }

    if(where['user_type'] ) {

      if(where['user_type'].id == 1) {
        where['profile.type'] = 'admin';

      } else if(where['user_type'].id == 2) {
        where['profile.type'] = 'employer';

      } else if(where['user_type'].id == 3) {
        where['profile.type'] = 'job-seeker';

      }

     delete where['user_type'];

    }

    if(where['not_active']){
      where['active'] = false;
    }

    if(where['active_search']){
      where['active'] = true;
    }

    if(where['not_active'] && where['active_search']){
      delete where['active'];
    }

    if(req.body.search){


    if(where['qualifications'] && where['qualifications'].length > 0){
      where.$or = where.$or || []
      for (let i = 0; i < where['qualifications'].length; i++) {
        let element = where['qualifications'][i];
        where.$or.push({
          'qualification.id': element.id
        })
      }
    }

    if(where['experiences'] && where['experiences'].length > 0){
      where.$or = where.$or || []
      for (let i = 0; i < where['experiences'].length; i++) {
        let element = where['experiences'][i];
        where.$or.push({
          'profile.experience.id': element.id
        })
      }
    }
    
    if(where['countries'] && where['countries'].length > 0){
      where.$or = where.$or || []
      for (let i = 0; i < where['countries'].length; i++) {
        let element = where['countries'][i];
        where.$or.push({
          'profile.country.id': element.id
        })
      }
    }

    if(where['languages'] && where['languages'].length > 0){
      where.$or = where.$or || []
      for (let i = 0; i < where['languages'].length; i++) {
        let element = where['languages'][i];
        where.$or.push({
          'profile.languages.id': element.id
        })
      }
    }

    if(where['genders'] && where['genders'].length > 0){
      where.$or = where.$or || []
      for (let i = 0; i < where['genders'].length; i++) {
        let element = where['genders'][i];
        where.$or.push({
          'profile.gender.id': element.id
        })
      }
    }

    if(where['general_search']) {

      where.$or = where.$or || []

      where.$or.push({
        'job_title': site.get_RegExp(where['general_search'], "i")
      })

      where.$or.push({
        'first_name': site.get_RegExp(where['general_search'], "i")
      })

      where.$or.push({
        'last_name': site.get_RegExp(where['general_search'], "i")
      })
    }

    delete where['active_search'];
    delete where['not_active'];
    delete where['qualifications'];
    delete where['experiences'];
    delete where['countries'];
    delete where['languages'];
    delete where['genders'];
    delete where['general_search'];
  }

    site.security.getUsers({
      where: where,
    }, (err, docs, count) => {
      if (!err) {
        response.done = true
        for (let i = 0; i < docs.length; i++) {
          let u = docs[i]
          u.profile = u.profile || {}
          u.profile.image = u.profile.image || '/images/user.png'
        }
        response.users = docs
        response.count = count
      }
      res.json(response)
    })
  })

  site.post("/api/user/add", (req, res) => {

    let response = {
      done: false
    }
    
    if (!req.session.user && req.body.type !='customer') {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let user = req.body
    user.$req = req
    user.$res = res
    site.security.addUser(user, (err, _id) => {
      if (!err) {
        response.done = true

      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/user/update", (req, res) => {
    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let user = req.body
    user.$req = req
    user.$res = res
    delete user.$$hashKey

    site.security.updateUser(user, err => {
      if (!err) {
        response.done = true
      } else {
        response.error = err.message
      }
      res.json(response)
    })

  })

  site.post("/api/user/delete", (req, res) => {
    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    let id = req.body.id
    if (id) {
      site.security.deleteUser({
        id: id,
        $req: req,
        $res: res
      }, (err, result) => {
        if (!err) {
          response.done = true
        }else{
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      response.error = 'No ID Requested'
      res.json(response)
    }
  })

  site.post("/api/user/view", (req, res) => {

    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }

    site.security.getUser({
      id: req.body.id
    }, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc =doc
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })


  site.post("/api/user/register", (req, res) => {
    let response = {}

    if (req.body.$encript) {
      if (req.body.$encript === "64") {
        req.body.email = site.fromBase64(req.body.email)
        req.body.password = site.fromBase64(req.body.password)
      } else if (req.body.$encript === "123") {
        req.body.email = site.from123(req.body.email)
        req.body.password = site.from123(req.body.password)
      }
    }

    site.security.register({
        email: req.body.email,
        password: req.body.password,
        ip: req.ip,
        permissions: ["user"],
        profile: {
          files: [],
          name: req.body.email
        },
        $req: req,
        $res: res
      },
      function (err, doc) {
        if (!err) {
          response.user = doc
          response.done = true
        } else {
          response.error = err.message
        }
        res.json(response)
      }
    )
  })

  site.post({name : "/api/user/login" , public : true}, function (req, res) {
    let response = {
      accessToken: req.session.accessToken
    }

    if (req.body.$encript) {
      if (req.body.$encript === "64") {
        req.body.email = site.fromBase64(req.body.email)
        req.body.password = site.fromBase64(req.body.password)
      } else if (req.body.$encript === "123") {
        req.body.email = site.from123(req.body.email)
        req.body.password = site.from123(req.body.password)
      }
    }

    if (site.security.isUserLogin(req, res)) {
      response.error = "Login Error , You Are Loged"
      response.done = true
      res.json(response)
      return
    }

    site.security.getUser(
      {
        email: req.body.email,
      },
      (err, doc) => {
        if (!err) {
          response.done = true;
          let user = { ...doc };
        
      if(user.active == false) {
        response.error = "The account is inactive"
        response.done = true
        res.json(response)
        return
      }

    site.security.login({
        email: req.body.email,
        password: req.body.password,
        $req: req,
        $res: res
      },
      function (err, user) {
        if (!err) {

          response.user = user

          response.done = true

        } else {
          response.error = err.message
        }

        res.json(response)
      }
      
    )
  } else {
    response.error = err.message;
  }
}
);
  })

  site.post("/api/user/logout", function (req, res) {
    let response = {
      accessToken: req.session.accessToken,
      done: true
    }

    site.security.logout(req, res, (err, ok) => {
      if (ok) {
        response.done = true
        res.json(response)
      } else {
        response.error = "You Are Not Loged"
        response.done = true
        res.json(response)
      }
    })
  })


}