require('dotenv').config();
const site = require('../isite')({
  port: [44442],
  lang: 'en',
  version: '3.156.30',
  name: 'training',
  theme: 'theme_paper',
  savingTime: 1,
  _0x14xo: !0,
  mongodb: {
    db: process.env['TRAININGDB'],
    // db: 'training',
    limit: 100000,
    events: true,
    identity: {
      enabled: !0,
    },
  },
  security: {
    keys: ['e698f2679be5ba5c9c0b0031cb5b057c', '9705a3a85c1b21118532fefcee840f99'],
  },
  session : {
    timeout : 0
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
site.loadLocalApp('ui-print');

site.importApps(__dirname + '/apps_training');
site.addFeature('training');

site.run();

site.sendMailSMPT = function (obj) {
  if (
    site.setting.email_setting &&
    site.setting.email_setting.host &&
    site.setting.email_setting.port &&
    site.setting.email_setting.username &&
    site.setting.email_setting.password &&
    site.setting.email_setting.from
  ) {
    obj.enabled = true;
    obj.type = 'smpt';
    obj.host = site.setting.email_setting.host;
    obj.port = site.setting.email_setting.port;
    obj.username = site.setting.email_setting.username;
    obj.password = site.setting.email_setting.password;
    obj.from = site.setting.email_setting.from;

    site.sendMail(obj);
  }
};

site.sendMailMessage = function (options) {
  site.sendMailAzure(options);
};

site.sendMailMandrill = function (obj) {
  site
    .fetch(' https://mandrillapp.com/api/1.0/messages/send', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
      },
      body: JSON.stringify({
        key: site.from123('453831674517317347595182355947753235422638596179471917374754567842719191'),
        message: { from_email: site.setting.email_setting.from, subject: obj.subject, html: obj.message, to: obj.to },
      }),
      redirect: 'follow',
      agent: function (_parsedURL) {
        if (_parsedURL.protocol == 'http:') {
          return new site.http.Agent({
            keepAlive: true,
          });
        } else {
          return new site.https.Agent({
            keepAlive: true,
          });
        }
      },
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
    });
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

// site.sendMailMessage({
//   to: 'ABarakat@digisummits.com',
//   subject: `Activatin Link`,
//   message: `<a target="_blank" href="https://egytag.com"> Click Here To Activate Your Account </a>`,
// });
