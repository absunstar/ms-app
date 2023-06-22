module.exports = function init(site) {
  const $trainings = site.connectCollection('Trainings');

  site.get({
    name: 'TrainersCertificatesApproval',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/trainings/trainers_certificate', (req, res) => {
    let response = {
      done: false,
    };

    let where = req.body.where || {};
    let search = req.body.search;
    if (where['country'] && where['country'].id) {
      where['country.id'] = where['country'].id;
      delete where['country'];
    }

    if (where['city'] && where['city'].id) {
      where['city.id'] = where['city'].id;
      delete where['city'];
    }

    if (where['partner'] && where['partner'].id) {
      where['partner.id'] = where['partner'].id;
      delete where['partner'];
    }

    if (where['sub_partner'] && where['sub_partner'].id) {
      where['sub_partner.id'] = where['sub_partner'].id;
      delete where['sub_partner'];
    }

    if (where['trainer'] && where['trainer'].id) {
      where['trainer.id'] = where['trainer'].id;
      delete where['trainer'];
    }

    if (where['training_center'] && where['training_center'].id) {
      where['training_center.id'] = where['training_center'].id;
      delete where['training_center'];
    }

    if (where['training_type'] && where['training_type'].id) {
      where['training_type.id'] = where['training_type'].id;
      delete where['training_type'];
    }

    if (where['training_category'] && where['training_category'].id) {
      where['training_category.id'] = where['training_category'].id;
      delete where['training_category'];
    }

    if (where['privacy_type'] && where['privacy_type'].id) {
      where['privacy_type.id'] = where['privacy_type'].id;
      delete where['privacy_type'];
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

    if (search) {
      where.$or = [];

      where.$or.push({
        'country.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'country.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'city.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'city.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'partner.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'partner.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'sub_partner.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'sub_partner.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'trainer.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'trainer.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'trainer.first_name': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'trainer.email': site.get_RegExp(search, 'i'),
      });
      where.$or.push({
        'training_center.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'training_center.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'training_type.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'training_type.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'training_category.name_ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'training_category.name_en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'privacy_type.ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'privacy_type.en': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'days.ar': site.get_RegExp(search, 'i'),
      });

      where.$or.push({
        'days.en': site.get_RegExp(search, 'i'),
      });
    }
    $trainings.findMany(
      {
        select: req.body.select || {},
        where: where,
        sort: req.body.sort || {
          id: -1,
        },
        limit: req.body.limit,
      },
      (err, docs, count) => {
        if (!err && docs) {
          let trainings_list = [];
          docs.forEach((_doc) => {
            let found = false;
             trainings_list.forEach((_t) => {
              if (_t.trainer && _t.trainer.id == _doc.trainer.id && _t.partner.id == _doc.partner.id && _t.training_type.id == _doc.training_type.id  && _t.training_category.id == _doc.training_category.id) {
                _t.count += 1;
                found = true
              }
            });
            if(!found){
              _doc.count = 1;
              trainings_list.push(_doc)
            }
          });
          
          response.done = true;
          response.list = trainings_list;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });
};
