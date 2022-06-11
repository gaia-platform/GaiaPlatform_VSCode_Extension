// -------------------------------------------------
// Copyright (c) Gaia Platform Authors
//
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE.txt file
// or at https://opensource.org/licenses/MIT.
// -------------------------------------------------

import * as vscode from 'vscode';
import * as path from 'path';
import {GaiaDataProvider} from './gaiaDataProvider';

export class GaiaCatalogProvider implements vscode.TreeDataProvider<CatalogItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<CatalogItem | undefined | null | void> =
    new vscode.EventEmitter<CatalogItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<CatalogItem | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor() {
  }

  refresh(): void {
    GaiaDataProvider.clear();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: CatalogItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CatalogItem): Thenable<CatalogItem[]> {
    if (element) {
      return Promise.resolve(this.getCatalogItems(element));
    } else {
      return Promise.resolve(this.getCatalogItems());
    }
  }

  private getCatalogItem(
      name: string,
      dbId: number,
      dbName: string,
      tableId?: number,
      tableType?: number,
      fields?: string[],
      columnId?: number,
      position?: number,
      type?: string,
      isArray?: boolean) {
    return new CatalogItem(
        vscode.TreeItemCollapsibleState.Collapsed,
        name, dbId, dbName, tableId, tableType, fields, columnId, position, type, isArray);
  }

  private getCatalogItems(element?: CatalogItem): CatalogItem[] {
    // We only read databases -> tables -> columns.
    // If this is a column, there there is no more data to read.
    if (element && element.columnId != undefined) {
      return [];
    }

    let items = GaiaDataProvider.getDatabases();
    if (!items) {
      return [];
    }

    // Return the databases if we were not passed a parent catalog item.
    if (!element) {
      return Object.keys(items).map((catalogItem, index) =>
        this.getCatalogItem(items[catalogItem].name, index, items[catalogItem].name),
      );
    }

    // Otherwise, this is a table element and we iterate over the table's fields.
    if (element.tableId != undefined) {
      items = GaiaDataProvider.getFields(element.dbId, element.tableId);
      return Object.keys(items).map((catalogItem, index) =>
        this.getCatalogItem(items[catalogItem].name,
            element.dbId, element.dbName, element.tableId, element.tableType, element.fields, index,
            items[catalogItem].position, items[catalogItem].type, items[catalogItem].repeated_count == 0));
    }


    // If a tableId is not defined then iterate over the database's tables.
    items = GaiaDataProvider.getTables(element.dbId);
    if (!items) {
      return [];
    }
    return Object.keys(items).map((catalogItem, index) => {
      const fields = [];
      const catalogFields = items[catalogItem].fields;
      if (catalogFields) {
        for (const catalogField of catalogFields) {
          fields.push(catalogField.name);
        }
      }
      return this.getCatalogItem(items[catalogItem].name, element.dbId, element.dbName, index,
          items[catalogItem].type, fields);
    });
  }
}

export class CatalogItem extends vscode.TreeItem {
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly label: string,
    public readonly dbId: number,
    public readonly dbName: string,
    public readonly tableId?: number,
    public readonly tableType?: number,
    public readonly fields?: string[],
    public readonly columnId?: number,
    public readonly position?: number,
    public readonly type?: string,
    public readonly isArray?: boolean,
  ) {
    super(label, collapsibleState);
    if (this.label == '') {
      this.label = '<default>';
    }
    const brackets = isArray ? '[]': '';
    if (columnId != undefined) {
      this.tooltip = `column type: ${this.type}${brackets}, position: ${this.position}`;
      this.contextValue = 'column';
      this.iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'column.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'column.svg'),
      };
    } else if (this.tableId != undefined) {
      this.tooltip = `table type: ${this.tableType}`;
      this.iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'table.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'table.svg'),
      };
      this.contextValue = 'table';
    } else {
      this.contextValue = 'database';
    }
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'catalog.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'catalog.svg'),
  };

  contextValue = 'database';
}
