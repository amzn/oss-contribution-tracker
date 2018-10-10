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

// this array is used to easily convert numeric months into strings so Jan-Dec spans month[1-12]
const months = [
  undefined, // month[0] is undefined so Jan can start at month[1]
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
  let summary = `Group: ${report.group.group_name}

Sponsor: ${report.group.sponsor}

Goals
${report.group.goal}

This group has ${report.users.length} contributors and ${
    report.projects.length
  } projects.

The group made a total of ${report.group.strategic} contributions in ${
    months[month]
  } ${year}.
`;

  if (report.group.total - report.group.strategic !== 0) {
    summary += `There were ${report.group.total -
      report.group.strategic} other contributions across Amazon this month.\n`;
  }

  summary += `
User Metrics

`;

  for (const user of report.users) {
    summary += `${user.company_alias} made ${user.total} contributions.
`;
  }

  summary += `
Project Metrics

`;
  for (const project of report.projects) {
    summary += `Project: ${project.project_name}
The group made ${project.strategic} contributions to this project this month.
`;

    if (project.total - project.strategic !== 0) {
      summary += `There were ${project.total -
        project.strategic} other contributions to this porject across Amazon this month.
`;
    }

    if (project.strategic !== 0) {
      summary += `\nThe full list of strategic contributions is:
`;
      for (const contribution of project.contributions) {
        summary += `${contribution.contributor_alias} -- ${
          contribution.contribution_description
        } -- ${contribution.contribution_url}
`;
      }
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
