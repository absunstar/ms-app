const site = require('../isite')({
  port: [44442],
  lang: 'en',
  version: '1.0.16',
  name: 'training',
  theme: 'theme_paper',
  savingTime: 1,
  mongodb: {
    db: 'training',
    limit: 100000,
    events: true,
    identity: {
      enabled: !0,
    },
  },
  security: {
    keys: ['e698f2679be5ba5c9c0b0031cb5b057c', '9705a3a85c1b21118532fefcee840f99'],
  },
  require: {
    permissions: ['login'],
  },
});

site.get({
  name: '/',
  path: site.dir + '/',
  public : true
});

site.get(
  {
    name: '/',
    public : true
  },
  (req, res) => {
    res.render(
      '0/index.html',
      {},
      {
        parser: 'html css js',
      }
    );
  }
);

site.loadLocalApp('client-side');
site.importApps(__dirname + '/apps_training');
site.addFeature('training');

site.run();
