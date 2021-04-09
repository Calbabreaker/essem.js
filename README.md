# essem.js - Javascript ECS game engine

essem.js is a Javascript library that allows you to build games and animations in a
entity component system style manner.

essem.js is still very much a work in progress but it can render using WebGL fine right now.

## Setup

TODO: need to do first release first. cdn will use jsdeliver once have npm package

### Basic Example

Texture drawing example: (this is WIP)

```js
const app = new ESSEM.Application();

app.registerSystem(ESSEM.CameraSystem, ESSEM.SpriteRendererSystem):
app.loader.add("fish.png");

document.appendChild(app.canvas.element);

app.events.addListener(ESSEM.ApplicationInitEvent, () => {
    const scene = app.createScene();
    const entity = scene.createEntity();
    entity.addComponent(new TransformComponent());
    entity.addComponent(new SpriteRendererComponent(app.loader.resources["fish.png"]));

    const camera = scene.createEntity();
    entity.addComponent(new TransformComponent());
    entity.addComponent(new CameraComponent());
    CameraSystem.mainCamera = camera;
});
```

### Documentation

There is documentation but it is not hosted anywhere yet. 
You can build the documentation by doing `npm run docs` and viewing the `/docs/` directory.

## Contributing

To develop the library you should use `npm run dev` which will setup a development server
and automatically compiles all the typescript files.

After you made some changes, you should lint the code by doing `npm run lint:fix` and run
the test by doing (COMING SOON) `npm run test`.

You can also compile everything by doing: `npm run build`

To build the documentation from jsdoc: `npm run docs`

