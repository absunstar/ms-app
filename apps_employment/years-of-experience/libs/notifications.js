module.exports = function init(site) {

  let collection_name = 'YearsOfExperience'

  let source = {
    en: 'Years Of Experience System',
    ar: 'نظام سنوات الخبرة'
  }

  let image = '/images/years_of_experience.png'
  let add_message = {
    en: 'New Years Of Experience Added',
    ar: 'تم إضافة سنوات خبرة جديد'
  }
  let update_message = {
    en: ' Years Of Experience Updated',
    ar: 'تم تعديل سنوات خبرة'
  }
  let delete_message = {
    en: ' Years Of Experience Deleted',
    ar: 'تم حذف سنوات خبرة '
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