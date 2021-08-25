---
sidebar_position: 1
---

# Project

**TokamakJS** applications can be developped following two different styles depending on the complexity of the application you're developing. For example, if you're building a small app you might choose to follow a **monolitic approach with just a single sub-app** or, for more complex applications or applications that can be easily subdividded, you might choose a **fractal approach instead where you have the application divided in multiple sub-apps**, each of them well scoped and defined.

Important to not that a specific folder structure is not enforced. It is recommended howerver in any case to follow the style used in this guide as this will allow you to also benefit from the different generators available through the [CLI](https://github.com/tokamakjs/tokamak-cli).

## First Steps

The esiest way to get started with **TokamakJS** is using the [CLI](https://github.com/tokamakjs/tokamak-cli) to create a new project using and running the following commands:

```bash
tok new project-name
```

This will create a basic app skeleton together with a bunch of other required files.

*FILE_TREE*

The entry point of our application is the `index.ts` file inside the `src` directory:

```ts
import { TokamakApp } from '@tokamakjs/react';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await TokamakApp.create(AppModule);
  app.render('#root');
}

bootstrap();
```

In this file we have a basic `bootstrap` function that we use to create a new **TokamakJS** instance using the main module of our application. After that, we just render the newly created app. We can also use this function to perform any pre-initialization steps we might need before running the app.

## Running the Application

To verify that everything worked correctly during the instalation and initialization step, you can run the newly created app using:

```bash
npm start
```

This command will start the development server and, after the compilation step finishes, show some information about the app and how can we access it. If everything worked according to plan, if you navigate to the url shown in the terminal where the command above was run, you should see a basic counter app.