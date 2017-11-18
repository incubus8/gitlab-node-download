/**
 * Gitlab Project Repository Downloader
 * @author Rheza Satria
 * BTPN Jenius
 */

process.env.NODE_DEBUG='request';

const fs = require('fs');
const mkdirp = require('mkdirp');
const request = require('request');
const async = require('async');
const repoList = require('./repo.json');

const BASE_PATH = process.env.GITLAB_REPO_URL + '/api/v3/';
const PRIVATE_TOKEN = process.env.GITLAB_PRIVATE_TOKEN;
const EXTENSION = process.env.OUT_EXTENSION || 'tar';
const DOWNLOAD_CONCURRENCY = process.env.DOWNLOAD_CONCURRENCY || 1;

const DEST_DIR = process.env.DEST_DIR || 'download';
mkdirp.sync(DEST_DIR, function (err) {
  if (err) console.error(err)
  else console.log('new directory created!');
});

const URL = `${BASE_PATH}`;

console.log('Creating status file');

const gitlabRequest = request.defaults({
  baseUrl: BASE_PATH,
  qs: {
    private_token: PRIVATE_TOKEN,
  },
});

function workerDownloader(task, callback) {
  console.log('Begin downloading ' + task.name);
  gitlabRequest({
    url: `/projects/${task.id}/repository/archive.${EXTENSION}`
  })
  .on('error', (err) => {
    // Keep continuing if error persist, since we may also want to consume other data in queue
    console.log(err);
  })
  .on('response', () => {
    callback();
  })
  .pipe(fs.createWriteStream(`${DEST_DIR}/${task.name}.${EXTENSION}`));
}

gitlabRequest({
  url: '/projects',
  qs: {
    archived: false,
    per_page: 999,
    order_by: 'name',
    sort: 'asc'
  },
  json: true
}, (err, res, body) => {
  if (err) {
    throw err;
  }

  const q = async.queue(workerDownloader, Number(DOWNLOAD_CONCURRENCY));
  repoList.map((repo) => {
    const foundRepo = body.find((_repo) => repo.name === _repo.name);
    if (!foundRepo) {
      console.log(`Cannot find ${repo.name} in gitlab repository list`);
    }

    q.push(foundRepo, function(err) {
      console.log(`Finished processing ${foundRepo.name}`);
    });
  });
});
