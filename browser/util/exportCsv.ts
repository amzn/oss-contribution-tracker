/* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

// Converting json to csv format
function convertToCSV(objArray) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  let csv = '';
  for (const row of array) {
    csv += row.join(',') + '\r\n';
  }
  return csv;
}

// function on triggering of the download button
export function onClickDownload(filteredDataList) {
  const csvData = new Blob([convertToCSV(filteredDataList)], {
    type: 'text/csv;charset=utf-8;',
  });
  const csvURL = window.URL.createObjectURL(csvData);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = csvURL;
  tempLink.setAttribute('download', 'data.csv');
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
}
