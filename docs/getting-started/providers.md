---
sidebar_position: 3
---

# Providers

**Providers** are the fundamental building block in **TokamakJS**. You can think of a provider as a self contained piece of business logic that can be used by other parts of the application in a clear and declarative way. Providers come in all sort of different shapes, anything that is not a **controller** or a **view** is gonna be a **provider** in one way or another. However, most of the time a provider is just a class annotated with either `@Injectable()` or `@HookService()`.

The main idea behind a provider is that they can be injected as dependencies into other components of the application leaving all the class instantiation and wiring to the **TokamakJS** runtime. This is achieved using a technique called [dependency injection](https://wiki2.org/en/Dependency_injection).

## Injectables

The simplest way of creating a provider is decorating a plain class with the `@Injectable()` decorator. This marks the class as ready to be injected as dependency into other providers or controllers.

Services and API classes are good candidates to be injected this way since they should not interact with React logic and usually are instantiated once when starting up the application and then, re-used.

```ts
import { Injectable } from '@tokamakjs/react';

@Injectable()
export class CounterApi {
  public async saveValue(value: number): Promise<void> {
    // implementation...
  }
}
```

```ts
import { Injectable } from '@tokamakjs/react';

import { CounterApi } from '../api';

@Injectable()
export class CounterService {
  // CounterApi will be injected automatically
  constructor(private readonly _api: CounterApi) {}

  public async saveValue(value: number): Promise<void> {
    // implementation...
  }
}
```

By default, classes decorated with `@Injectable()` are instantiated as [singletons](https://wiki2.org/en/Singleton_pattern). It's possible however to change this behavior by setting a different `scope` when decorating the class. E.g.

```ts
import { Injectable, Scope } from '@tokamakjs/react';

@Injectable({ scope: Scope.TRANSIENT })
export class CounterApi {
  public async saveValue(value: number): Promise<void> {
    // implementation...
  }
}
```

There are two possible values for `scope`:

 - `Scope.TRANSIENT`: A new instance will be created every time the provider is injected as a dependency.
 - `Scope.SINGLETON` *(default)*: An instance will be created at startup and re-used every time the provider is injected as a dependency.

:::tip
If you used the [CLI](https://github.com/tokamakjs/cli) to bootstrap your project, you can easily create an API class using `npx tok generate api [ClassName]`. In the same way, you can create services as well using `npx tok generate service [ClassName]`.
:::

To be able to use the created providers in the application, don't forget to add them to the `providers` array in either `@Module()` or `@SubApp()`.

```ts
import { SubApp } from '@tokmamakjs/react';

import { CounterController } from './routes/counter';
import { CounterApi } from './api';
import { CounterService } from './services';

@SubApp({
  routing: [createRoute('/', CounterController)],
  providers: [CounterApi, CounterService],
})
export class AppModule {}
```

After the providers have been added to the `@SubClass()` we can use them in our controllers (or in others providers as shown above) simply by declaring them as dependencies in the `constructor()`:

```ts
import { Controller, state, effect } from '@tokamakjs/react';

import { CounterService } from '../../services';
import { CounterView } from './counter.view';

@Controller({ view: CounterView })
export class CounterController {
  @state private readonly _value = 0;

  get value() {
    return this._value;
  }

  // CounterService is injected automatically
  constructor(private readonly _counterService: CounterService) {}

  // Track and save value every time it changes)
  @effect((self: CounterController) => [self.value]))
  protected async saveValue(): Promise<void> {
    // We can use the injected provider like any other property
    await this._counterService.saveValue(this._value);
  }

  public increase(): void {
    this._value += 1;
  }
}
```

## Hook services

## Custom providers

## Adding providers to the app