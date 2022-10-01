module.exports = function init(site) {
  const $manage = site.connectCollection('Manage');
  site.manage_doc = {
    title: 'Training',
    slug: 'Update Your Skills',
    nav_color: '#000000',
    nav_background: '#ffffff',
    fonts: 'Arabic, sans-serif',
    logo: { url: '/images/logo.png' },
    logo1: { url: '/images/logo1.png' },
    logo2: { url: '/images/logo2.png' },
    logo3: { url: '/images/logo3.png' },
    job_number: 2000,
    job_available_number: 500,
    company_number: 40,
    numbers_title: 'numbers talk about us',
    numbers_description: '',
    allow_companies_logo: true,
    companies_logo: { url: '/images/logos.png' },
    companies_logo_title: 'Jobs in the largest companies in Egypt',
    slider1: { title: '', description: '', logo: { url: '/images/banner1.jpg' } },
    slider2: { title: '', description: '', logo: { url: '/images/banner1.jpg' } },
    slider3: { title: '', description: '', logo: { url: '/images/banner1.jpg' } },
    partners_logo_list: [],
    contact: {
      location: 'Egypt',
      email: 'Absunstar@gmail.com',
      phone: '01090061266',
    },
    links: [
      {
        title: 'privacy',
        url: '#',
      },
      {
        title: 'Terms & Condations',
        url: '#',
      },
    ],
  };
  site.setting = { ...site.setting, ...site.manage_doc };
  $manage.findOne({}, (err, doc) => {
    if (!err && doc) {
      site.manage_doc = doc;
      site.setting = { ...site.setting, ...site.manage_doc };
    } else {
      $manage.add(site.manage_doc, (err, doc) => {
        if (!err && doc) {
          site.manage_doc = doc;
          site.setting = { ...site.setting, ...site.manage_doc };
        }
      });
    }
  });

  site.get({
    name: 'Manage',
    path: __dirname + '/site_files/html/index.html',
    parser: 'html',
    compress: false,
  });

  site.get({
    name: '/images',
    path: __dirname + '/site_files/images',
  });

  site.post('/api/manage/get', (req, res) => {
    let response = {
      done: true,
      doc: site.manage_doc,
    };
    res.json(response);
  });

  site.getManage = function (callback) {
    callback = callback || function () {};
    if (site.manage_doc) {
      callback(site.manage_doc);
      return site.manage_doc;
    }
  };

  site.post('/api/manage/save', (req, res) => {
    let response = {
      done: false,
    };

    let data = req.data;
    $manage.update(data, (err, result) => {
      if (!err) {
        response.done = true;
        site.manage_doc = data;
        site.setting = { ...site.setting, ...site.manage_doc };
      } else {
        response.error = err.message;
      }
      res.json(response);
    });
  });
};
