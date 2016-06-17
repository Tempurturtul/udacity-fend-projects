# Projects Index

Provides links to the distribution versions of all detected projects stored one level above this directory (`../`).

**Requires bash and \*nix commands to use the build script.**

**Alternatively:** you'd have to make your own build script; or manually copy the contents of `../YOUR_PROJECT/dist/` to `./src/projects/YOUR_PROJECT/dist/`, then create a `./src/scripts/projects.js` file that exposes a global variable `projects` that is an array of `'YOUR_PROJECT'` strings.

## Quickstart
- Clone this repository next to the projects you wish to provide links to.
```
  cd YOUR_PROJECTS_FOLDER/
  git clone https://github.com/Tempurturtul/projects-index.git
```
- Navigate to the project directory and change permissions on the bash build script to allow execution. *(You're going to want to read it first. It could be a bomb for all you know.)*
```
  cd projects-index/
  sudo chmod 555 ./build-script
```
- Run the build script. ***(Read it first. I do not guarantee it will not have unintentional, potentially harmful side-effects.)***
```
  # YOU READ IT, RIGHT?
  ./build-script
```
- Spin up a local server and view in your browser.
```
  # This is just an example, do this however you like.
  cd src/
  python -m SimpleHTTPServer 3000 & sleep 2; firefox -new-tab localhost:3000
```
