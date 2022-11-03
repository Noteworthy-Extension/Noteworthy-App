<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Noteworthy-Extension">
    <img src="https://res.cloudinary.com/dy1ztqqbk/image/upload/v1667020915/Noteworthy%20App/Noteworthy-Logo_p2w7om.png" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">Noteworthy App</h3>

  <p align="center">
    A note-taking app that lets you annotate any website.
    <br />
    <br />
    <a href="https://chrome.google.com/webstore/detail/noteworthy/ipgeapjcihgdkhoilllkfgkhailadfha">Download</a> the extension in the chrome web store
    ·
    <a href="https://github.com/Noteworthy-Extension/Noteworthy-App/issues">Report a bug</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Noteworthy is a browser based extension that allows you to make annotations and take notes on any website. It has many features from text to drawing that all work on any website. With local storage, the notes you take are saved locally to your device so that the notes load when you visit the site again. 

### Features

Noteworthy has many features giving you as much freedom on the website as if it was a piece of paper. 

With Noteworthy you can annotate the page with:
* Drawing
* Highlighting
* Shapes
* Lines
* Arrows
* Textboxes

### Built With

We built our app with pure Typescript to ensure code security, then we transpile our code to JS. We also used pure Sass which allows more complex visual styling and makes it easier for the app to not conflict with the website. After compiling it to code that the browser can read, we bundled our code into one minified file with Gulp. This is the file that we use for the chrome extension.

* [![Typescript][Typescript]][Typescript-url]
* [![Sass][Sass]][Sass-url]
* [![Gulp][Gulp]][Gulp-url]

<!-- GETTING STARTED -->
## Getting Started

This is a guide on a few ways to install the extension.

### Installation

_There are a few ways to install Noteworthy_
<ul>
  <li>Chrome Webstore</li>

  <ul>
    The Chrome Webstore is the easiest way to install Noteworthy but sometimes updates get delayed. First, go to the app's page on the
    <a href='https://chrome.google.com/webstore/detail/noteworthy/ipgeapjcihgdkhoilllkfgkhailadfha'>Chrome Webstore</a>

    Click install, go to a page and click on the extension. A dropdown should open which will allow you to markdown the page. Once you're done you can leave the page and all of your notes will stay when you return
  </ul>
  
  <li>2. From the source</li>

  <ul>
    <li>
      Git clone the <a href="https://github.com/Noteworthy-Extension/Noteworthy-Extension">src repo</a> Then go to <a href="chrome://extensions">chrome://extensions</a> and click load unpacked extension. Click the folder that you clone, then dist, then click OK. This will load the extension in and you can use it normally.
    </li>
  </ul>
</ul>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

If you have a question or anything to say, contact us here:

### noteworthy.extension@gmail.com

Project Link: [https://github.com/Noteworthy-Extension/Noteworthy-App](https://github.com/Noteworthy-Extension/Noteworthy-App)

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

A list of some of the tools and resources we used to make our app.

* [Quill Editor](https://quilljs.com/)
* [Icons8](https://icons8.com/)
* [Gulp](https://gulpjs.com/)
* [Sass Live Compile](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass)

  ### Developers
  * [@AwesomeMarley](https://github.com/AwesomeMarley)
  * [@Touch-Grass](https://github.com/Touch-Grass)

<!-- MARKDOWN LINKS & IMAGES -->
[Typescript]: https://res.cloudinary.com/dy1ztqqbk/image/upload/v1667021818/Noteworthy%20App/TypescriptLogo_80x80_p80gvb.png
[Typescript-url]: https://typescriptlang.org
[Sass]: https://res.cloudinary.com/dy1ztqqbk/image/upload/v1667022004/Noteworthy%20App/Sass_Logo_Color.svg_80x80_vakikj.png
[Sass-url]: https://sass-lang.com/
[Gulp-url]: https://gulpjs.com/
[Gulp]: https://res.cloudinary.com/dy1ztqqbk/image/upload/v1667178816/Noteworthy%20App/GulpLogoBetter_80x80_pdl2fk.png


