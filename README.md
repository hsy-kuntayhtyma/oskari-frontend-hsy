# Oskari frontend HSY

Bundles & application configuration for https://kartta.hsy.fi

## Setup

The application build process assumes that this repository, the main [oskari-frontend](https://github.com/oskariorg/oskari-frontend) repository, and [oskari-frontend-contrib](https://github.com/oskariorg/oskari-frontend-contrib) are located side by side on your filesystem. Running `npm install` will create symlinks to these directories under node_modules.

In this model, it's left to the developer to checkout the correct branches/versions of the above repos.

## Managing dependencies

With the symlinks in place import-statements and other path references to `oskari-frontend` and `oskari-frontend-contrib` will resolve to the appropriate directories. This means you can reference bundles in `oskari-frontend` repo with eg. `"bundlePath": "oskari-frontend/packages/statistics/"` in your minifierAppSetup.json. The same principle works in bundle.js for defining bundle dependencies.

### Libraries

Before adding a library dependency (either under `libraries/` or via NPM), you should check if the library is already included in `oskari-frontend` repo. If it is, you can reference it in your bundle.js with eg. `oskari-frontend/libraries/geostats/1.5.0/lib/geostats.min.js`. NPM package dependencies defined in `oskari-frontend` repo can be imported directly in code found in this repo eg. Open Layers `import olMap from 'ol/Map';`. Note: this is not how node module resolution usually works; it's a special feature of the Oskari build system aimed to avoid library code duplication & version conflicts. To see which packages can be used in this way, see `dependencies` in [oskari-frontend package.json](https://github.com/oskariorg/oskari-frontend/blob/master/package.json).

If the library isn't included in `oskari-frontend` repo, you can add it into this repo, either as dependency in package.json (preferred) or under `libraries/`. Dependencies under `libraries/` require a reference in bundle.js, NPM dependencies do not; just `import` in your code.

## Run in development

Webpack dev server is used to serve the JS bundle and assets when running in local development. XHR calls will be proxied to the Java backend assumed to be running on localhost:8080.

So that the server knows to look for the JS bundle and assets from the right place, we need to have the client version configured in the Oskari-server `oskari-ext.properties`:

```
oskari.client.version=dist/devapp
```

To start Webpack dev server run `npm start`. The start script in oskari-frontend package.json defaults to the sample application directory but this can be parameterized for custom apps.

When you see "Compiled successfully." in the terminal, you can open the app in the browser at `localhost:8081`.

The dev server has automatic reloading enabled when you save changes to JS code and hot reloading for S/CSS without need for full browser reload.

## Building HSY production

 Check out the right branches in the above repos and make sure you have run `npm install` in all three (this one included). Then you can build the app with `npm run build -- --env.appdef=1.00:applications/hsy`. The output will be under `dist/`. See the main [oskari-frontend repo](https://github.com/oskariorg/oskari-frontend#readme) for detailed instructions about the build parameters.

 ## Development server

 Run `npm start` for development server with auto reload for JS and hot reload for SCSS.