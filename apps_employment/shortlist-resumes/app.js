module.exports = function init(site) {

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'ShortListResumes',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post("/api/user/remove_short", (req, res) => {

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
        let user = doc
        user.$req = req
        user.$res = res
        delete user.$$hashKey
        for(let i = 0; i < user.short_list.length; i++) {
          if(user.short_list[i] == req.session.user.id) {
            user.short_list.splice(i, 1);  
          }
        }
        site.security.updateUser(user, err => {
          if (!err) {
            response.done = true
            
          } else {
            response.error = err.message
          }
          res.json(response)
        })

      } else {
        response.error = err.message
      }
    })
  })

};
