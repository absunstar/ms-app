const site = require('../isite')({
  port: [44442],
  lang: 'en',
  version: '3.065.02',
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
  public: true
});

site.get(
  {
    name: '/',
    public: true
  },
  (req, res) => {
    res.render(
      '0/index.html',
      site.manage_doc,
      {
        parser: 'html css js',
      }
    );
  }
);
site.loadLocalApp('client-side');
site.loadLocalApp('ui-print');

site.importApps(__dirname + '/apps_training');
site.addFeature('training');

site.run();

site.sendMailMessage = function (obj) {
  if (site.setting.email_setting
    && site.setting.email_setting.host
    && site.setting.email_setting.port
    && site.setting.email_setting.username
    && site.setting.email_setting.password
    && site.setting.email_setting.from
  ) {

    obj.enabled = true;
    obj.type = 'smpt';
    obj.host = site.setting.email_setting.host;
    obj.port = site.setting.email_setting.port;
    obj.username = site.setting.email_setting.username;
    obj.password = site.setting.email_setting.password;
    obj.from = site.setting.email_setting.from;

    site.sendMail(obj);
  };
}