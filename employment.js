require('dotenv').config();
const site = require('../isite')({
  port: [44441],
  lang: 'en',
  version: '3.177.66',
  name: 'EmploymentV2',
  theme: 'theme_paper',
  savingTime: 10,
  oldPath0: 'D:\\microsoft\\cdn\\',
  oldPath: 'D:\\Web\\TawzeefMasrFiles\\',
  _0x14xo: !0,
  mongodb: {
    db: process.env['EMPLOYMENTDB'],
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
    res.render('0/index.html', site.manage_doc, {
      parser: 'html css js',
    });
  }
);

site.loadLocalApp('client-side');
site.importApps(__dirname + '/apps_employment');
site.importApp(__dirname + '/apps_private/ui-help');
site.importApp(__dirname + '/apps_private');
site.loadLocalApp('ui-print');
site.addFeature('employment');

site.onGET('/api/old-path/CompanyLogo/:name', (req, res) => {
  res.download(site.options.oldPath + 'CompanyLogo//' + req.params.name.split('.')[0] + '//' + req.params.name);
});
site.onGET('/api/old-path/ProfilePicture/:name', (req, res) => {
  res.download(site.options.oldPath + 'ProfilePicture//' + req.params.name.split('.')[0] + '//' + req.params.name);
});
site.onGET('/api/old-path/CoverLetterFile/:name', (req, res) => {
  res.download(site.options.oldPath + 'CoverLetterFile//' + req.params.name.split('.')[0] + '//' + req.params.name);
});
site.onGET('/api/old-path/Resume/:name', (req, res) => {
  res.download(site.options.oldPath + 'Resume//' + req.params.name.split('.')[0] + '//' + req.params.name);
});

site.run();

site.sendMailMessage = function (options) {
  site.sendMailAzure(options);
};

site.sendMailAzure = function (options) {
  const { EmailClient } = require('@azure/communication-email');

  const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
  const emailClient = new EmailClient(connectionString);

  try {
    const message = {
      senderAddress: 'donotreply@twg-training.org',
      content: {
        subject: options.subject,
        html: options.message,
      },
      recipients: {
        to: [
          {
            address: options.to,
          },
        ],
      },
    };

    emailClient.beginSend(message).then((poller) => {
      poller.pollUntilDone().then((res) => {
        console.log(res);
      });
    });
  } catch (e) {
    console.log(e);
  }
};
