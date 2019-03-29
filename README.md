# Draft theme template

## Get started

- `yarn install`
- `yarn dev` — a watching mode for development
- `yarn build` — a building not watching mode for production
- `yarn explore` — an interactive mode with a map of bundles for analyzing
- `yarn lint:js` — check `js` files by eslint
- `yarn lint:scss` — check `scss` files by stylelint
- `yarn format` — format `js` and `scss` files

## How to organize components? Essentials.

`app.scss` — base entry point, a place where general styles are included.
I mean styles which are fair for the whole app. That is the default entry point.
❗️Do not rename this file to keep the same base entry point per project ( and it will
cause an error). Accordingly we have default corresponding Drupal library `app-styles`
which is defined in the `draft_starter.libraries.yml` and applied in the `draft_starter.info.yml`.

`src/components` — the place where every component should live in a separate folder.
The components folder could consist of

- **js less component example**
  `component-a.scss` file will be the entry point for Webpack

        ├── src
          ├── components
            ├── component-a
              ├── component-a.scss
              ├── component-a.html.twig

- **js component example**
  `component-a.js` file will be the entry point and `_component-a.scss` would be imported inside.

  ```javascript
  // component-a.js

  import './_component-a.scss';
  ```

      ├── src
        ├── components
          ├── component-a
            ├── component-a.js
            ├── _component-a.scss
            ├── component-a.html.twig

- **⛔️ DON'T DO EXAMPLE. Don't make two entry points for one component**

      ├── src
        ├── components
          ├── component-a
            ├── component-a.js
            ├── component-a.scss
            ├── component-a.html.twig

## Build

`build/components` — the folder where transpiled results of components are living.
Every component placed there in a separate folder.

`build/app.css` — placed in the root of `build` folder.

`build/vendors/` — folder for vendors. Webpack set up in a way to make own
vendor file in a case we have a separate vendor for the component. For example, we have
`slider.js` where we make import of `forEach nodeList polyfil`. In a case only `slider.js` component
uses `forEach nodeList polyfil`, you would find `externals-slick.js` file in a `build/vendors/` folder.
Then we could make a cute and tiny `Drupal library`. Otherwise, if a few components import `forEach nodeList polyfil`, you should find in the vendor folder `externals.js`. That means you have to make separate library `externals` and put it as a dependency for your both components. See examples, bellow.

**We could have three types of vendors**

- _externals_ goes from `src/externals`
- _shared_ small self-writting helpers, goes from `src/shared`
- _commons_ goes from `node_modules`

So, for all of them behavior described above and examples provided bellow is fair.

```yaml
# the only one component imports forEach nodeList polyfil
slider:
  version: 1.0
  js:
    build/vendors/externals-slider.js: {}
    build/components/slider/slider.js: {}
```

```yaml
# a few components import forEach nodeList polyfil
slider:
  version: 1.0
  js:
    build/components/slider/slider.js: {}
  dependencies:
    - draft_starter/externals

accordion:
  version: 1.0
  js:
    build/components/accordion/accordion.js: {}
  dependencies:
    - draft_starter/externals

externals:
  version: 1.0
  js:
    build/vendors/externals.js: {}
```

## General tips

- **Make general variables and mixins are available in the component scss file**

  ```scss
  @import '../../init';
  ```

- **Where to put static assets**

  `images` — that's the folder for static images
  `fonts` — that's the folder for fonts

      ├── fonts
        ├── icomoon
        ├── comic-sans

- **Bring to scss component file static image**. `$base-path` general variable
  could help you to avoid a bit ugly paths like this `../../images/joshua-coleman-671580-unsplash.png`

  ```scss
  @import '../../init';

  .hero {
    background-image: url(#{$base-path}/images/joshua-coleman-671580-unsplash.png);
  }
  ```

## Foundation tips

- Foundation used as a base framework, 4 general components inclued in app.scss
  via \_foundation-general.scss partition by default

  ```scss
  // _foundation-general.scss

  // Global styles
  @include foundation-global-styles;
  @include foundation-forms;
  @include foundation-typography;
  @include foundation-table;
  ```

  \_foundation-general.scss file contains commented references to all kind
  of Foundation components

- Foundation variables could be customized in `src/settings/_settings.scss` file
- Foundation scss component example

  ```scss
  // src/components/button/button.scss

  @import '../../init';
  @include foundation-button;
  ...
  ```

- Foundation js component example

  ```js
  // src/components/tabs/tabs.js

  import $ from 'jquery';
  import { Foundation } from 'foundation-sites/dist/js/plugins/foundation.core';
  import 'foundation-sites/dist/js/plugins/foundation.tabs';
  import 'foundation-sites/dist/js/plugins/foundation.util.keyboard';
  import 'foundation-sites/dist/js/plugins/foundation.util.imageLoader';
  import './_tabs.scss';

  ...
  const foundationTabs = new Foundation.Tabs($tabs, {});
  ...
  ```

## Naming folder and files and variables convention

- Folders, files, variables should be named in a kebab-case-started-with-small-letter

  ```scss
  // _variables.scss

  $primary-color: #c00;
  ```

- Partitions should start with an underscore `_i-am-a-partition.scss`.

❗️EXCEPTION, if you have a js component which is a `Class` — component js file should
start with capital letter. For example, `Slider-testimonials.js`.
