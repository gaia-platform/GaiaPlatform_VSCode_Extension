// -------------------------------------------------
// Copyright (c) Gaia Platform Authors
//
// Use of this source code is governed by the MIT
// license that can be found in the LICENSE.txt file
// or at https://opensource.org/licenses/MIT.
// -------------------------------------------------

export default class Errors {
  public static cannotRetrieveData( tableName : string) {
    return `An error occurred retrieving data for table '${tableName}'.`;
  }

  public static tableNotFound( tableName : string) {
    return `Could not find table ${tableName}.`;
  }

  public static relatedTableNotFound( tableName : string, linkName : string) {
    return `Could not find table ${tableName} for link ${linkName}.`;
  }

  public static sdkNotFound() {
    return 'Could not find the \'gaia_db_extract\' utility in \'/opt/gaia/bin/gaia_db_extract\'. ' +
        'Please verify that you have installed the Gaia SDK.';
  }
}
