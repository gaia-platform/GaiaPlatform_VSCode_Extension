// -------------------------------------------------
// Copyright (c) Gaia Platform Authors
//
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE.txt file
// or at https://opensource.org/licenses/MIT.
// -------------------------------------------------

import {hoverInfo} from './hoverInfo';
import * as vscode from 'vscode';
import {GaiaCatalogProvider} from './databaseExplorer';
import ViewLoader from './data_view/ViewLoader';

export function activate(context: vscode.ExtensionContext) {
  // Support syntax highlighting for .ddl and .ruleset files.
  const hoverInfoMap = new Map(Object.entries(hoverInfo));

  // Creates provider to give the extension hover functionality.
  vscode.languages.registerHoverProvider('ruleset', {
    provideHover(document, position, token) {
      // Finds the line that the user's cursor is hovering over.
      const range = document.getWordRangeAtPosition(position);

      // Gets the word that the cursor is hovering over given the line.
      const word: string = document.getText(range);

      // Constructs each hover based on its value in hoverInfoMap.
      if (hoverInfoMap.has(word)) {
        // Creates markdown string to be used in hover.
        const markdownString = new vscode.MarkdownString(`${hoverInfoMap.get(word)}`);

        // Indicates that the markdown string is from a trusted source.
        markdownString.isTrusted = true;
        return new vscode.Hover(markdownString);
      }
    },
  });

  // Support navigating Gaia data store.
  vscode.commands.registerCommand('databases.showRecords', (item) => {
    ViewLoader.showRecords(context.extensionUri, item);
  });
  vscode.commands.registerCommand('databases.showRelatedRecords', (link) => {
    ViewLoader.showRelatedRecords(context.extensionUri, link);
  });

  const gaiaProvider = new GaiaCatalogProvider();
  vscode.window.registerTreeDataProvider('databases', gaiaProvider);
  vscode.commands.registerCommand('databases.refreshEntry', () =>
    gaiaProvider.refresh(),
  );

  context.subscriptions.push(vscode.window.onDidChangeActiveColorTheme( () =>
    ViewLoader.applyTheme(),
  ));
}
