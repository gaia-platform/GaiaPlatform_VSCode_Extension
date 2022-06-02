// --------------------------------
// Copyright (c) Gaia Platform LLC
// All rights reserved.
// --------------------------------

import * as React from 'react';
import DataGrid from 'react-data-grid';
import {CommandAction, ICommand} from './model';
import ShowRecordsDarkIcon from '../../../resources/dark/boolean.svg';
import ShowRecordsLightIcon from '../../../resources/light/boolean.svg';
import {VSCodeButton} from '@vscode/webview-ui-toolkit/react';

function getArrayString( arrayData: any ) {
  if (!arrayData || arrayData.length == 0) {
    return '';
  }

  let arrayString = '[';
  for (let i = 0; i < arrayData.length; i++) {
    arrayString += arrayData[i];
    if (i < arrayData.length - 1) {
      arrayString += ', ';
    }
  }
  arrayString += ']';
  return arrayString;
}

function getAppearance() {
  const theme = document.body.className;
  let gridTheme = 'rdg-light';
  let recordsIcon = ShowRecordsLightIcon;
  // Unfortunately, we don't get the light or dark "flavor"
  // of high contrast.
  if (theme === 'vscode-dark' || theme == 'vscode-high-contrast') {
    gridTheme = 'rdg-dark';
    recordsIcon = ShowRecordsDarkIcon;
  }

  return {gridClass: gridTheme, RecordsIcon: recordsIcon};
}

function DataView(props: any) {
  const initialData = props.initialData;
  const vscode = props.vscode;

  const {gridClass, RecordsIcon} = getAppearance();

  for (let i = 0; i < initialData.columns.length; i++) {
    const col = initialData.columns[i];
    if (col.isLink) {
      // Note that the row_id is returned in the data but we don't
      // expose it as a column.
      col['formatter'] = ({row}) => {
        return <VSCodeButton appearance="icon" onClick={() => {
          const command: ICommand = {
            action: CommandAction.ShowRelatedRecords,
            link: {
              dbName: initialData.dbName,
              tableName: initialData.tableName,
              linkName: col.key,
              linkRow: row.row_id,
            },
          };
          vscode.postMessage(command);
        }} >
          <RecordsIcon/>
        </VSCodeButton>;
      };
    } else if (col.is_array) {
      col['formatter'] = ({row}) => {
        return getArrayString(row[col.key]);
      };
    }
  }

  return <DataGrid className={gridClass} style={{height: window.innerHeight}}
    columns={initialData.columns} rows={initialData.rows} />;
}

export default DataView;
