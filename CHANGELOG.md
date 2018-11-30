# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html), as much as
a website reasonably can. Backwards incompatible changes (requiring a major version bump) will be
described here, and may involve database changes, significant workflow changes, or changes that
require manual edits to pluggable interfaces.

## Unreleased

### Improvements to strategic projects

## 1.1.0

### Changed
- Added config for the browser (browser/config.js) to control the simpleContributions workflow.
- strategicLogger.ts can stampede the GitHub API and throw abuse errors so I added a sleep function (random sleep between 3 and 12 seconds) to stutter the requests.
- Dates are actually displayed when editing a contribution

### Added
- This CHANGELOG.md! Unless requested I am not going to backfill the changelog.
- Simple contribution process. This adds a new way to submit contributions that allows for automatic approval based on type and size of contribution. These are setup through the config.contributions.autoApprove object which allows you to specify the allowed length of the change as well as differing types.
  - This includes additional default values that need to be filled out by the user.
- Adjusted the software to fail on launch if the config is not properly filled out.

### Security
- Updated multiple dependencies to newer and secure versions.
- Removed flatmap since it is now crypto malware.
