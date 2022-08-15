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

    if (where['job_type'] && where['job_type'].id) {
      where['job_type.id'] = where['job_type'].id;
      delete where['job_type'];
    }

    if (where['industry'] && where['industry'].id) {
      where['industry.id'] = where['industry'].id;
      delete where['industry'];
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
