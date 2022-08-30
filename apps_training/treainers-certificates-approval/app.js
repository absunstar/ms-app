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
