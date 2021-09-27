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

Sometimes we want to encapsulate some logic related to React and for that, we need to use hooks. As we've seen, services are a really good way of putting closely related logic together in a "easy to use package" ready to be consumed by the rest of the app. However, we cannot use React hooks or the react life-cycle in a regular service since those are instantiated during the startup of the app and hooks are required to always run unconditionally.

To solve this, there's a special type of service that we can declare by using the `@HookService()` decorator. Classes decorated with this decorator allow us to use all the React related decorators that we can use in a controller: `@state`, `@effect`, `@onDidMount`, etc.

For example, if we wanted to abstract all the logic about storing the counter value and modifying its value from the controller, we could do the following:

```ts
import { HookService } from '@tokmamakjs/react';

@HookService()
export class CounterHookService {
  @state private readonly _value = 0;

  get value() {
    return this._value;
  }

  public increase(): void {
    this._counter += 1;
  }

  public decrease(): void {
    this._counter -= 1;
  }
}
```

And then, use it like a regular provider in our controller:

```ts
import { Controller, state, effect } from '@tokamakjs/react';

import { CounterService } from '../../services';
import { CounterView } from './counter.view';

@Controller({ view: CounterView })
export class CounterController {
  get value() {
    return this._counter.value;
  }

  constructor(private readonly _counter: CounterHookService) {}

  public increase(): void {
    this._counter.increase();
  }

  public decrease(): void {
    this._counter.decrease();
  }
}
```

:::info
The main difference between classes decorated with `@Injectable()` and those decorated with `@HookService()` is that, by default, the later create ephemeral instances, meaning that the class instance will be discarded and re-created during a re-render.
:::

:::warning
Since classes decorated with `@HookService()` are ephemeral, it's not recommended to store data in regular class properties as that data will get lost with every re-render of the app.
:::


## Adding providers to the app

Adding providers to an app is a simple as adding them to the `providers` array in either a `@SubApp()` or a `@Module()`. This way, we tell the container that such provider exists and it's ready to be used in the context of that module or sub-app. If we want to expose the provider to be used by other contexts importing our module or sub-app, we have to also add it to the `exports` array.

```ts
import { SubApp, createRoute } from '@tokamakjs/react';

import { AUTH_TOKEN } from './constants';
import { CounterController } from './routes/counter';
import { CounterService, CounterHookService } from './services';

@SubApp({
  routing: [createRoute('/', CounterController)],
  providers: [CounterService, CounterHookService],
  exports: [CounterService], // only CounterService will be available when importing this sub-app
})
export class CounterModule {}
```

## Custom providers

There are other ways of defining providers apart from using the `@Injectable()` and `@HookService()` decorators. These are called custom providers and are an advanced way of using **TokamakJS** dependency injection container. For example, you might want to inject a different class if you're in a test environment, or a class needs some custom initialiation before being able to be used by **TokamakJS**, or you might even need to do some asynchronous operation during the provider initialization.

There are three types of custom providers currently supported: *value providers*, *class providers* and *factory providers*

### Value providers

Value provider are useful for injecting a constant value, using a custom instance of a class or just overriding the default value that would be injected by a regular provider.

Value providers are objects with the following shape:

```ts
interface ValueProvider {
  provide: Token;
  useValue: any;
}
```

Where `Token` is the injection token used by the container to know which value to inject and `useValue` can be any value that needs to be injected when using this provider. Anything can be used as a token as long as the same value is used when injecting the provider.

For example, if we wanted to inject a constant value, we could define our provider like so:

```ts
import { SubApp } from '@tokamakjs/react';

import { AUTH_TOKEN } from './constants';

@SubApp({
  providers: [
    // AUTH_TOKEN is just a regular const string that help us identify the provider
    { provide: AUTH_TOKEN, useValue: 'my-auth-token' }
  ]
})
export class AppModule {}
```

and then use it using the `@Inject()` decorator in the following way:

```ts
import { Controller, state, effect, Inject } from '@tokamakjs/react';

import { AUTH_TOKEN } from '../../constants';
import { CounterView } from './counter.view';

@Controller({ view: CounterView })
export class CounterController {
  constructor(@Inject(AUTH_TOKEN) private readonly _token: string) {}

  public logToken(): void {
    console.log(this._token); // prints "my-auth-token"
  }
}
```

Any kind of value can be injected this way, even other instances of classes. For example, let's imagine we wanted to manually take care of instantiating `CounterService` from above:

```ts
import { SubApp } from '@tokamakjs/react';

import { CounterService } from './services';

@SubApp({
  providers: [
    // We use the class itself as the token so it's without having to use `@Inject()`
    { provide: CounterService, useValue: new CounterService() }
  ]
})
export class AppModule {}
```

### Class providers

Class providers allow us to override the class that would otherwise be injected. For example, during tests, we might want to replace the real service that does the API calls for a mock one that fake those calls. An example of this would be:

```ts
import { SubApp } from '@tokamakjs/react';

import { CounterService, MockCounterService } from './services';

@SubApp({
  providers: [
    {
      provide: CounterService,
      useClass: process.env.NODE_ENV === 'test' ? MockCounterService : CounterService,
    },
  ],
})
export class AppModule {}
```

:::info
`@Injectable()` is just a convenient wrapper over using `{ provide: ClassName, useClass: ClassName }`
:::

### Factory providers

Factory providers allow us to create providers dynamically where the actual provider will be the value returned by the factory function. One benefit of this kind of provider is that it also permits using asynchronous functions. Important notice here, **TokamakJS** will wait for all the async providers to be resolved before first rendering your app.

For example, if in the token example above we would have needed to access the token value asynchronously:

```ts
import { SubApp } from '@tokamakjs/react';

import { AUTH_TOKEN } from './constants';
import { fetchAuthToken } from './utils';

@SubApp({
  providers: [
    {
      provide: AUTH_TOKEN,
      useFactory: async () => {
        const token = await fetchAuthToken();
        return token;
      },
    },
  ],
})
export class AppModule {}
```
