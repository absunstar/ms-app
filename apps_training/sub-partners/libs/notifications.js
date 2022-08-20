module.exports = function init(site) {

  let collection_name = 'SubPartners'

  let source = {
    en: 'Sub Partners System',
    ar: 'نظام الشركاء الثانويين'
  }

  let image = '/images/sub_partner.png'
  let add_message = {
    en: 'New Sub Partner Added',
    ar: 'تم إضافة شريك ثانوي جديد'
  }
  let update_message = {
    en: 'Sub Partner Updated',
    ar: 'تم تعديل شريك ثانوي'
  }
  let delete_message = {
    en: 'Sub Partner Deleted',
    ar: 'تم حذف شريك ثانوي '
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