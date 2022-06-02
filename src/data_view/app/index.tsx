import * as React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import DataView from './dataview';
import {ITableView} from './model';

declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
        acquireVsCodeApi():any;
        initialData: ITableView;
    }
}

const vscode = window.acquireVsCodeApi();
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<DataView vscode={vscode} initialData={window.initialData} />);
