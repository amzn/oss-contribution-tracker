# OSS-Contribution-Tracker

OSS-Contribution-Tracker is a tool that tracks external contributions to third-party open source software and the CLAs that are sometimes tagged on.

## Notes

This was originally an Amazon internal tool. Because of this, the package is currently very spartan in terms of features as it had code dependent on other internal tools/packages. This should be changing as those features are rolled into this package.

## Quickstart setup

1. Install [Docker](https://www.docker.com) for your platform of choice
2. Clone this repository to your machine
3. Edit `config/default.js` and fill out the ldap, admin, approver, and display sections
4. Run `docker-compose up`
5. Navigate to http://0.0.0.0:8000/ via your preferred browser
6. Log all the contributions

## Package layout

This package is structured in two main levels: the top-level directory (this one) and the `oss-contribution-tracker` directory.

The oss-contribution-tracker directory contains the oss-contribution-tracker application itself -- JavaScript/TypeScript, gulp build logic, NPM metadata, etc.

## Development server

If you are interested in setting up a development server for testing, or just want to mess with the code base, you can launch a dev environment by doing the following.

`Note: you will need to have the same information filled out in 'config/default.js' and will need to run two terminals or a screen/tmux session`

1. Change directories to the root directory in both terminals
2. Run `docker-compose -f docker-compose.dev.yml up` which will bring up a local postgres instance
3. Run `npm install && CONFIG_NAME='dev' gulp server` to install and launch a development instance of the oss-contribution-tracker
4. Navigate to http://0.0.0.0:8000/

### Testing

To run the integration/unit tests run `gulp test` from the root folder.

To run UI tests do the following:
1. Run `docker-compose -f docker-compose.selenium.yml up` from the root directory
2. Run `gulp test-ui` from the root directory

`Note: you can connect to the selenium instance through VNC to actually view the UI tests. This is useful when trying to troubleshoot or write new features.`

### Environment Variables

Set CONFIG_NAME='dev|prod' to use the dev or prod configurations.

Set DEBUG_SQL=1 to show full SQL commands on the console.

Set DEBUG_USER=$USER to simulate a user during development. The default user is 'nobody'.

## Contributing
Read [CONTRIBUTING](CONTRIBUTING.md) for details.

### Editor Plugins

These plugins can assist in development and maintaining code style in this project:

### VS Code ###

* EditorConfig for VS Code
* ESLint
* TSLint
* TypeLens
