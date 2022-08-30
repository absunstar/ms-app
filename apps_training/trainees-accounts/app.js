module.exports = function init(site) {
  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
    public: true,
  });

  site.get({
    name: 'TraineesAccounts',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/trainees/to_trainers', (req, res) => {
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

    if (where['first_name']) {
      where['first_name'] = site.get_RegExp(where['first_name'], 'i');
    }

    if (where['last_name']) {
      where['last_name'] = site.get_RegExp(where['last_name'], 'i');
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
        id_number: search,
      });
    }

    site.getTraineesToTrainer({ 'trainer.id': req.session.user.id }, (traineesIdCb) => {
      where['id'] = { $in: traineesIdCb };

      site.security.getUsers(
        {
          where: where,
        },
        (err, docs, count) => {
          if (!err) {
            response.done = true;

            response.users = docs;
            response.count = count;
          }
          res.json(response);
        }
      );
    });
  });
};
