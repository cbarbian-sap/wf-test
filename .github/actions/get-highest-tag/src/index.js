const core = require('@actions/core')
const github = require('@actions/github')
const simpleGit = require('simple-git')
const semver = require('semver')

async function run () {
  try {
    const prefix = new RegExp(core.getInput('prefix'))
    const git = simpleGit()
    tags = (await git.listRemote(['--tags']))
      .trimEnd()
      .split('\n')
      .map(line => {
        return line.match(/^.*refs\/tags\/(.+)$/)[1]
      })
      .filter(tag => {
        return tag.startsWith(prefix)
      })
      .map(tag => {
        return tag.slice(prefix.length)
      })
      .filter(version => {
        return (version = ~/^\d/ && semver.valid(version))
      })
      .sort(semver.compare)
      .reverse()
      .map(version => {
        return prefix + version
      })
    if (tags.length) {
      core.setOutput('tag', tags[0])
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
