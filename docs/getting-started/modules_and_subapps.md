---
sidebar_position: 4
---

# Modules and SubApps

A module in a **TokamakJS** app is a class decorated with eiter `@Module` or `@SubApp`. The only difference between a module and a sub-app is that the former contains only business logic while the later also has routing. Since modules and sub-apps are so similar, this document applies to both of them interchangeably.

```ts
import { Module, SubApp } from '@tokamakjs/react';

@Module({})
export class FooModule {}

@SubApp({ routing: [] })
export class BarModule {}
```

At least one sub-app is required in every **TokamakJS** app. This module will be the one used as the entry point for when creating the app with `TokamakApp.create(AppModule)`. It's not required to have multiple modules or sub-apps in your application. In fact this might make even more sense if the application is small. However, as the application grows, you'll probably end up dividing it in several modules and sub-apps.

:::tip
If you're using the [Tokamak CLI](https://github.com/tokamakjs/tokamak-cli), you can create a module with `tok g m <moduleName>` or a sub-app with `tok g sa <subAppName>`.
:::

## Imports and Exports


## Dynamic Modules
