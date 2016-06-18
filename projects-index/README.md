# Projects Index

Provides links to the distribution versions of all detected projects stored one level above this directory (`../`).

**Requires bash and \*nix commands to use the build script.**

## Quickstart

**Using the build script:**

- Clone this repository next to the projects you wish to provide links to.
```
  cd YOUR_PROJECTS_FOLDER/
  git clone https://github.com/Tempurturtul/projects-index.git
```
- Navigate to the project directory and change permissions on the bash build script to allow execution.
```
  cd projects-index/
  chmod 555 ./build-script
```
- **Make sure you're in the `projects-index/` directory. This is important.**
- **Make sure you read the `build-script` file. I make no guarantee that it won't set your device on fire.**
- Run the build script.
```
  # YOU READ IT, RIGHT?
  ./build-script
```
- Spin up a local server and view in your browser.
```
  # Just an example, do this however you like.
  cd src/
  python -m SimpleHTTPServer 3000 & sleep 2; firefox -new-tab localhost:3000
```

**Without the build script:**

- Clone this repository and navigate to it.
```
  git clone https://github.com/Tempurturtul/projects-index.git
  cd projects-index/
```
- Copy your projects' distribution files to `src/projects/YOUR_PROJECT/dist/`.
- Create a `src/scripts/projects.js` file with the following contents:
```js
var projects = ['YOUR_PROJECT', 'YOUR_OTHER_PROJECT', ...];
```
- Spin up a local server and view in your browser.
```
  # Just an example, do this however you like.
  cd src/
  python -m SimpleHTTPServer 3000 & sleep 2; firefox -new-tab localhost:3000
```
