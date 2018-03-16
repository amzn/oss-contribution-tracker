# Display Extensions

Display extensions allow site administrators to change how the contribution tracker looks and functions on the client side. You can think of them like plugins for a template engine. They can alter things like the site name/logo, footer, and other pieces as functionality is added.

## Format

An extension must:

* Be located in the `extensions` directory (this one).
* Have an extension of `.ext.ts`, `.ext.tsx`, `.ext.js`, or `.ext.jsx`.
* Import/require the `register` function from `../ext`.
* Call `register` with two parameters:
    * `extensionPoint` _(string)_ - The name of the extension point (hook) where your extension will run.
    * `ext` _(function)_ - The function that will be called when this extension is triggered. Parameters and return values may vary for each extension point; see below.

### Example

See `DemoFooter.ext.tsx` in this directory. This extension adds a link to this project's GitHub page in the footer.

## Extension Points

The following are the current extension points shipped with oss-contribution-tracker. If you think there should be another, feel free to submit an issue or pull request.

### `footer`

Add a page footer with links to your site/company's support resources.

A [React functional component].

* Input:
    * `props` - React props. Empty.
* Return: a rendered React component.

### `navbar-logo`

Replace the "contribution Builder" text with your own text or logo.

A [React functional component].

* Input:
    * `props` - React props:
        * `children` - the default header text
* Return: a rendered React component.

### `navbar-links`

Add additional links to the navbar.

A [React functional component].

* Input:
    * `props` - React props. Empty.
* Return: a rendered React component.

### `navbar-contribution`

Allows for replacing the contribution system.

A [React functional component].

* Input:
    * `props` - React props. Empty.
     * `children` - The default contribution process.
* Return: a rendered React component.

### `navbar-end`

Add additional items to the end of the navbar.

A [React functional component].

* Input:
    * `props` - React props. Empty.
* Return: a rendered React component.

### `ldap-info`

Area for displaying additional ldap information.

A [React functional component].

* Input:
    * `props` - React props. Empty.
    * `alias` - Alias of the user accessing the page. This is used for accessing the users LDAP info.
* Return: a rendered React component.

### `landing-content`

Replace the default landing content.

A [React functional component].

* Input:
    * `props` - React props. Empty.
        * `children` - Default landing metrics.
* Return: a rendered React component.

### `admin-sidebar`

Add options to the admin sidebar.

A [React functional component].

* Input:
    * `props` - React props. Empty.
* Return: a rendered React component.

### `admin-content`

Area for displaying additional admin components

A [React functional component].

* Input:
    * `props` - React props. Empty.
* Return: a rendered React component.

### `routes-additional`

Add additional routes for react-router-dom.

A [React functional component].

* Input:
    * `props` - React props. Empty.
* Return: a react-router-dom route.

[React functional component]: https://reactjs.org/docs/components-and-props.html#functional-and-class-components