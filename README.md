VOC
===

Vision Oriented Communication Framework for JS

Vision Oriented Communication
-----------------------------

[Vision Oriented Programming or OO Without Messages](http://ympbyc.hatenablog.com/entry/2014/06/12/Visual_Oriented_Programming_or_OO_Without_Messages)

Basic ideas
-----------

+ In real life, You don't send messages to receivers like OO.
+ You just change your appearance.
+ Others see you and act according to their vision.
+ Everyone does whatever he/she wants asynchronously.

How its Done in VOC
-------------------

+ appearance is just a map (e.g. `{address: {x:0, y:0, z:0}, recognized_as "apple", mass: 5}`)
+ `VOC.Visual` constructs a reference to object's appearance. Each visual has an address.
+ `VOC.Visual#deref` retrieves a current appearance of the visual.
+ `VOC.Visual#swap` changes the visual's current appearance.
+ `VOC.Space` constructs the entire space where visuals live.
+ `VOC.Space#see` retrieves an array of appearances one can see from one's address with one's sight.

+ Dumb objects (e.g. apple, chair) are expressed as Visuals.
+ Each Intelligent object (e.g. robot, human, car w/ driver) is expressed as a Visual that have an associated infinite loop that for each iteration, sees what's around them, interpret the situation, and change its appearance

Expressive
----------

VOC implements FVOP (Functional Vision Oriented Programming).  VOC is designed to work best with functional style programming practices.

Looking to see if there are any red lights around me can be done as simple as the following code:

```javascript
vision = space.see(U.sight360(MYADDRESS, 30));  //retrieve everything within 30m
vision
  .filter(U.recognize("traffic light"))         //recognize traffic lights
  .some(U.propEq("color", "red"));              //that are red
```


Demo
----

Traffic Simulation: http://ympbyc.github.io/VOC/examples/traffic.html
Source Code: https://github.com/ympbyc/VOC/blob/master/examples/traffic.js


Authors
-------

+ Minori Yamashita <ympbyc@gmail.com>

LICENCE
-------

MIT
