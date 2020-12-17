# OSS-Contribution-Tracker
[![](https://github.com/amzn/oss-contribution-tracker/workflows/CI/badge.svg)](https://github.com/amzn/oss-contribution-tracker/actions?query=workflow%3ACI)

OSS-Contribution-Tracker is a tool that tracks external contributions to third-party open source software and CLAs that are sometimes associated.

## Quickstart setup

1. Install [Docker](https://www.docker.com) for your platform of choice
2. Clone this repository to your machine
3. Edit `config/default.js` and fill out the ldap, admin, approver, and display sections
4. Run `docker-compose up`
5. Navigate to http://0.0.0.0:8000/ via your preferred browser
6. Log all the contributions

## Development server

If you are interested in setting up a development server for testing, or just want to mess with the code base, you can launch a dev environment by:

1. Running `npm install` (if you haven't already)
2. Run `docker-compose -f docker-compose.dev.yml up` to start up a PostgreSQL container
3. In a new shell, run `npm run dev` to launch a development/auto-reloading instance.
4. Navigate to http://0.0.0.0:8010/

### Using Alternate Configurations
You can provide a custom configuration by placing your config in the server/config directory and by running

`npm run dev --alt_config=<config name>`

### Testing

To run unit tests, run `npm test` from the root folder.

To run UI tests:
1. Run `docker-compose -f docker-compose.selenium.yml up` from the root directory
2. Run `npm run test-ui` from the root directory

**Note:** You can connect to the selenium instance through VNC to actually view the UI tests. This is useful when trying to troubleshoot or write new features.

### Environment Variables

Set `DEBUG_SQL=1` to show full SQL commands on the console.

Set `DEBUG_USER=$USER` to simulate a user during development. The default user is 'nobody'.

## Contributing
Read [CONTRIBUTING](CONTRIBUTING.md) for details.

### Editor Plugins

These plugins can assist in development and maintaining code style in this project:

### VS Code ###

* EditorConfig for VS Code
* TSLint
