# Draft theme template

## Get started

- `yarn dev` — watching mode for development (don't forget about `yarn install` before all)
- `yarn build` — one-time transpiling building mode for production
- `yarn explore` — mode with an interactive map of bundles for analyzing sizes etc.
- `yarn lint:js` — check `js` files by eslint
- `yarn lint:scss` — check `scss` files by stylelint
- `format` — format `js` and `scss` files

## How to organize components?

**Before started you should be aware of some essentials.**

`app.scss` — base entry point, a place where generall styles are included.
I mean styles which are fair for the whole app. That is the default entry point.
Do not rename this file to keep the same base entry point per projects and it will
cause an error. And we have default corresponding Drupal library `app-styles`
which defined in `draft_starter.libraries.yml` and applied in `draft_starter.info.yml`

`src/components` — the place where every component should live in a separate folder.
The component folder could consist of

- _js less component example_.
  `component-a.scss` file will be the entry point for Webpack

        ├── src
          ├── components
            ├── component-a
              ├── component-a.scss
              ├── component-a.html.twig

- _js component example_.
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

- ⛔️ DON'T DO EXAMPLE. Don't make two entry points for one component

      ├── src
        ├── components
          ├── component-a
            ├── component-a.js
            ├── component-a.scss
            ├── component-a.html.twig

`build/` — folder where results of components are living. Every component placed
in a separate folder.

`build/app.css` — placed in the root of `build` folder.

`build/vendors/` — folder for vendors. Webpack set up in a way to make own
vendor file in a case we have a separate vendor for the component. For example, we have
`slider.js` where we make import of `slick-carousel`. I a case only `slider.js` component
uses `slick-carousel` vendor, you would find `vendors-slick.js` file in a `build/vendors/` folder.
Then could make a cute and tiny `Drupal library`

```yaml
slider:
  version: 1.0
  js:
    build/vendors~slider.js: {}
    build/fullpage/slider.js: {}
```

**Make available in the component scss file general variables and mixins**

```scss
@import '../../_init.scss';
```

**Assets**
`images` — that's the folder for static images
`fonts` — that's the folder for fonts

      ├── fonts
        ├── icomoon
        ├── comic-sans

**Bring to scss component file static image**. `$base-path` general variable
could help you to avoid a bit ugly paths like this `../../images/joshua-coleman-671580-unsplash.png`

```scss
@import '../../_init.scss';

.hero {
  background-image: url(#{$base-path}/images/joshua-coleman-671580-unsplash.png);
}
```

**Naming folder and files and variables convention**

- **SCSS** component folders, files, variables should be named in a `kebab-case-started-with-small-letter`

```scss
// _variables.scss

$primary-color: #c00;
```
- Partitions should start with an underscore `_i-am-a-partition.scss`.
- **JS** component folders should be named in a `camelCaseStartedWithSmallLetter`

EXCEPTION, if you have a js component which is a `Class` — component js file should
start with a capital letter. For example, `SliderTestimonials.js`.
