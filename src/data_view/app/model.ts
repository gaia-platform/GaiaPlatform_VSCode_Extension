// -------------------------------------------------
// Copyright (c) Gaia Platform Authors
//
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE.txt file
// or at https://opensource.org/licenses/MIT.
// -------------------------------------------------

import * as vscode from 'vscode';

export interface ITableView {
  dbName: string;
  tableName : string;
  columns: IColumn[];
  rows : any;
}

export interface IColumn {
  key : string;
  name : string;
  isLink : boolean;
  isArray : boolean;
}

export interface ICommand {
  action: CommandAction;
  link: ILink;
}

// The link defines the database and table information.
// If this is a request to get rows related to the table
// then a link_name and link_row are provided.
export interface ILink {
  dbName : string;
  tableName : string;
  linkName? : string;
  linkRow? : number;
}

// Actions that are commanded from the webview to the
// extension.
export enum CommandAction {
  // eslint-disable-next-line no-unused-vars
  ShowRelatedRecords
}

// Saved context to re-open a webview based on its previous
// state.
export interface IPanelState {
  link : ILink
  extensionUri : vscode.Uri
}
