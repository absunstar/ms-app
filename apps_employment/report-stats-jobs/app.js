module.exports = function init(site) {
  const $job = site.connectCollection('Jobs');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'ReportStatsJobs',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/report_job/all', (req, res) => {
    let response = {
      done: false,
    };
    
    let where = req.body.where || {};
    let company = {};

    if(where['company']) {
      company = {...where['company']}
      delete where['company']
    }

    if (where['job_field'] && where['job_field'].id) {
      where['job_field.id'] = where['job_field'].id;
      delete where['job_field'];
    }


    if (where.date_from && !where.date_to) {
      let d1 = site.toDate(where.date_from);
      let d2 = site.toDate(where.date_from);
      d2.setDate(d2.getDate() + 1);
      where['add_user_info.date'] = {
        $gte: d1,
        $lt: d2,
      };
      delete where['date_from'];
    } else if (where && where.date_to) {
      let d1 = site.toDate(where.date_from);
      let d2 = site.toDate(where.date_to);
      d2.setDate(d2.getDate() + 1);
      where['add_user_info.date'] = {
        $gte: d1,
        $lt: d2,
      };
      delete where['date_from'];
      delete where['date_to'];
    }

    $job.findMany(
      {
        select: req.body.select || {},
        where: where,
        sort: req.body.sort || {
          id: -1,
        },
        limit: req.body.limit,
      },
      (err, docs, count) => {
        site.getCompanies(company, (companiesList) => {
        if (!err) {
          response.done = true;

            response.list = companiesList;

            for (let i = 0; i < docs.length; i++) {
              let job = docs[i];
              response.list.forEach(_c => {
                
                if(job.company && job.company.id && _c.id == job.company.id) {
                  if(!_c.jobs_count){
                    _c.jobs_count = 1;
                  } else {
                    _c.jobs_count =+1;
                  }
                }
              });

            }
            response.count = count;
          } else {
            response.error = err.message;
          }
          res.json(response);
        })
      }
    );
  });

};
