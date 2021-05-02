# 🕷 Anansi

> Production ready, developer friendly. Opinionated yet extensible.

[Anansi](https://en.wikipedia.org/wiki/Anansi) (/əˈnɑːnsi/ ə-NAHN-see) is an Akan folktale character. He often takes the shape of a spider and is considered to be the god of all knowledge of stories. Anansi uses his knowledge to help JavaScript developers spin new web projects.

## Motivation

Starting a new React project can be a lot of work. There are many tools that need to work together. The best tools available keep a tight technical focus with high levels of configurability. In practice this means it's a lot of work to get started and even more work to maintain, while keeping the tools cleanly working together.

Like Ubuntu did for Linux; Anansi focuses on bringing together many powerful tools in unison to build high performance web applications, quickly - while not losing the power and flexibility each individual tool provides.

- Start a project in a minute
- Modular and Incremental
- Modern
  - Stay up with the latest best in class tooling by a simple package upgrade
- Batteries included
- DRY configurations
- Battle-tested

## Installation

First, install [Yeoman](http://yeoman.io) and @anansi/generator-js using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/); if not [nvm](https://github.com/nvm-sh/nvm) is a great way to do so).

```bash
npm install -g yo @anansi/generator-js
```

Then generate your new project:

```bash
anansi hatch my-app-name
```

This creates a `my-app-name` directory in your current directory and sets up the project there.

## Updates

Features can be incrementally adopted by running sub-generators from an existing project directory.

### E.g., Adding Testing

```shell
cd MyProject
anansi add testing
```
