# fend-frogger

This is the third project in Udacity's [Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) program. It provides art assets and a game engine that must be used to build a frogger clone.

## Course Notes

### Learning Objectives

"You will learn JavaScript’s object oriented programming features to write eloquently designed classes capable of creating countless instances of similarly functioning objects. You will discover a variety of ways inheritance and delegation can be used to create well architected and performant applications."

### Instructions

1. If you need a refresher on [Object Oriented JavaScript](https://www.udacity.com/course/viewer#!/c-ud015-nd), review our course and [OOJS Notes](https://docs.google.com/document/d/1F9DY2TtWbI29KSEIot1WXRqqao7OCd7OOC2W3oubSmc/pub?embedded=true). This [Office Hours video](https://plus.google.com/events/cvrejvitte5a37k1vfli1veler8?authkey=CIistZK2pbbqYA) and [readme](https://github.com/udacity/fend-office-hours/tree/master/OOJS/Object-Oriented%20Basics) is also helpful.
2. If you'd like a more detailed explanation as to how the game engine works, see our [HTML5 Canvas course](https://www.udacity.com/course/ud292-nd). [Office Hours P3: Understanding Engine.js](https://plus.google.com/u/0/events/cupbs3pbne7qkuqok4g0ldhntic?authkey=COGW25b5jbv3-AE) is also very helpful.
3. Read the [detailed instructions](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub) for the project.
4. Download the [art assets and provided game engine](https://github.com/udacity/frontend-nanodegree-arcade-game).
5. Review the [video of the completed game](https://www.youtube.com/watch?v=SxeHV1kt7iU&feature=youtu.be) and take note of the game's rules.
6. Review the code and comments provided in app.js
7. Identify the various classes you will need to write.
8. Identify and code the properties each class must have to accomplish its tasks.
9. Write the functions that provide functionality to each of your class instances.

## Game Notes

### Basic Functionality

**Player**

- Can move left, right, up, and down.
- Returned to start position on collision with enemy.
- Wins on collision with water.

**Enemies**

- Move right at varying speeds.
- Only appear on paved portion of map.

### Additional Functionality

- Player character selection.
- Score.
- Collectables.
- ...
