module.exports = function init(site) {
  const $training_report = site.connectCollection('training_report');
  const $TrainingType = site.connectCollection('TrainingType');
  const $TrainingCategory = site.connectCollection('TrainingCategory');
  const $Training = site.connectCollection('Training');
  const $EntityPartner = site.connectCollection('EntityPartner');
  const $EntitySubPartner = site.connectCollection('EntitySubPartner');
  const $UserProfile = site.connectCollection('UserProfile');

  site.get({
    name: 'training-report',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: true,
  });

  site.post('/api/training_report/add', (req, res) => {
    let response = {};
    response.done = false;

    if (!req.session.user) {
      res.json(response);
      return;
    }

    let doc = req.body;
    doc.$req = req;
    doc.$res = res;
    // doc.company = site.get_company(req)
    // doc.branch = site.get_branch(req)
    doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    $training_report.add(doc, (err, id) => {
      if (!err) {
        response.done = true;
      }
      res.json(response);
    });
  });

  site.post('/api/training_report/update', (req, res) => {
    let response = {};
    response.done = false;

    if (!req.session.user) {
      res.json(response);
      return;
    }

    let doc = req.body;
    doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res,
    });

    if (doc.id) {
      $training_report.edit(
        {
          where: {
            id: doc.id,
          },
          set: doc,
          $req: req,
          $res: res,
        },
        (err) => {
          if (!err) {
            response.done = true;
          } else {
            response.error = err.message;
          }
          res.json(response);
        }
      );
    } else {
      res.json(response);
    }
  });

  site.post('/api/training_report/delete', (req, res) => {
    let response = {};
    response.done = false;

    if (!req.session.user) {
      res.json(response);
      return;
    }

    let id = req.body.id;
    if (id) {
      $training_report.delete(
        {
          id: id,
          $req: req,
          $res: res,
        },
        (err, result) => {
          if (!err) {
            response.done = true;
          }
          res.json(response);
        }
      );
    } else {
      res.json(response);
    }
  });

  site.post('/api/training_report/view', (req, res) => {
    let response = {};
    response.done = false;
    $training_report.find(
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

  site.post('/api/Training/all', (req, res) => {
    let response = {};
    response.done = false;
    let where = req.body.where || {};
    // where['company.id'] = site.get_company(req).id
    // where['branch.code'] = site.get_branch(req).code

    /*    if (!req.session.user) {
      res.json(response)
      return
    } */

    if (where['trainer']) {
      where['TrainerId'] = where['trainer']._id;
      delete where['trainer'];
    }

    if (where['partner']) {
      where['PartnerId._id'] = site.mongodb.ObjectID(where['partner']._id);
      delete where['partner'];
    }

    if (where['sub_partner']) {
      where['SubPartnerId._id'] = site.mongodb.ObjectID(where['sub_partner']._id);
      delete where['sub_partner'];
    }

    if (where['training_type']) {
      where['TrainingTypeId'] = where['training_type']._id;
      delete where['training_type'];
    }

    if (where['training_category']) {
      where['TrainingCategoryId'] = where['training_category']._id;
      delete where['training_category'];
    }

    if (where['training_category']) {
      where['TrainingCategoryId'] = where['training_category']._id;
      delete where['training_category'];
    }

    $Training.aggregate(
      [
        {
          $match: where,
        },
        {
          $addFields: {
            TrainerObjId: { $toObjectId: '$TrainerId' },
          },
        },
        {
          $lookup: {
            from: 'UserProfile',
            localField: 'TrainerObjId',
            foreignField: '_id',
            as: 'Trainer',
          },
        },
        {
          $unwind: {
            path: '$Trainer',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            City: { $toObjectId: '$CityId' },
          },
        },
        {
          $lookup: {
            from: 'City',
            localField: 'City',
            foreignField: '_id',
            as: 'CityObj',
          },
        },
        {
          $unwind: {
            path: '$CityObj',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            TrainingType: { $toObjectId: '$TrainingTypeId' },
          },
        },
        {
          $lookup: {
            from: 'TrainingType',
            localField: 'TrainingType',
            foreignField: '_id',
            as: 'TrainingType',
          },
        },
        {
          $unwind: {
            path: '$TrainingType',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            TrainingCategory: { $toObjectId: '$TrainingCategoryId' },
          },
        },
        {
          $lookup: {
            from: 'TrainingCategory',
            localField: 'TrainingCategory',
            foreignField: '_id',
            as: 'TrainingCategory',
          },
        },
        {
          $unwind: {
            path: '$TrainingCategory',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            AreaId: { $first: '$AreaId' },
            StartDate: { $first: '$StartDate' },
            EndDate: { $first: '$EndDate' },
            Trainer: { $first: '$Trainer' },
            Trainees: { $first: '$Trainees' },
            TrainerCount: { $first: '$TrainerCount' },
            CityObj: { $first: '$CityObj' },
            TrainingType: { $first: '$TrainingType' },
            TrainingCategory: { $first: '$TrainingCategory' },
            PartnerId: { $first: '$PartnerId' },
          },
        },
        { $sort: { _id: -1 } },
      ],
      (err, docs) => {
        if (docs && docs.length > 0) {
          docs.forEach((_d) => {
            if (_d.CityObj) {
              _d.CityObj.areas.forEach((_ar) => {
                if (_d.AreaId && _ar._id && _ar._id.toString() === _d.AreaId.toString()) {
                  _d.AreaName = _ar.Name;
                }
              });
            }
          });
          response.done = true;
          response.list = docs;
          res.json(response);
        } else {
          response.done = false;

          response.list = [];
          res.json(response);
        }
      }
    );

    // $Training.findMany(
    //   {
    //     select: req.body.select || {},
    //     where: where,
    //     sort: {
    //       id: -1,
    //     },
    //   },
    //   (err, docs) => {
    //     if (!err) {
    //       response.done = true;
    //       let list = [];
    //       // docs.forEach((_d) => {
    //       //   _d.Trainees.forEach((_T) => {
    //       //     list.push({
    //       //       Trainee: _T,
    //       //       StartDate: _d.StartDate,
    //       //       EndDate: _d.EndDate,
    //       //       PartnerId: _d.PartnerId,
    //       //       TrainingCenterId: _d.TrainingCenterId,
    //       //       days: _d.days,
    //       //       IsOnline: _d.IsOnline,
    //       //     });
    //       //   });
    //       // });
    //       response.list = docs;
    //     } else {
    //       response.error = err.message;
    //     }
    //     res.json(response);
    //   }
    // );
  });

  site.post('/api/TrainingType/all', (req, res) => {
    let response = {};
    response.done = false;
    let where = req.body.where || {};
    // where['company.id'] = site.get_company(req).id
    // where['branch.code'] = site.get_branch(req).code

    // if (!req.session.user) {
    //   res.json(response)
    //   return
    // }

    $TrainingType.findMany(
      {
        select: req.body.select || {},
        where: where,
        sort: {
          id: -1,
        },
      },
      (err, docs) => {
        if (!err) {
          response.done = true;
          response.list = docs;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  site.post('/api/TrainingCategory/all', (req, res) => {
    let response = {};
    response.done = false;
    let where = req.body.where || {};
    // where['company.id'] = site.get_company(req).id
    // where['branch.code'] = site.get_branch(req).code

    // if (!req.session.user) {
    //   res.json(response)
    //   return
    // }

    $TrainingCategory.findMany(
      {
        select: req.body.select || {},
        where: where,
        sort: {
          id: -1,
        },
      },
      (err, docs) => {
        if (!err) {
          response.done = true;
          response.list = docs;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });
  site.post('/api/EntityPartner/all', (req, res) => {
    let response = {};
    response.done = false;
    let where = req.body.where || {};
    // where['company.id'] = site.get_company(req).id
    // where['branch.code'] = site.get_branch(req).code

    // if (!req.session.user) {
    //   res.json(response)
    //   return
    // }

    $EntityPartner.findMany(
      {
        select: req.body.select || {},
        where: where,
        sort: {
          id: -1,
        },
      },
      (err, docs) => {
        if (!err) {
          response.done = true;
          response.list = docs;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  site.post('/api/EntitySubPartner/all', (req, res) => {
    let response = {};
    response.done = false;
    let where = req.body.where || {};
    // where['company.id'] = site.get_company(req).id
    // where['branch.code'] = site.get_branch(req).code

    // if (!req.session.user) {
    //   res.json(response)
    //   return
    // }

    $EntitySubPartner.findMany(
      {
        select: req.body.select || {},
        where: where,
        sort: {
          id: -1,
        },
      },
      (err, docs) => {
        if (!err) {
          response.done = true;
          response.list = docs;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });

  site.post('/api/Trainers/all', (req, res) => {
    let response = {};
    response.done = false;
    let where = req.body.where || {};
    // where['company.id'] = site.get_company(req).id
    // where['branch.code'] = site.get_branch(req).code

    // if (!req.session.user) {
    //   res.json(response)
    //   return
    // }

    $UserProfile.findMany(
      {
        select: req.body.select || {},
        where: where,
        sort: {
          id: -1,
        },
      },
      (err, docs) => {
        if (!err) {
          response.done = true;
          response.list = docs;
        } else {
          response.error = err.message;
        }
        res.json(response);
      }
    );
  });
};
