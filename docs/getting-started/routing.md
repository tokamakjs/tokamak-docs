---
sidebar_position: 2
---

# Routing and Routes

A route in **TokamakJS** is comprised of a **view** and a **controller**. Each view in **TokamakJS** is 1:1 mapped to a controller meaning that each controller can only be used in their corresponding view and viceversa.

Finally, each route will have an associated path that will map the controller to the corresponding browser url.


## Views

Views are just regular React components that have a specific controller associated to them. Together with this controller, they compose a route in **TokamakJS**.

// TODO

## Controllers

Controllers are the main link between the view layer and the rest of the application. For that, they sit in a blurry line between what is considered application/business logic and what is considered view logic.

They take care of providing their views with the required data, perform any required initialization steps and react to events triggered by the view. Everything that is not strictly view logic, goes in a controller.

To create a controller, decorate a class with the `@Controller` decorator. E.g.

```ts
import { Controller } from '@tokamakjs/react';

import { CounterView } from './counter.view';

@Controller({ view: CounterView })
class CounterController {}
```

## Using data

You can store and manipulate data inside controllers by using the `@state` decorator.

```ts
import { Controller, state } from '@tokamakjs/react';

import { CounterView } from './counter.view';

@Controller({ view: CounterView })
class CounterController {
  @state private _counter = 0;

  public increase(): void {
    this._counter += 1;
  }

  public decrease(): void {
    this._counter -= 1;
  }
}
```

Any change to a property decorated this way will trigger a re-render of the associated view. It's very similar to the `useState()` hook in React.

:::caution
You should treat the data stored using `@state` as immutable. **TokamakJS** will only react to new assignments to properties tracked this way and any change made to the stored data itself (for example, mutating an object's property) will not trigger a re-render of the view.
:::

Additionally, in case you want to store data between re-renders but don't want to re-render the view every time the data is modified, a `@ref` decorator similar to the `useRef()` hook from React is provided. E.g.

```ts
import { Controller, ref } from '@tokamakjs/react';

import { CounterView } from './counter.view';

@Controller({ view: CounterView })
class CounterController {
  @ref private _counter = 0;

  public increase(): void {
    // this will not trigger a re-render as the property is decorated with @ref
    this._counter += 1;
  }
}
```

:::caution
Any property not decorated with either `@state` or `@ref` will have their values re-initialized every time the view re-renders.
:::

## Reacting to the life-cycle

### Mount and unmount step
In case certain methods need to run when first mounting the view, an `onDidMount()` decorator is available. This decorator, very similar to the `useEffect()` hook from React when using an empty array as dependencies, will make any decorated method run when the view is rendered for the first time.

Similarly to the mentioned `useEffect()` hook, methods decorated with `onDidMount()` can return a callback function that will run when the component is unmounted.

```ts
import { Controller, onDidMount } from '@tokamakjs/react';

import { CounterView } from './counter.view';

@Controller({ view: CounterView })
class CounterController {

  @onDidMount()
  protected didMount(): void {
    // this will run when the view is rendered for the first time
  }

  @onDidMount()
  protected anotherDidMount(): Function {
    // this will also run when the view is rendered for the first time

    return () => {
      // this runs when the component is going to be unmounted
    };
  }

}
```

### Render step

Very similar to `onDidMount()` we have the `onDidRender()` decorator to run a method every time the view is re-rendered. This decorator also supports returning a void function to be run before the view is re-rendered.

```ts
import { Controller, onDidRender } from '@tokamakjs/react';

import { CounterView } from './counter.view';

@Controller({ view: CounterView })
class CounterController {

  @onDidRender()
  protected didMount(): void {
    // this will run every time the view is re-rendered
  }

  @onDidRender()
  protected anotherDidMount(): Function {
    // this will also run every time the view is re-rendered

    return () => {
      // this will run every time before the view is re-rendered
    };
  }

}
```

The `onDidRender()` decorator can be compared to using the `useEffect()` hook without providing an array of dependencies.

:::caution
An execution order is not guaranteed when having multiple methods decorated with the life-cycle decorators so don't make any assumptions based on it.
:::

## Tracking Property Values

It's possible to track changes to properties using the `@effect()` decorator.

// TODO

```ts
import { Controller, effect } from '@tokamakjs/react';

import { CounterView } from './counter.view';

@Controller({ view: CounterView })
class CounterController {
  @state private _trackedCounter = 0;
  @state private _counter = 0;

  @effect((self: CounterController) => [self._trackedCounter])
  protected reactToTrackedCounter(): void {
    // this will run every time _trackedCounter changes. However, any
    // changes to _counter will not have any effects.
  }
}
```

## Using Routes

// TODO

Add them to `routing` in subapps and use `createRoute`