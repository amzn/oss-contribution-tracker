/* Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
import * as db from '../../db/metrics';

export async function usersAndCounts(req) {
  return await db.usersAndCounts();
}

export async function topContribProjectsAllTime(req) {
  return await db.topContribProjectsAllTime();
}

export async function contribCountByYear(req, year) {
  const contribCount = await db.contribCountByYear(parseInt(year, 10));
  return contribCount[0]; // query returns in structure of [{}] so we strip it
}

export async function contribCountByYearAll(req) {
  return await db.contribCountByYearAll();
}

export async function topContribProjectsByYear(req, year) {
  return await db.topContribProjectsByYear(parseInt(year, 10));
}

export async function allMetrics(req) {
  const currYear = new Date().getFullYear();
  const prevYear = new Date().getFullYear() - 1;
  return {
    allMetrics: await db.allMetrics(),
    topContribProjectsThisYear: await db.topContribProjectsByYear(currYear),
    topContribProjectsLastYear: await db.topContribProjectsByYear(prevYear),
    topContribProjectsAllTime: await db.topContribProjectsAllTime(),
    contribCountByYearAll: await db.contribCountByYearAll(),
    usersAndCounts: await db.usersAndCounts(),
  };
}

export async function getAllReports(req) {
  return [
    {
      id: 1,
      title: 'Contributions by Year',
    },
    {
      id: 2,
      title: 'Top Contributors',
    },
  ];
}

export async function getReport(req, id) {
  switch (id) {
    case '1':
      return {
        title: 'Contributions by Year',
        description: 'This reports contribution and project metrics by year.',
        tables: [
          {
            data: await db.allMetrics(),
          },
        ],
      };
    case '2':
      return {
        title: 'Top Contributors',
        description:
          'This lists the top contributors by various bracket levels.',
        tables: [
          {
            title: 'Top Contributors 100+',
            data: await db.usersByCountRange(100, 500),
          },
          {
            title: 'Top Contributors 50+',
            data: await db.usersByCountRange(50, 100),
          },
          {
            title: 'Top Contributors 20+',
            data: await db.usersByCountRange(20, 50),
          },
          {
            title: 'Top Contributors 10+',
            data: await db.usersByCountRange(10, 20),
          },
        ],
      };
    default:
      return { title: null };
  }
}
