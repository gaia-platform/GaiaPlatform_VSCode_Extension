// -------------------------------------------------
// Copyright (c) Gaia Platform Authors
//
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE.txt file
// or at https://opensource.org/licenses/MIT.
// -------------------------------------------------

'use strict';

export const hoverInfo = {
  // Methods.
  on_update: 'Specifies that the rule fires when a change occurs to the specified fields in existing rows in a table ' +
    'or a change to a specified table.' + '  \n  \n' +
    'If the fields are unique in the Catalog, you can omit specifying which table they are in.',
  on_insert: 'Specifies that the rule fires on the insertion of a row in the specified table.',
  on_change: 'Specifies that the rule fires when there is an insertion or change of a row that contains the ' +
    'specified fields in the specified table.',
  connect: 'Connect links rows between two tables based on an existing relationship between the tables.  \n  \n' +
    '[Identifier].field_name1.connect(Table_name2)  \n  \nThe identifier can be either a table name or a tag.  \n  \n' +
    'Table_name 1.connect(Table_name2).  \n  \nYou can use connect()/disconnect() directly on tables if there is '+
    'only one relationship between the two tables. Otherwise, you need to use the link name as defined in the DDL.',
  disconnect: 'Disconnect unlinks the rows.  \n  \n' +
    'Disconnecting a one to many relationship: [identifier].link_name.disconnect(row).  \n  \n' +
    'Disconnecting a one to one relationship: [identifier].link_name.disconnect()',
  insert: 'Inserts a row into a table.\n[Table_name].Insert(field_1:  value_1, ..., field_n: value_n)\n  ' +
    'Table_name: a table in the Catalog.  \n  ' +
    'Name Map: a series of entries in the form FieldName: FieldValue.  \n' +
    '*Note: Omitting a parameter will result in a default value of empty or 0.  \n' +
    'The insert statement only allows inserting into primitive types.',
  remove: 'Removes one or more rows from a table.  \n  \n' +
    '[Table_Name].remove():  Removes the current row based on the anchor and the reference,  \n  \n' +
    'on_update(p:passenger)  \n  \n{  \n    p.remove();  \n}  \n  \n' +
    'Note: Attempting to remove a row that is currently connected will result in an error.' +
    'Call disconnect() first and then remove the row.',
  // Declarative looping.
  if: 'The if statement has the following form:  \n[label:]  \nif (condition)  \n{  \n [continue [label]];  \n ' +
    '[break [label]];  \n}  \n[else if (condition)  \n{  \n [continue [label]];  \n [break [label]];  \n}]  \n' +
    '[else  \n{  \n [continue [label]];  \n [break [label]];  \n}]  \n[nomatch]  // matches else if  \n{   \n}  \n' +
    '[[nomatch] // matches if  \n{  \n}',
  for: 'The for statement allows you to iterate over a set of rows in the database. The for statement in' +
    'Gaia’s Declarative C++ has the following differences:  \n  \n' +
    '1.) A tag specifies the range_declaration. Unlike the standard C++ for, you can declare multiple tags ' +
    'to allow access to multiple "loop" variables within the scope of the for. You must specify a tag if you ' +
    'want to reference the rows in the body of the for.  \n  \n' +
    '2.) The range_expression in the for statement is a table or a path to a table.  \n  \n' +
    '3.) A label can precede the for statement. You can use the label with the continue and break keywords.  \n  \n' +
    '4.) An optional nomatch statement can follow the body of the for. Code in a nomatch clause is executed if ' +
    'nothing in the body of the for loop executes.',
  while: 'The while and do while statements allow you to iterate over a set of rows in the database.  \n  \n' +
    'while (Table->Table1) { …}',
  do: 'The while and do while statements allow you to iterate over a set of rows in the database.  \n  \n' +
    'do {...} while(Table->Table1)',
  // Keywords.
  nomatch: 'A nomatch clause is added to indicate when the condition in an if, else-if or for could not be ' +
  'evaluated if there are no rows returned in the navigation path. If the nomatch clause is omitted and there are no ' +
  'rows, then execution continues with the next statement after the if, as if nomatch {} is specified.  \n  \n' +
  'A nomatch{} statement is bound to its closest matching if or else-if statement.',
};
