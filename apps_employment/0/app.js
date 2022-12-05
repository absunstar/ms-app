module.exports = function init(site) {

  site.get({
    name: '/',
    path: __dirname + '/site_files',
    public: true
  })

  site.post('/api/gender/all', (req, res) => {

   let response = [
      {
        id: 1,
        en: "Male",
        ar: "ذكر"
      },

      {
        id: 2,
        en: "Female",
        ar: "أنثى"
      }
    ]

    if(site.manage_doc.undefined_gender_activation){
      response.push({
        id: 3,
        en: "Undefined",
        ar: "غير محدد"
      })
    }

    res.json(response);

  });

}