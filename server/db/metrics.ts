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
import pg from './index';

// tslint:disable:variable-name

export function usersAndCounts() {
  return pg().query(
    'select contributor_alias as alias, count(contributor_alias) as count ' +
      'from contributions group by contributor_alias order by count asc'
  );
}

export function topContribProjectsAllTime() {
  return pg().query(
    'select lower(P.project_name) as project_name, count(C.project_id) ' +
      'from contributions C, projects P where P.project_id = C.project_id ' +
      'group by P.project_name order by count desc'
  );
}

export function topContribProjectsByYear(year: number) {
  return pg().query(
    'select lower(P.project_name) as project_name, count(C.project_id) ' +
      'from contributions C, projects P where P.project_id = C.project_id and ' +
      "C.contribution_date >= '$1-01-01 00:00:00' and C.contribution_date < '$2-01-01 00:00:00' " +
      'group by P.project_name order by count desc',
    [year, year + 1]
  );
}

export function contribCountByYear(year: number) {
  return pg().query(
    "select '$1' as year, count(*) from contributions " +
      "where contribution_date >= '$1-01-01 00:00:00' and contribution_date < '$2-01-01 00:00:00'",
    [year, year + 1]
  );
}

export function contribCountByYearAll() {
  return pg().query(
    'select extract(year from contribution_date) as year, count(*) ' +
      'from contributions group by year order by year'
  );
}

export function allMetrics() {
  return pg().query(
    'select extract(year from contribution_date) as year, ' +
      'count(*) as total_contributions, count(distinct contributor_alias) as contributor_count, ' +
      'count(distinct project_id) as project_count from contributions group by year order by year'
  );
}

export function usersByCountRange(low, high) {
  return pg().query(
    'select contributor_alias as "Alias", count(contributor_alias) as "Count" from contributions ' +
      'group by contributor_alias having count(contributor_alias) >= $1 ' +
      'and count(contributor_alias) < $2 ' +
      'order by "Count" desc',
    [low, high]
  );
}
