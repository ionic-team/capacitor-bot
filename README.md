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

### Tasks

- `remove-label`: Remove a label from an issue
    - `label` _(string)_: the label to remove
    - `exclude-labeler` _(string)_: if `true`, the label won't be removed if the event actor is the user that added the label
- `add-platform-labels`: Parse issue bodies and add labels to issues that have keywords under a `Platform` header
- `add-contributors`: Open a PR to modify `README.md` when a new contributor appears in a base branch
    - `base`: the base branch
    - `file`: the file to edit (usually `README.md`)
    - `commitMsg`: the [lodash template](https://lodash.com/docs#template) for the commit message; properties: `base`, `file`
