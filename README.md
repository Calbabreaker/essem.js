# essem.js - Javascript ECS game engine

essem.js is a Javascript library that allows you to build games and animations in a
entity component system style manner.

essem.js is still very much a work in progress but it can render using WebGL fine right now.

## Setup

#### If using for the browser:

Add a script tag to the header (you can swap 0.0.0 for any version):

```html
<head>
    <script src="https://cdn.jsdelivr.net/npm/essem.js@0.0.0/build/essem.js"></script>
</head>
```

#### If using as a module:

Run `npm install essem.js` to install essem.js module. Then import essem.js (supports typescript):

```js
import * as ESSEM from "essem.js";
```

### Basic Example

Texture drawing example:

```js
const app = new ESSEM.Application();

app.registerSystem(ESSEM.CameraSystem, ESSEM.SpriteRendererSystem):
app.loader.add(ESSEM.Texture, "fish.png");

document.body.appendChild(app.canvas.element);

app.eventManager.addListener(ESSEM.ApplicationInitEvent, () => {
    const scene = app.createScene();
    const entity = scene.createEntity();
    entity.addComponent(new ESSEM.TransformComponent());
    entity.addComponent(new ESSEM.SpriteComponent(app.loader.resources["fish.png"]));

    const camera = scene.createEntity();
    camera.addComponent(new ESSEM.TransformComponent());
    camera.addComponent(new ESSEM.CameraComponent());
    camera.addTag("MainCamera");
});
```

## Documentation

The documentation is [here](https://calbabreaker.github.io/essem.js/docs/).
You can also build the documentation from the sources by doing `pnpm run docs`
and then viewing the
`docs/` directory.

## Contributing

We're using pnpm for this project so make sure it's installed through your
package manager and use pnpm for every command.

First, run `pnpm` to install the dependencies.

Then, to develop the library you should use `pnpm run dev` which will setup a development server
and automatically compiles all the typescript files.

After you made some changes, you should use `pnpm run lint:fix` to lint the code and run
`pnpm run build && pnpm run test` to test the code.
This will also be automatically ran with github actions on every push.

To build the documentation from jsdoc: `pnpm run docs`
