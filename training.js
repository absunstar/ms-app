const site = require('isite')({
  port: [80, 33001],
  lang: 'ar',
  version: '1.0.12',
  name: 'training',
  theme: 'theme_paper',
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
});

site.get({
  name: '/',
  path: site.dir + '/',
});

site.get({
  name: '/',
  path: __dirname + '0/index.html',
  parser: 'html css js',
});

site.get(
  {
    name: '/',
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
site.importApp(__dirname + '/apps_private/security');
site.importApp(__dirname + '/apps_private/ui-print');
site.importApp(__dirname + '/apps_private/ui-help');

site.addFeature('training');

site.run();
