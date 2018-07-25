/* Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
const months = [
  undefined,
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Converting json to csv format
function convertToText(data) {
  const report = typeof data !== 'object' ? JSON.parse(data) : data;
  const month = parseInt(data.date.slice(5, 7), 10);
  const year = parseInt(data.date.slice(0, 4), 10);
  let summary =
    `Group: ${report.group.group_name}\n\n` +
    `Sponsor: ${report.group.sponsor}\n\n` +
    `Goals\n` +
    `${report.group.goal}\n\n` +
    `This group has ${report.users.length} contributors and ${
      report.projects.length
    } projects.\n\n` +
    `There were a total of ${report.group.total} commits in ${
      months[month]
    } ${year}.\n` +
    `${report.group.strategic} of those commits were strategic (${report.group
      .strategic /
      report.group.total *
      100}%).\n\n` +
    `User Metrics\n\n`;

  for (const user of report.users) {
    summary += `${user.company_alias} made ${user.total} contributions.\n`;
  }

  summary += `\nProject Metrics\n\n`;
  for (const project of report.projects) {
    summary +=
      `Project: ${project.project_name}\n` +
      `There were a total of ${project.total} commits to this project.\n` +
      `${project.strategic} of those commits were strategic.\n\n` +
      `The full list of strategic commits is:\n`;
    for (const contribution of project.contributions) {
      summary += `${contribution.contributor_alias} -- ${
        contribution.contribution_description
      } -- ${contribution.contribution_url}\n`;
    }
    summary += '\n';
  }

  return summary;
}

// function on triggering of the download button
export function onClickDownload(data) {
  const csvData = new Blob([convertToText(data)], {
    type: 'text',
  });
  const csvURL = window.URL.createObjectURL(csvData);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = csvURL;
  tempLink.setAttribute(
    'download',
    `${data.date.slice(0, 7)}-${data.group.group_name}-report.txt`
  );
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
}
