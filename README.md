# Gaia Platform Tools

## Important Notice
This is the updated Gaia Platform Extension for Visual Studio Code. We are currently working to remove the old [Gaia Platform Intellisense](https://marketplace.visualstudio.com/items?itemName=gaia-platform.gaia-tools) extension from Marketplace.  If you have installed the `Gaia Platform Intellisense` extension, please uninstall it before installing this one.

## Features
The Gaia Platform Tools extension offers the following features:

* Syntax highlighting, IntelliSense support, and snippets for Gaia's schema definition and ruleset languages.
    * [DDL](https://gaia-platform.github.io/gaia-platform-docs.io/articles/reference/ddl-gaia.html) syntax is used to write __DDL__ files that define the schema for the objects used in a Gaia application.
    * [Declarative C++](https://gaia-platform.github.io/gaia-platform-docs.io/articles/reference/declarative-extentions.html) syntax is used to write rules in __ruleset__ files.
* A database explorer that allows you to browse database, table, and column metadata stored in a Gaia server instance.
* A data navigator that allows you to view the records stored in the database. In addition, the navigator allows you to view records related to the current record if the schema has defined one or more relationships between the current record's table and other tables in the database.

## Using the Extension
It may be helpful to reference the VS Code [User Interface](https://code.visualstudio.com/docs/getstarted/userinterface) documentation to understand how this extension exposes its functionality.

Two new Language Modes named `ruleset` and `ddl` are available on the rightmost section of the `Status Bar`.   The Language Mode will change automatically when editing a `.ddl` or `.ruleset` file. To change the mode manually, use `Ctrl+K M` (Windows/Linux) or `Cmd+K M` (macOS).

The database explorer is accessed by clicking the Gaia icon <img src="./resources/gaia_logo.png" height="20"> on the `Activity Bar`.  An explorer view of the Gaia databases will show in the `Side Bar`. Clicking on the <img src="./resources/boolean.png" height="20"> icon while highlighting a table will show that table's records in an editor pane.  If that table is related to other tables, then clicking on the <img src="./resources/boolean.png" height="20"> icon for the related link's record will show the related record in a new editor window.

## Getting Started with Gaia Platform

- [Website](https://www.gaiaplatform.io/)
- [About Gaia Platform](https://gaia-platform.github.io/gaia-platform-docs.io/index.html)
- [Documentation](https://gaia-platform.github.io/gaia-platform-docs.io/articles/getting-started-with-gaia.html)
- [Tutorials](https://gaia-platform.github.io/gaia-platform-docs.io/)
- [Sandbox](https://sandbox.gaiaplatform.io/)
- [Gaia Platform News](https://www.gaiaplatform.io/resources/gaia-platform-for-autonomous-indy)
