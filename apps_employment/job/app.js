module.exports = function init(site) {
  const $job = site.connectCollection('Jobs');

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/',
  });

  site.get({
    name: 'Jobs',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post({
    name: '/api/job_type/all',
    path: __dirname + '/site_files/json/job_type.json',
  });

  site.post({
    name: '/api/job_status/all',
    path: __dirname + '/site_files/json/job_status.json',
  });

  site.on('[job][created]', (doc) => {
    $job.add(
      {
        code: '1-Test',
        name_ar: 'وظيفة إفتراضية',
        name_en: 'Default Job',
        image: '/images/job.png',
        active: true,
      },
      (err, doc1) => {}
    );
  });

  site.post('/api/job/add', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let job_doc = req.body;
    job_doc.$req = req;
    job_doc.$res = res;
 
    
    job_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (typeof job_doc.active === 'undefined') {
      job_doc.active = true;
    }

 
          // let d = new Date();
          // d.setFullYear(d.getFullYear() + 1);
          // d.setMonth(1);
          let num_obj = {
            screen: 'job',
            date: new Date(),
          };

          // let cb = site.getNumbering(num_obj);
          // if (!job_doc.code && !cb.auto) {
          //   response.error = 'Must Enter Code';
          //   res.json(response);
          //   return;
          // } else if (cb.auto) {
          //   job_doc.code = cb.code;
          // }

          $job.add(job_doc, (err, doc) => {
            if (!err) {
              response.done = true;
              response.doc = doc;
            } else {
              response.error = err.message;
            }
            res.json(response);
          });
        
      
    
  });

  site.post('/api/job/update', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let job_doc = req.body;

   

    job_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (job_doc.id) {
    
            $job.edit(
              {
                where: {
                  id: job_doc.id,
                },
                set: job_doc,
                $req: req,
                $res: res,
              },
              (err) => {
                if (!err) {
                  response.done = true;
                } else {
                  response.error = 'Code Already Exist';
                }
                res.json(response);
              }
            );
      
    } else {
      response.error = 'no id';
      res.json(response);
    }
  });

  site.post('/api/job/view', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    $job.findOne(
      {
        where: {
          id: req.body.id,
        },
      },
      (err, doc) => {
        if (!err) {
          response.done = true;
          response.doc = doc;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  site.post('/api/job/delete', (req, res) => {
    let response = {
      done: false,
    };

    if (!req.session.user) {
      response.error = 'Please Login First';
      res.json(response);
      return;
    }

    let id = req.body.id;

    if (id) {
      $job.delete(
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
      response.error = 'no id';
      res.json(response);
    }
  });

  site.post('/api/job/all', (req, res) => {
    let response = {
      done: false,
    };

    let where = req.body.where || {};

    if (where['job_title']) {
      where['job_title'] = site.get_RegExp(where['job_title'], 'i');
    }

    if (where['job_status'] && where['job_status'].id) {
      where['approve.id'] = where['job_status'].id;
      delete where['job_status'];
    }

    if (where['job_field'] && where['job_field'].id) {
      where['job_field.id'] = where['job_field'].id;
      delete where['job_field'];
    }

    if (where['job_subfield'] && where['job_subfield'].id) {
      where['job_subfield.id'] = where['job_subfield'].id;
      delete where['job_subfield'];
    }

    if (where['job_type'] && where['job_type'].id) {
      where['job_type.id'] = where['job_type'].id;
      delete where['job_type'];
    }

    if (where['industry'] && where['industry'].id) {
      where['industry.id'] = where['industry'].id;
      delete where['industry'];
    }

    if (where['company'] && where['company'].id) {
      where['company.id'] = where['company'].id;
      delete where['company'];
    }

    if (where['country'] && where['country'].id) {
      where['country.id'] = where['country'].id;
      delete where['country'];
    }

    if (where['city'] && where['city'].id) {
      where['city.id'] = where['city'].id;
      delete where['city'];
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

    delete where['active_search'];
    delete where['not_active'];
    
    if(req.body.search){
    if(where['companies'] && where['companies'].length > 0){
      where.$or = where.$or || []
      for (let i = 0; i < where['companies'].length; i++) {
        let element = where['companies'][i];
        where.$or.push({
          'company.id': element.id
        })
      }
    }

    if(where['job_fields'] && where['job_fields'].length > 0){
      where.$or = where.$or || []
      for (let i = 0; i < where['job_fields'].length; i++) {
        let element = where['job_fields'][i];
        where.$or.push({
          'job_field.id': element.id
        })
      }
    }

    if(where['industries'] && where['industries'].length > 0){
      where.$or = where.$or || []
      for (let i = 0; i < where['industries'].length; i++) {
        let element = where['industries'][i];
        where.$or.push({
          'industry.id': element.id
        })
      }

    }

    if(where['experiences'] && where['experiences'].length > 0){
      where.$or = where.$or || []
      for (let i = 0; i < where['experiences'].length; i++) {
        let element = where['experiences'][i];
        where.$or.push({
          'years_of_experience.id': element.id
        })
      }
    }

    if(where['qualifications'] && where['qualifications'].length > 0){
      where.$or = where.$or || []
      for (let i = 0; i < where['qualifications'].length; i++) {
        let element = where['qualifications'][i];
        where.$or.push({
          'qualification.id': element.id
        })
      }

    }

    if(where['general_search']) {

      where.$or = where.$or || []

      where.$or.push({
        'job_title': site.get_RegExp(where['general_search'], "i")
      })
      where.$or.push({
        'company.name_ar': site.get_RegExp(where['general_search'], "i")
      })
      where.$or.push({
        'company.name_en': site.get_RegExp(where['general_search'], "i")
      })
    }

    if(where['general_locations']) {

      where.$or = where.$or || []

      where.$or.push({
        'country.name_ar': site.get_RegExp(where['general_locations'], "i")
      })
      where.$or.push({
        'country.name_en': site.get_RegExp(where['general_locations'], "i")
      })
      where.$or.push({
        'city.name_ar': site.get_RegExp(where['general_locations'], "i")
      })
      where.$or.push({
        'city.name_en': site.get_RegExp(where['general_locations'], "i")
      })
    }
    
    delete where['experiences']
    delete where['qualifications']
    delete where['industries']
    delete where['companies']
    delete where['job_fields']
    delete where['general_search']
    delete where['general_locations']
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
        if (!err) {
          response.done = true;
          response.list = docs;
          response.open_jobs = 0;
          response.applications = 0;
          response.hired_job_seeker_count = 0;
          for (let i = 0; i < docs.length; i++) {
            let element = docs[i];
            if(element.application_list && element.application_list.length > 0) {
              response.applications += element.application_list.length;
            }
            if(element.approve && element.approve.id == 3){
              response.open_jobs += 1;
            }
          }
          response.count = count;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });
 
  site.post('/api/job/hire', (req, res) => {
    let response = {
      done: false,
    };

    let where = req.body.where || {};

      where['active'] = true;
      where['approve.id'] = 3

    if (where.date_from) {
      let d1 = site.toDate(where.date_from);
      let d2 = site.toDate(where.date_from);
      d2.setDate(d2.getDate() + 1);
      where['application_list.date']= {
        $gte: d1,
        $lt: d2,
      };
      delete where['date_from'];
    } else if (where && where.date_to) {
      let d1 = site.toDate(where.date_from);
      let d2 = site.toDate(where.date_to);
      d2.setDate(d2.getDate() + 1);
      where['application_list.date'] = {
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
        if (!err) {
          response.done = true;
          response.hired_job_seeker_count = 0;
          for (let i = 0; i < docs.length; i++) {
            let element = docs[i];
            if(element.application_list && element.application_list.length > 0) {
              element.application_list.forEach(_app => {
                if(_app.hire == true){
                  response.hired_job_seeker_count += 1;
                }
              });
            }

          }
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });
};
