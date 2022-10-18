const path = require('path');
const fs = require('fs');
const express = require('express');
const ParseDashboard = require('parse-dashboard');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PARSE_DASHBOARD_PORT || process.env.PORT || 4040;
const mountPath = process.env.PARSE_DASHBOARD_MOUNT_PATH || process.env.MOUNT_PATH || '/';
const allowInsecureHTTP = process.env.PARSE_DASHBOARD_ALLOW_INSECURE_HTTP;
const cookieSessionSecret = process.env.PARSE_DASHBOARD_COOKIE_SESSION_SECRET;
const trustProxy = process.env.PARSE_DASHBOARD_TRUST_PROXY;

if (trustProxy && allowInsecureHTTP) {
  console.log('Set only trustProxy *or* allowInsecureHTTP, not both.  Only one is needed to handle being behind a proxy.');
  process.exit(-1);
}

let configFile = null;
let configFromCLI = null;
const configServerURL = process.env.PARSE_DASHBOARD_SERVER_URL || process.env.PARSE_SERVER_URL;
const configGraphQLServerURL = process.env.PARSE_DASHBOARD_GRAPHQL_SERVER_URL;
const configPrimaryKey = process.env.PARSE_DASHBOARD_PRIMARY_KEY || process.env.PARSE_SERVER_PRIMARY_KEY;
const configAppId = process.env.PARSE_DASHBOARD_APP_ID || process.env.PARSE_SERVER_APPLICATION_ID;
const configAppName = process.env.PARSE_DASHBOARD_APP_NAME;
const configUsername = process.env.PARSE_DASHBOARD_USERNAME;
const configUserPassword = process.env.PARSE_DASHBOARD_USER_PASSWORD;
const configUserPasswordEncrypted = process.env.PARSE_DASHBOARD_USER_PASSWORD_ENCRYPTED || true;

if (!process.env.PARSE_DASHBOARD_CONFIG) {
  if (configServerURL && configPrimaryKey && configAppId) {
    configFromCLI = {
      data: {
        apps: [
          {
            appId: configAppId,
            serverURL: configServerURL,
            masterKey: configPrimaryKey,
            appName: configAppName,
          },
        ]
      }
    };
    if (configGraphQLServerURL) {
      configFromCLI.data.apps[0].graphQLServerURL = configGraphQLServerURL;
    }
    if (configUsername && configUserPassword) {
      configFromCLI.data.users = [
        {
          user: configUsername,
          pass: configUserPassword,
        }
      ];
      configFromCLI.data.useEncryptedPasswords = configUserPasswordEncrypted;
    }
  } else if (!configServerURL && !configPrimaryKey && !configAppName) {
    configFile = path.join(__dirname, 'lib', 'parse-dashboard-config.json');
  }
} else {
  configFromCLI = {
    data: JSON.parse(process.env.PARSE_DASHBOARD_CONFIG)
  };
}

let config = null;
let configFilePath = null;
if (configFile) {
  try {
    config = {
      data: JSON.parse(fs.readFileSync(configFile, 'utf8'))
    };
    configFilePath = path.dirname(configFile);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log('Your config file contains invalid JSON. Exiting.');
      process.exit(1);
    } else if (error.code === 'ENOENT') {
      console.log('You must provide either a config file or required CLI options (app ID, Primary Key, and server URL); not both.');
      process.exit(3);
    } else {
      console.log('There was a problem with your config. Exiting.');
      process.exit(-1);
    }
  }
} else if (configFromCLI) {
  config = configFromCLI;
} else {
  //Failed to load default config file.
  console.log('You must provide either a config file or an app ID, Primary Key, and server URL. See parse-dashboard --help for details.');
  process.exit(4);
}

config.data.apps.forEach(app => {
  if (!app.appName) {
    app.appName = app.appId;
  }
});

if (config.data.iconsFolder && configFilePath) {
  config.data.iconsFolder = path.join(configFilePath, config.data.iconsFolder);
}

const app = express();
if (allowInsecureHTTP || trustProxy) app.enable('trust proxy');

config.data.trustProxy = trustProxy;
const dashboardOptions = { allowInsecureHTTP, cookieSessionSecret };
const dashboard = new ParseDashboard(config.data, dashboardOptions);
app.use(mountPath, dashboard);
const server = app.listen(port, host, function () {
  console.log(`The dashboard is now available at http://${server.address().address}:${server.address().port}${mountPath}`);
});
