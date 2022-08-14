module.exports = function init(site) {

  let collection_name = 'JobFair'

  let source = {
    en: 'Job Fairs System',
    ar: 'نظام معارض الوظائف'
  }

  let image = '/images/job_fairs.png'
  let add_message = {
    en: 'New Job Fair Added',
    ar: 'تم إضافة معرض الوظائف جديد'
  }
  let update_message = {
    en: ' Job Fair Updated',
    ar: 'تم تعديل معرض الوظائف'
  }
  let delete_message = {
    en: ' Job Fair Deleted',
    ar: 'تم حذف معرض الوظائف '
  }


  site.on('mongodb after insert', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image,
          source: source,
          message: add_message,
          value: {
            code: result.doc.code,
            name_en: result.doc.name_en,
            name_ar: result.doc.name_ar
          },
          add: result.doc,
          action: 'add'
        },
        result: result
      })
    }
  })

  site.on('mongodb after update', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image,
          source: source,
          message: update_message,
          value: {
            code: result.old_doc.code,
            name_en: result.old_doc.name_en,
            name_ar: result.old_doc.name_ar
          },
          update: site.objectDiff(result.update.$set, result.old_doc),
          action: 'update'
        },
        result: result
      })
    }
  })


  site.on('mongodb after delete', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image,
          source: source,
          message: delete_message,
          value: {
            code: result.doc.code,
            name_en: result.doc.name_en,
            name_ar: result.doc.name_ar
          },
          delete: result.doc,
          action: 'delete'
        },
        result: result
      })
    }
  })

}