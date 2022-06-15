// -------------------------------------------------
// Copyright (c) Gaia Platform Authors
//
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE.txt file
// or at https://opensource.org/licenses/MIT.
// -------------------------------------------------

'use strict';

import * as vscode from 'vscode';
import {CatalogItem} from '../databaseExplorer';
import {ICommand, CommandAction, ILink, IPanelState} from './app/model';
import {GaiaDataProvider} from '../gaiaDataProvider';
import {getUri} from './getUri';
import Errors from './app/errors';

// Manages react webview panels.
export default class ViewLoader {
  // Track the currently panel.
  // Only allow a single panel to exist at a time.

  public static currentViews: any = {};

  private static readonly viewType = 'react';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _title: string;
  private _state: IPanelState;
  private _disposables: vscode.Disposable[] = [];

  // Shows records from a table.
  public static showRecords(extensionUri: vscode.Uri, item: CatalogItem) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn: undefined;
    const title = `${item.dbName}.${item.label}`;

    // If we already have a panel with this title, then show it
    if (ViewLoader.currentViews[title]) {
      ViewLoader.currentViews[title]._panel.reveal(column);
    } else {
      ViewLoader.currentViews[title] = new ViewLoader(
          title,
          column || vscode.ViewColumn.One,
          {
            dbName: item.dbName,
            tableName: item.label,
            linkName: undefined,
            linkRow: undefined,
          },
          extensionUri,
      );
    }
  }

  // Shows related records to a table.
  public static showRelatedRecords(extensionUri: vscode.Uri, link: ILink) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn: undefined;

    // See if we can find the metadata for this table via the catalog.  If not,
    // we'll have to look it up.

    const title = `${link.tableName}.${link.linkName}`;

    // For now, always create a new view since the set of records
    // for the same title may be diffrent depending on the row id of the
    // "parent" record
    ViewLoader.currentViews[title] = new ViewLoader(
        title,
        column || vscode.ViewColumn.One,
        link,
        extensionUri,
    );
  }

  // Called when the user has changed the theme. We just want to reapply the CSS
  // but I haven't figured out a good way to do this so re-render the HTML.
  public static applyTheme() {
    for (const title in ViewLoader.currentViews) {
      if (Object.prototype.hasOwnProperty.call(ViewLoader.currentViews, title)) {
        ViewLoader.currentViews[title].updateHtml();
      }
    }
  }

  private updateHtml() {
    // Only refresh a panel that has user focus.
    if (!this._panel.active) {
      return;
    }
    this._panel.webview.html = this._getHtmlForWebview(
        this._state.link,
        this._panel.webview,
        this._state.extensionUri);
  }

  private constructor(title: string, column: vscode.ViewColumn, link: ILink, extensionUri: vscode.Uri) {
    this._title = title;
    this._state = {link, extensionUri};

    // Create and show a new webview panel.
    this._panel = vscode.window.createWebviewPanel(ViewLoader.viewType, this._title, column, {
      // Enable javascript in the webview.
      enableScripts: true,

      // And restrict the webview to only loading content from our extension's `media` directory.
      localResourceRoots: [
        extensionUri,
      ],
    });

    // Set the webview's initial html content.
    this._panel.webview.html = this._getHtmlForWebview(link, this._panel.webview, extensionUri);

    // Listen for when the panel is disposed.
    // This happens when the user closes the panel or when the panel is closed programatically.
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview.
    this._panel.webview.onDidReceiveMessage((command: ICommand) => {
      switch (command.action) {
        case CommandAction.ShowRelatedRecords:
          vscode.commands.executeCommand('databases.showRelatedRecords', command.link);
          return;
      }
    }, null, this._disposables);
  }

  public doRefactor() {
    // Send a message to the webview.
    // You can send any JSON serializable data.
    this._panel.webview.postMessage({command: 'refactor'});
  }

  public dispose() {
    delete ViewLoader.currentViews[this._title];

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForNoTable(tableName: string) {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1.0,shrink-to-fit=yes">
        </head>
        <body>
            <div id="root">
            <h2> ${Errors.cannotRetrieveData(tableName)}.</h2>
            </div>
        </body>
        </html>`;
  }

  private _getHtmlForWebview(link: ILink, webview: vscode.Webview, extensionUri: vscode.Uri) {
    // Here 'app' refers to the react application running inside the webview.
    const scriptPathOnDisk = vscode.Uri.joinPath(extensionUri, 'build', 'dataViewer.js');
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
    const toolkitUri = getUri(webview, extensionUri, [
      'node_modules',
      '@vscode',
      'webview-ui-toolkit',
      'dist',
      'toolkit.js', // A toolkit.min.js file is also available
    ]);

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    const tableData = GaiaDataProvider.getTableData(link);
    if (!tableData) {
      return this._getHtmlForNoTable(link.tableName);
    }

    const tableJson = JSON.stringify(tableData);

    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1.0,shrink-to-fit=no">
                <meta name="theme-color" content="#000000">
                <title>Data View</title>
                <meta http-equiv="Content-Security-Policy"
                    content="default-src 'none';
                    script-src 'nonce-${nonce}';
                    style-src 'unsafe-inline' ${webview.cspSource};">
                <script nonce="${nonce}" type="module" src="${toolkitUri}"></script>
                <script nonce="${nonce}">
                    window.acquireVsCodeApi = acquireVsCodeApi;
                    window.initialData = ${tableJson};
                </script>
            </head>
            <body>
                <div id="root"></div>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const nonceLength = 32;
  for (let i = 0; i < nonceLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
