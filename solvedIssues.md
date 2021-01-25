## Unable to find Fluid modules

Ensure that `libraryTarget: "umd"` is added into the `output` configuration in `webpack.config.js`.

## You may need an additional loader to handle the result of these loaders.

[1] |     async hasInitialized() {
[1] |         // Store the text if we are loading the first time or loading from existing
[1] >         this.text = await this.root?.get(this.textKey)?.get();
[1] |     }
[1] | }

Changing the target to ES2018 fixes it. Otherwise optional chaining doesn't work properly with webpack.  https://stackoverflow.com/a/58836714