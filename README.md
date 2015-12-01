# fend-portfolio
This is the first project in [Udacity's Front-End Web Developer nanodegree program](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001).

In this project, I am provided with a design mockup for a portfolio website that I must replicate.  The website I create must be responsive, and must provide an overview of each of the portfolio projects that I complete throughout the nanodegree program.  It must also adhere to the program's [styleguide](http://udacity.github.io/frontend-nanodegree-styleguide/) and be validated against the [W3C's Validators](http://validator.w3.org/).  I am free to personalize the design as I wish.

## Project Notes

The live site may be viewed at [tempurturtul.github.io/fend-portfolio](http://tempurturtul.github.io/fend-portfolio).

The static front-end files (minified and original) may be found in the `src/client/` folder.  I've decided to utilize lessons learned in my previous work to aid my work-flow, which is why I've included additional files.  Details on these additional files are included below, as are instructions to utilize them.  As this is the first project in the nanodegree program I am currently featuring some of my previous work.  I plan to update the site with new projects as I complete them.

### Additional File Descriptions

- `Vagrantfile`
  - Used by [Vagrant](https://www.vagrantup.com/) to create and manage a virtual machine for development.
- `package.json`
  - Used by [npm](https://www.npmjs.com/) to manage locally installed npm packages.
- `gulpfile.js`
  - Used by [Gulp](http://gulpjs.com/) to automate various tasks.
- `src/server/server.js`
  - A simple [Express](http://expressjs.com/) server.

### Instructions

**Note:** *Windows users may experience errors. I do not recommend following these instructions on Windows at this time. If you decide to do so, be sure to use `npm install --no-bin-links` when attempting to install project dependencies.*

1. Install [Vagrant](https://www.vagrantup.com/) and [Virtual Box](https://www.virtualbox.org/wiki/Downloads). (Requires 64-bit OS.)
2. Navigate to project directory and start the development virtual machine.
  - `vagrant up`
3. SSH into the virtual machine.
  - `vagrant ssh`
4. Navigate to the synced project directory.
  - `cd /vagrant`
5. Install the project dependencies.
  - `npm install`
6. Run the default gulp task.
  - `gulp`
7. View the site on port 3000.
  - [localhost:3000](http://localhost:3000/)

**To Tear-Down:**

1. Cancel running gulp task.
  - ctrl-c
2. Log out of VM.
  - ctrl-d
3. Destroy VM.
  - `vagrant destroy`
4. *(Optional)* Ensure no additional VMs exist.
  - `vagrant global-status`
