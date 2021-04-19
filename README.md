# essem.js - Javascript ECS game engine

essem.js is a Javascript library that allows you to build games and animations in a
entity component system style manner.

essem.js is still very much a work in progress but it can render using WebGL fine right now.

## Setup

#### If using for the browser:

TODO: need to do first release first. cdn will use jsdeliver once have npm package

#### If using as a module:

Run `npm install essem` to install essem.js module. Then import essem.js (supports typescript):

```js
import * as ESSEM from "essem";
```


### Basic Example

Texture drawing example:

```js
const app = new ESSEM.Application();

app.registerSystem(ESSEM.CameraSystem, ESSEM.SpriteRendererSystem):
app.loader.add("fish.png");

document.appendChild(app.canvas.element);

app.eventManager.addListener(ESSEM.ApplicationInitEvent, () => {
    const scene = app.createScene();
    const entity = scene.createEntity();
    entity.addComponent(new TransformComponent());
    entity.addComponent(new SpriteRendererComponent(app.loader.resources["fish.png"]));

    const camera = scene.createEntity();
    entity.addComponent(new TransformComponent());
    entity.addComponent(new CameraComponent());
    entity.addTag("MainCamera");
});
```

## Documentation

There is documentation but it is not hosted anywhere yet. 
You can build the documentation by doing `yarn run docs` and viewing the `/docs/` directory.
TODO: Add github pages.

## Contributing

We're using yarn for this project so make sure it's installed with `npm install -g yarn` and use
yarn for every command.

First, run `yarn` to install the dependencies.

Then, to develop the library you should use `yarn run dev` which will setup a development server
and automatically compiles all the typescript files.

After you made some changes, you should use `yarn run lint:fix` to lint the code and run 
`yarn run build && yarn run test` to test the code.
This will be automatically ran with github actions on every push.

To build the documentation from jsdoc: `yarn run docs`

