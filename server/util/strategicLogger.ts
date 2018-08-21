#!/usr/bin/env node

const pgPromise = require('pg-promise');
const octokit = require('@octokit/rest')();

/* database functions */
function contributionExists(pg, contribId) {
  return pg.query('select * from contributions where github_id=$1', [
    contribId,
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

function getAmazonAliasByGithub(pg, alias) {
  return pg.oneOrNone('select company_alias from users where github_alias=$1', [
    alias,
  ]);
}

async function addWhitelistedContrib(pg, contrib, projId) {
  const desc = contrib.title;
  const date = contrib.created_at;
  const alias = (await getAmazonAliasByGithub(pg, contrib.user.login))
    .company_alias;
  const githubStat = contrib.state;
  const contribUrl = contrib.html_url;
  const githubId = contrib.id;

  const approver = 1; // get approverId
  const approvalStat = 'approved-strategic';
  return await pg.none(
    'insert into contributions (project_id, contribution_description, contribution_date, ' +
      'contributor_alias, contribution_github_status, contribution_url, github_id, approver_id, ' +
      'approval_status, approval_notes, approval_date, contribution_submission_date, ' +
      'contribution_closed_date, contribution_project_review, contribution_metadata) ' +
      'values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15:json)',
    [
      projId,
      desc,
      date,
      alias,
      githubStat,
      contribUrl,
      githubId,
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

async function whitelistedContrib(pg, contrib, groups) {
  const username = contrib.user.login;
  const user = await listGroupsByGithub(pg, username);
  if (user && user.groups.length !== 0) {
    return groups.some(r => user.groups.includes(r));
  }
  return false;
}

async function fetchNewContribs(pg, owner, repo) {
  let response = await octokit.pullRequests.getAll({
    owner: owner.toString(),
    repo: repo.toString(),
    state: 'all',
  });
  let { data } = response;

  let lastContribId = data[data.length - 1].id;

  while (
    octokit.hasNextPage(response) &&
    (await contributionExists(pg, lastContribId)).length === 0
  ) {
    response = await octokit.getNextPage(response);
    data = data.concat(response.data);
    lastContribId = data[data.length - 1].id;
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

      // find all new contributions
      const contribs = await fetchNewContribs(pg, owner, repo);

      for (const contrib of contribs) {
        if ((await contributionExists(pg, contrib.id)).length !== 0) {
          break;
        }
        if (await whitelistedContrib(pg, contrib, groups)) {
          // insert to database
          await addWhitelistedContrib(pg, contrib, proj.id);
        }
      }
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
  await run();
}
