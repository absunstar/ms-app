module.exports = function init(site) {

  let collection_name = 'ExamTemplates'

  let source = {
    en: 'Exam Templates System',
    ar: 'نظام قوالب الإختبار'
  }

  let image = '/images/exam_templates.png'
  let add_message = {
    en: 'New Exam Template Added',
    ar: 'تم إضافة قالب إختبار جديد'
  }
  let update_message = {
    en: ' Exam Template Updated',
    ar: 'تم تعديل قالب إختبار'
  }
  let delete_message = {
    en: ' Exam Template Deleted',
    ar: 'تم حذف قالب إختبار '
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