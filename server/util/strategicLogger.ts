#!/usr/bin/env node

const pgPromise = require('pg-promise');
const octokit = require('@octokit/rest')();

/* database functions */
function contributionExists(pg, url) {
  return pg.query('select * from contributions where contribution_url=$1', [
    url,
  ]);
}

function getAllStrategicProjects(pg) {
  return pg.query(
    'select distinct project as id from groups, unnest(projects) project'
  );
}

function searchProjectById(pg, id) {
  return pg.oneOrNone('select * from projects where project_id = $1', [id]);
}

function searchGroupsByProjectId(pg, id) {
  return pg.oneOrNone(
    'select array_agg(c) as groups from (select group_id from groups where projects @> array[$1]::int[]) as dt(c);',
    [id]
  );
}

function listGroupsByGithub(pg, alias) {
  return pg.oneOrNone(
    'select array(select jsonb_object_keys(groups)::int) as groups from users where github_alias = $1',
    [alias]
  );
}

function getCompanyAliasByGithub(pg, alias) {
  return pg.oneOrNone('select company_alias from users where github_alias=$1', [
    alias,
  ]);
}

async function addWhitelistedContrib(pg, contrib, projId) {
  const desc = contrib.title;
  const date = contrib.created_at;
  const alias = (await getCompanyAliasByGithub(pg, contrib.user.login))
    .company_alias;
  const githubStat = contrib.state;
  const contribUrl = contrib.pull_request.html_url;

  const approver = 1; // get approverId
  const approvalStat = 'approved-strategic';
  return await pg.none(
    'insert into contributions (project_id, contribution_description, contribution_date, ' +
      'contributor_alias, contribution_github_status, contribution_url, approver_id, ' +
      'approval_status, approval_notes, approval_date, contribution_submission_date, ' +
      'contribution_closed_date, contribution_project_review, contribution_metadata) ' +
      'values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14:json)',
    [
      projId,
      desc,
      date,
      alias,
      githubStat,
      contribUrl,
      approver,
      approvalStat,
      null,
      null,
      date,
      date,
      true,
      null,
    ]
  );
}

async function getLastScrapeDate(pg, id) {
  return pg.oneOrNone(
    'select last_scrape_date from scraper where project_id=$1',
    [id]
  );
}

async function updateLastScrapeDate(pg, id) {
  return pg.none(
    'insert into scraper (project_id, last_scrape_date) values ($1, $2) on conflict (project_id) do update set last_scrape_date=$2',
    [id, new Date()]
  );
}

async function whitelistedContrib(pg, contrib, groups) {
  const username = contrib.user.login;
  const user = await listGroupsByGithub(pg, username);
  if (user && user.groups.length !== 0) {
    return groups.some(r => user.groups.includes(r));
  }
  return false;
}

async function fetchNewIssues(pg, owner, repo, date) {
  let response = null;
  if (date) {
    response = await octokit.issues.getForRepo({
      owner: owner.toString(),
      repo: repo.toString(),
      state: 'all',
      since: date.toString(),
    });
  } else {
    response = await octokit.issues.getForRepo({
      owner: owner.toString(),
      repo: repo.toString(),
      state: 'all',
    });
  }
  let { data } = response;

  while (octokit.hasNextPage(response)) {
    response = await octokit.getNextPage(response);
    data = data.concat(response.data);
  }

  return await data;
}

async function updateStrategicContribs(pg) {
  const projects = await getAllStrategicProjects(pg);
  projects.forEach(async proj => {
    const project = await searchProjectById(pg, parseInt(proj.id, 10));
    const url = project.project_url;
    if (url && url.match(/github/i)) {
      const urlTokens = url.split('/');
      const last = urlTokens.length - 1;
      const repo = urlTokens[last];
      const owner = urlTokens[last - 1];

      // groups this project belongs to
      const groups = (await searchGroupsByProjectId(pg, proj.id)).groups;

      const date = await getLastScrapeDate(pg, parseInt(proj.id, 10));

      if (date) {
        date = date.last_scrape_date;
      }

      // find all new issues
      const issues = await fetchNewIssues(pg, owner, repo, date);

      for (const issue of issues) {
        // check that the contribution doesn't exist and it's made by a whitelisted user
        if (
          issue.pull_request &&
          (await contributionExists(pg, issue.pull_request.html_url)).length ===
            0 &&
          (await whitelistedContrib(pg, issue, groups))
        ) {
          // insert to database
          await addWhitelistedContrib(pg, issue, proj.id);
        }
      }
      await updateLastScrapeDate(pg, parseInt(proj.id, 10));
    }
  });
}

async function run() {
  const options = {};

  const pgp = pgPromise(options);
  let pg = null;

  // configure database connection
  pg = pgp({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: null,
    ssl: null,
  });

  // set up octokit authentication with github token
  octokit.authenticate({
    type: 'oauth',
    token: '',
  });

  await updateStrategicContribs(pg);
}

// to use as stand-alone, remove export
export async function onboxRun(config, pg) {
  octokit.authenticate({
    type: 'oauth',
    token: config.github.token,
  });

  await updateStrategicContribs(pg);
}

if (require.main === module) {
  run().catch(error => {
    // tslint:disable-next-line:no-console
    console.error(error);
  });
}
