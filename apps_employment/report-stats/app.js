module.exports = function init(site) {

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'ReportStats',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/report_stats_users/all', (req, res) => {

    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'You Are Not Login'
      res.json(response)
      return
    }
    let where = req.body.where || {};
    where['profile.type'] = 'job-seeker'

    if (where.date_from) {
      let d1 = site.toDate(where.date_from);
      let d2 = site.toDate(where.date_from);
      d2.setDate(d2.getDate() + 1);
      where.created_date = {
        $gte: d1,
        $lt: d2,
      };
      delete where['date_to'];
    } else if (where && where.date_to) {
      let d1 = site.toDate(where.date_from);
      let d2 = site.toDate(where.date_to);
      d2.setDate(d2.getDate() + 1);
      where.created_date = {
        $gte: d1,
        $lt: d2,
      };
      delete where['date_from'];
      delete where['date_to'];
    }

    site.security.getUsers({
      where: where,
    }, (err, docs, count) => {
      if (!err) {
        response.done = true
        response.job_seeker_count = 0;
        response.male_count = 0;
        response.female_count = 0;
        response.undefined_gender_count = 0;
        for (let i = 0; i < docs.length; i++) {
          let u = docs[i]
            response.job_seeker_count += 1
          if(u.profile.gender) {
            if(u.profile.gender.id == 1){
              response.male_count += 1
            } else if(u.profile.gender.id == 2){
              response.female_count += 1
            }
          } else {
            response.undefined_gender_count += 1
          }
        }

        response.users = docs
        response.count = count
      }
      res.json(response)
    })
  })

};
