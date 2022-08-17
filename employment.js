const site = require('isite')({
  port: [80, 33001],
  lang: 'en',
  version: '1.0.13',
  name: 'employment',
  theme: 'theme_paper',
  savingTime: 1,
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
});

site.get({
  name: '/',
  path: site.dir + '/',
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
site.importApps(__dirname + '/apps_employment');
site.importApp(__dirname + '/apps_private/security');
site.importApp(__dirname + '/apps_private/cloud_security');
site.importApp(__dirname + '/apps_private/ui-print');
site.importApp(__dirname + '/apps_private/ui-help');

site.addFeature('employment');

site.run();

let aaa = site.hide({ name: 'amr barakat' });
let bbb = site.show(aaa);

console.log(aaa, bbb);
