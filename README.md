# parse-hipaa-dashboard 


![dashboard](https://user-images.githubusercontent.com/8621344/102236202-38f32080-3ec1-11eb-88d7-24e38e95f68d.png)

Example of how to setup and run your own [parse-dashboard](https://github.com/parse-community/parse-dashboard) for viewing/modifying your data in the Cloud. Designed for [parse-hipaa](https://github.com/netreconlab/parse-hipaa), but can be used for any parse-server.  

**Use at your own risk. There is not promise that this is HIPAA compliant and we are not responsible for any mishandling of your data**

## Deployment
parse-hipaa can be easily deployed or tested remote or locally.

### Remote

#### Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

You can use the one-button deployment to quickly deploy to Heroko. **Note that this is non-HIPAA compliant when using Heroku's free services**, so you need to work with Heroku to enable this. Once you click the Heroku button do the following:

1. Select your **App name**
2. Under the **Config vars** section, set all `required` environment vars to connect to your parse-server
3. Scroll to the bottom of the page and press **Deploy app**

#### Using your own files for Heroku deployment
1. Fork the the parse-hipaa-dashboard repo
2. Open `dashboard/Dockerfile.heroku` and uncomment `COPY ./parse-dashboard-config.json ./parse-dashboard-config.json`. Edit the config file to your desired configuration. This will build from your respective repo instead of using the pre-built docker image
3. You can then follow the directions on heroku's site for [deployment](https://devcenter.heroku.com/articles/git) and [integration](https://devcenter.heroku.com/articles/github-integration)

### Local: using docker 
To get started with parse-hipaa simply type:

```docker-compose up```

### Environment Variables

#### parseplatform/parse-dashboard
```bash
PARSE_DASHBOARD_TRUST_PROXY: # Default is 1, this should always be left as 1 when using docker
PARSE_DASHBOARD_COOKIE_SESSION_SECRET: # Unique string. This should be constant across all deployments on your system
MOUNT_PATH: # The default is "/dashboard". This needs to be exactly what you plan it to be behind the proxy, i.e. If you want to access cs.uky.edu/dashboard it should be "/dashboard"
```

## Viewing Your Data via Parse Dashboard
Parse-dashboard is binded to your localhost on port 4040 and can be accessed as such, e.g. http://localhost:4040/dashboard. The default login for the parse dashboard is username: "parse", password: "1234". For production you should change the password in the [postgres-dashboard-config.json](https://github.com/netreconlab/parse-hipaa/blob/master/parse-dashboard-config.json#L14). Note that ideally the password should be hashed by using something like [bcrypt-generator](https://bcrypt-generator.com) or using [multi factor authentication](https://github.com/parse-community/parse-dashboard#multi-factor-authentication-one-time-password). You can also add more users through this method.

1. Open your browser and go to http://localhost:4040/dashboard
2. Username: `parse` # You can use `parseRead` to login as a read only user
3. Password: `1234`
4. Be sure to refresh your browser to see new changes synched from your CareKitSample app

### Configuring
As mentioned, the default address and port the parse-server dashboard is binded to is 127.0.0.1:4040:4040 which means it can only be accessed by your local machine. If you want to change this, you should do it [here](https://github.com/netreconlab/parse-hipaa/blob/master/docker-compose.yml#L29). If you plan on using this image to deploy in production, it is recommended to run this behind a proxy and add the environment variable `PARSE_DASHBOARD_TRUST_PROXY=1` to the dashboard container. Note that since the parse dashboard is running in docker, the following should remain in the yml, `command: parse-dashboard --dev`.
