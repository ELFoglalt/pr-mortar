# pr-mortar

> A mortar calculator for the Battlefield 2 modification Project Reality.

#### Build Setup

```bash
# install dependencies
$ npm install

# build robotjs*
$ ./node_modules/.bin/electron-rebuild.cmd

# serve with hot reload at localhost:9080
$ npm run dev

# build electron application for production
$ npm run build

# lint all JS/Vue component files in `src/`
$ npm run lint

```

### Build notes

#### Building robotjs

> Robotjs is no longer part of the project.
> This section remains here for futureproofing reasons.
> TODO: remove when in-game input methods are finalized.
>
> If robotjs is needed again:  
> `npm install --save robotjs && npm install --save-dev electron-rebuid`  
> Recover `electron_build_env.yml` from `956031026314e89281c9aed26716547bf6940b70`

The project requires a native build of robotjs, which is done using `electron-rebuild`. This requires python 2.7.0 and VS 2013 (MSBuild v12).

Setting up a python env using conda:

```bash
$ conda env create -f electron_build_env.yml

# run electron-rebuild ('winpty' and 'source' are required in bash only)
$ source activate electron_rebuild
$ winpty ./node_modules/.bin/electron-rebuild.cmd
$ source deactivate
```

#### Make sure the windows-build-tools are installed

```bash

# check if the package is available globally
$ npm list -g --depth 0

# install from an elevated command prompt
$ npm install -g windows-build-tools

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
