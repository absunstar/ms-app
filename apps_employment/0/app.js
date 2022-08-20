module.exports = function init(site){

  site.get({
      name : '/',
      path : __dirname + '/site_files',
      public : true
  })
  
  site.post({
    name: '/api/gender/all',
    path: __dirname + '/site_files/json/gender.json',
  });

 
}