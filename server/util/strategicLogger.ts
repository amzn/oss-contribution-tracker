#!/usr/bin/env node

const pgPromise = require('pg-promise');
const octokit = require('@octokit/rest')();

function sleep() {
  /* Use random sleep time (3-7 seconds) to avoid stampeding the API */
  return new Promise(resolve =>
    setTimeout(resolve, Math.floor(Math.random() * 4000 + 3000))
  );
}

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
    try {
      response = await octokit.issues.listForRepo({
        owner: owner.toString(),
        repo: repo.toString(),
        state: 'all',
        since: date.toString(),
      });
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.warn(e);
    }
  } else {
    try {
      response = await octokit.issues.listForRepo({
        owner: owner.toString(),
        repo: repo.toString(),
        state: 'all',
      });
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.warn(e);
    }
  }
  let { data } = response;
  await sleep();

  while (octokit.hasNextPage(response)) {
    try {
      response = await octokit.getNextPage(response);
      data = data.concat(response.data);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.warn(e);
    }
    await sleep();
  }

  return await data;
}

async function updateStrategicContribs(pg) {
  // add column to this table if it is an org or repo
  const projects = await getAllStrategicProjects(pg);
  projects.forEach(async proj => {
    const project = await searchProjectById(pg, proj.id);
    const url = project.project_url;
    if (url && url.match(/github/i)) {
      const urlTokens = url.split('/');
      const last = urlTokens.length - 1;
      let repo;
      let owner;

      if (project.project_is_org) {
        // project is an org so we want to check all public repos
        // only run once a day
        const lastRun = await getLastScrapeDate(pg, proj.id);
        const date = new Date(lastRun.last_scrape_date);
        const currDate = new Date();
        if (
          date &&
          date.getFullYear() <= currDate.getFullYear() &&
          date.getMonth() <= currDate.getMonth() &&
          date.getDate() < currDate.getDate()
        ) {
          // get all repos in org
          let response = await octokit.repos.listForOrg({
            org: project.project_name,
            per_page: 100,
            type: 'public',
          });
          let { data } = response;
          while (octokit.hasNextPage(response)) {
            response = await octokit.getNextPage(response);
            data = data.concat(response.data);
            await sleep();
          }
          for (const repoInfo of data) {
            await updateDatabase(
              pg,
              project.project_id,
              project.project_name,
              repoInfo.name
            );
          }
        }
      } else if (!project.project_is_org) {
        // project is a single repo
        owner = urlTokens[last - 1];
        repo = urlTokens[last];
        await updateDatabase(pg, proj.id, owner, repo);
      }
      // update last scraper datetime
      await updateLastScrapeDate(pg, proj.id);
    } else {
      // tslint:disable-next-line:no-console
      console.warn(
        `Project ${project.project_name} is not on GitHub and not updated here.`
      );
    }
  });
}

async function updateDatabase(
  pg,
  projectID: number,
  owner: string,
  repo: string
) {
  // groups this project belongs to
  const groups = (await searchGroupsByProjectId(pg, projectID)).groups;

  let date = await getLastScrapeDate(pg, projectID);
  if (date) {
    date = date.last_scrape_date;
  }

  // below should be pulled into its own function
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
      await addWhitelistedContrib(pg, issue, projectID);
    }
  }
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
