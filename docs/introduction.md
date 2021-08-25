---
sidebar_position: 1
---

# Introduction

**TokamakJS** is a TypeScript framework for building web applications using [React](https://) as its view layer. It provides a clear fractal architecture that promotes good development practices and separation of concerns. It's 100% compatible with the React ecosystem so you can use all the tools and libraries you're already familiar with.

Since **TokamakJS** is semi-opinionated, some basic decisions have been made, however, nothing is set in stone and multiple parts of the framework can be customized to fit your needs. For example, you can use your favorite CSS-in-JS library, your favorite state management solution (custom, Redux, MobX...) and many more things.

## Installation

The easiest way to get started with **TokamakJS** is using the official [Tokamak CLI](https://github.com/tokamakjs/tokamak-cli) to scaffold your project.

To do so, first install the CLI using `npm` or `yarn` or any other node package manager of your choice (we're gonna be using `npm` in this guide as an example):

```bash
npm i -g @tokamakjs/cli
```

And right after that, run the following command to initialize a new **TokamakJS** project:

```bash
tok new project-name
```

You can also explore all the other available options in the CLI by running:

```bash
tok --help
```

:::tip
You are not required to use the CLI if you don't want to do so. In that case, you can simply install the required npm packages and add them to your project. Of course in that case, you'll have to manually create the required files and provide a build config of your own.
:::

## How can you help?

**TokamakJS** is an open source project and you're very welcome to help! You can do so by reporting issues, providing feedback, submitting PRs or just by requesting new features in the [Github repository of the project](https://github.com/tokamakjs/tokamakjs).