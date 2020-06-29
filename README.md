# Bot

The bot for Ionic and Capacitor repos, implemented using GitHub Actions.

## Config

There are two steps to setting up the configuration for this bot.

#### Workflow File

Add a GitHub Actions workflow file for the bot (usually `.github/workflows/bot.yml`).

```yml
name: Bot

on:
  push:
  issues:
    types: [opened, edited]
  issue_comment:
    types: [created]

jobs:
  bot:
    name: ${{ github.event_name }}/${{ github.event.action }}
    runs-on: ubuntu-latest
    steps:
      - uses: ionic-team/bot@main
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

#### Config File

Though this bot is one GitHub Action, it does many things. Because of this, a separate configuration file is needed specifically for the bot (`.github/bot.yml`):

```yml
tasks:
  - name: remove-label
    on:
      issue_comment:
        types: [created]
    config:
      label: needs-reply
      exclude-labeler: true
```

The `tasks` key is an array of tasks, the event that triggers them, and their configuration. Notice how the `on` block is copied from the workflow file to specify exactly which events triggers which tasks.

##### Tasks

- `add-comment`: Add a comment to an issue
  - `comment` _(string)_: the comment text
- `add-label`: Add a label to an issue
  - `label` _(string)_: the label to add
- `remove-label`: Remove a label from an issue
  - `label` _(string)_: the label to remove
  - `exclude-labeler` _(boolean)_: if `true`, the label won't be removed if the event actor is the user that added the label
- `add-platform-labels`: Parse issue bodies and add labels to issues that have keywords under a `Platform` header
- `add-contributors`: Open a PR to modify `README.md` when a new contributor appears in a base branch
  - `base` _(string)_: the base branch
  - `file` _(string)_: the file to edit (usually `README.md`)
  - `commitMsg` _(string)_: the [lodash template](https://lodash.com/docs#template) for the commit message; properties: `base`, `file`
- `comment-on-label`: Make a comment when a label is added, optionally closing and/or locking the issue
  - `labels` _(array)_:
    - `name` _(string)_: the name of the label
    - `comment` _(string)_: the comment text. if `undefined`, the comment is not added
    - `close` _(boolean)_: if `true`, close the issue
    - `lock` _(boolean)_: if `true`, lock the issue
