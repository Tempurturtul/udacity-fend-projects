# Projects Index

Provides an index site for all projects stored one level above this directory (`../`).

## Requirements

- The `src/scripts/main.js` file must be edited so the `sourcePath` variable on line 5 matches the path to the source code for your projects. This path must be fundamentally the same for all projects, minus the project name.
  - Example:
  ```js
    var sourcePath = 'https://github.com/Tempurturtul/{{project-name}}';
  ```

**Additional build script specific requirements:**

- Bash and \*nix commands (only tested on Ubuntu).
- All directories in `../` must be projects with a directory name equal to the source code repository name for the project.
- All projects with a live version must have a `src/` subdirectory at depth 1 and a `dist/` subdirectory at depth 1 containing all distribution files.

## Quickstart

**Using the build script:**

1. Clone this repository next to the projects you wish to provide links to.
```
  cd YOUR_PROJECTS_FOLDER/
  git clone https://github.com/Tempurturtul/projects-index.git
```
1. Edit the `src/scripts/main.js` file as described in the requirements section.
1. Navigate to the project directory and change permissions on the bash build script to allow execution.
```
  cd projects-index/
  chmod 555 ./build-script
```
1. **Make sure you're in the `projects-index/` directory. This is important.**
1. **Make sure you read the `build-script` file. I make no guarantee that it won't set your device on fire.**
1. Run the build script.
```
  # YOU READ IT, RIGHT?
  ./build-script
```
1. Spin up a local server and view in your browser.
```
  # Just an example, do this however you like.
  cd src/
  python -m SimpleHTTPServer 3000 && firefox -new-tab localhost:3000
```

**Without the build script:**

1. Clone this repository.
```
  git clone https://github.com/Tempurturtul/projects-index.git
```
1. Edit the `src/scripts/main.js` file as described in the requirements section.
1. Copy your projects' distribution files to `src/projects/YOUR_PROJECT/`.
1. Create a `src/scripts/projects.js` file with the following contents:
```js
var projects = [
  {
    name: 'YOUR_PROJECT',
    live: true  // or false, depending on the presence of distribution files.
  },
  {
    name: 'YOUR_OTHER_PROJECT',
    live: true  // or false...
  },
  // ...
];
```
1. Spin up a local server and view in your browser.
```
  # Just an example, do this however you like.
  cd src/
  python -m SimpleHTTPServer 3000 && firefox -new-tab localhost:3000
```
