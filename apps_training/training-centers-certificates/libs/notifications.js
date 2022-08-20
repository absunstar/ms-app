module.exports = function init(site) {

  let collection_name = 'Certificates'

  let source = {
    en: 'Training Centers Certificates System',
    ar: 'نظام شهادات مراكز التدريب'
  }

  let image = '/images/training_center_certificate.png'
  let add_message = {
    en: 'New Training Center Certificate Added',
    ar: 'تم إضافة شهادة مركز تدريب جديدة'
  }
  let update_message = {
    en: 'Training Center Certificate Updated',
    ar: 'تم تعديل شهادة مركز تدريب '
  }
  let delete_message = {
    en: 'Training Center Certificate Deleted',
    ar: 'تم حذف شهادة مركز تدريب '
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