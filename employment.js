const site = require('../isite')({
  port: [44441],
  lang: 'en',
  version: '2022.09.12',
  name: 'employment',
  theme: 'theme_paper',
  savingTime: 10,
  mail: {
    enabled: false,
    host: 'smtp.office365.com',
    port: 587,
    username: 'ms.two@digisummits.com',
    password: 'Fan63941',
    type: 'smpt',
    from: 'ms.two@digisummits.com',
  },
  mongodb: {
    db: 'employment',
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
  public: true,
});

site.get(
  {
    name: '/',
    public: true,
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
site.importApps(__dirname + '/apps_employment');
site.importApp(__dirname + '/apps_private/ui-help');
site.importApp(__dirname + '/apps_private');
site.loadLocalApp('ui-print');
site.addFeature('employment');

site.run();
