// -------------------------------------------------
// Copyright (c) Gaia Platform Authors
//
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE.txt file
// or at https://opensource.org/licenses/MIT.
// -------------------------------------------------

import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import {ILink, ITableView} from './data_view/app/model';
import Errors from './data_view/app/errors';

// Interacts with the gaia_db_extract tool to get metadata from
// the catalog as well as row data for each table.  Allow multiple
// class instances the GaiaDataProvider to manage a static instance
// of the catalog
export class GaiaDataProvider {
  constructor() {
  }

  static getDatabases(): any {
    this.populateCatalog();
    return this.exists() ? this.catalog.databases : undefined;
  }

  static getTables(dbId: number): void {
    this.populateCatalog();
    return this.exists(dbId) ? this.catalog.databases[dbId].tables: undefined;
  }

  static getFields(dbId: number, tableId: number): void {
    this.populateCatalog();
    return this.exists(dbId, tableId) ? this.catalog.databases[dbId].tables[tableId].fields: undefined;
  }

  // Wipe the catalog so that we force a refresh the next
  // time we ask for data.
  static clear(): void {
    this.catalog = undefined;
  }

  // Never cache table data.
  static getTableData(link: ILink) {
    // We've got the data but we need to get the catalog metadata for the
    // column information.
    let table = this.findTable(link.dbName, link.tableName);
    if (!table) {
      vscode.window.showErrorMessage(Errors.tableNotFound(link.tableName));
      return undefined;
    }

    // If this link is requesting related rows then the linkName and linkRow fields
    // will be filled in.  In this case we want to request rows from the
    // related table.
    const dbExtractArgs = [`--database=${link.dbName}`, `--table=${link.tableName}`];
    if (link.linkName != undefined && link.linkRow != undefined) {
      table = this.findRelatedTable(table, link);
      if (!table) {
        vscode.window.showErrorMessage(Errors.relatedTableNotFound(link.tableName, link.linkName));
        return undefined;
      }
      dbExtractArgs.push(`--link-name=${link.linkName}`);
      dbExtractArgs.push(`--link-row=${link.linkRow}`);
    }

    // Fetch the data by running the extract tool
    const data = this.spawnExtractCommand(dbExtractArgs);
    if (!data) {
      return undefined;
    }

    const fields = table.fields;
    const cols = [];

    const relationships = this.getRelationships(table);
    if (relationships) {
      // Add any relationships as "generated columns"
      for (let i = 0; i < relationships.length; i++) {
        const relationship = relationships[i];
        cols.push({
          key: relationship.link_name,
          name: this.getGeneratedFieldName(relationship.link_name),
          isLink: true,
          isArray: false,
        });
      }
    }

    // Add the table's columns now.
    // It is okay if a table only has relationship columns.
    if (fields) {
      for (let i = 0; i < fields.length; i++) {
        cols.push({
          key: fields[i].name,
          name: fields[i].name,
          isLink: false,
          isArray: fields[i].repeated_count == 0,
        });
      }
    }

    const tableData: ITableView = {
      dbName: link.dbName,
      tableName: table.name,
      columns: cols,
      rows: data.rows || [],
    };

    return tableData;
  }

  private static getGeneratedFieldName(name: string) {
    return '<' + name + '>';
  }

  // Verify that all references exist in the JSON up to the last optional
  // parameter passed in.
  private static exists(dbId?: number, tableId?: number) {
    if (!this.catalog) {
      return false;
    }

    if (dbId != undefined) {
      const databases = this.catalog.databases;
      if (databases == undefined || databases[dbId] == undefined) {
        return false;
      }
      if (tableId != undefined) {
        const tables = databases[dbId].tables;
        if (tables == undefined || tables[tableId] == undefined) {
          return false;
        }
      }
    }

    return true;
  }

  private static findTable(dbName: string, tableName: string) {
    this.populateCatalog();
    if (!this.catalog) {
      return undefined;
    }
    const databases = this.catalog.databases;
    if (!databases) {
      return undefined;
    }

    for (let dbIndex = 0; dbIndex < databases.length; dbIndex++) {
      if (databases[dbIndex].name == dbName) {
        const tables = databases[dbIndex].tables;
        if (!tables) {
          return undefined;
        }
        for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
          if (tables[tableIndex].name == tableName) {
            return tables[tableIndex];
          }
        }
      }
    }

    return undefined;
  }

  private static findRelatedTable(table: any, link: ILink) {
    const relationships = this.getRelationships(table);
    for (let i = 0; i < relationships.length; i++) {
      const relationship = relationships[i];
      if (relationship.link_name == link.linkName) {
        return this.findTable(link.dbName, relationship.table_name);
      }
    }
    return undefined;
  }

  private static getRelationships(table: any) {
    return table.relationships;
  }

  private static populateCatalog() {
    if (this.catalog) {
      return;
    }

    this.catalog = this.spawnExtractCommand();
  }

  private static spawnExtractCommand(args?: any) {
    const {error, stdout, stderr} = args ?
     childProcess.spawnSync(this.extractCmd, args) :
     childProcess.spawnSync(this.extractCmd);

    if (error) {
      vscode.window.showErrorMessage(Errors.sdkNotFound());
      return undefined;
    }

    const resultText = stderr.toString().trim();
    if (resultText) {
      vscode.window.showErrorMessage(resultText);
      return undefined;
    }

    return JSON.parse(stdout.toString());
  }

  static catalog:any = undefined;
  static readonly extractCmd:string = '/opt/gaia/bin/gaia_db_extract';
}
