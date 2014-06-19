function rand_item (arr) {
    return arr[parseInt(Math.random() * arr.length)];
}

var Car = (function Car () {

    function frontSight (addr, distance, axis) {
        return U.directedSight(addr, axis, distance, 10);
    };


    //make a visual for a car and initialize its AI
    function makeCar (space, address, speed, direction, id) {
        //visual for a car
        var visual = new VOC.Visual({
            recognized_as: "car",
            address: address,
            brake_light: false,
            direction: direction,    //U.dir instance
            id: id
        });

        /* AI for a car
         * Brakes when:
         * + red lights within 50m
         * + any braking cars within 50m
         * + get too close to the car in front
         * Accelerates otherwise
         */
        setInterval(function () {
            var v = visual.deref(); //current state of my visual

            var vision = space.see(
                frontSight(v.address, _[v.direction.op](0, 50), v.direction.axis)
            );

            var red_light_p = vision
                    .filter(U.recognize("traffic light"))
                    .filter(U.propEqual("facing", v.direction))
                    .some(U.propEq("color", "red"));

            var cars_in_front = vision.filter(U.recognize("car"));

            var braking_cars_p = cars_in_front.some(U.getProp("brake_light"));

            var really_close_p = cars_in_front.some(function (car) {
                return U.distance(car.address.x, v.address.x) < 30;
            });

            var isecs = vision.filter(U.recognize("intersection"))
                    .filter(function (isec) {
                        return U.sight360(v.address, 5)(isec.address);
                    });


            if (red_light_p || braking_cars_p || really_close_p)
                visual.swap(_.flippar(_.merge, {brake_light: true}));
            else if (isecs.length) {
                var no_uturn = _.reject(isecs[0].directions, function (d) {
                    return d.axis === v.direction.axis
                        && d.op !== v.direction.op;
                });
                var d = rand_item(no_uturn.length ? no_uturn : isecs[0].directions);
                visual.swap(function (v) {
                    return _.merge(v, {
                        direction: d,
                        address:
                        _.assoc(v.address,
                                d.axis,
                                _[d.op](v.address[d.axis], 5))
                    });
                });
            }
            else
                //move forward
                visual.swap(function (v) {
                    return _.merge(v, {
                        address:
                        _.assoc(v.address,
                                v.direction.axis,
                                _[v.direction.op](v.address[v.direction.axis], 1)),
                        brake_light: false });
                });
        }, 3600 / speed);

        return visual;
    }


    function makeVisibleCar (town, address, speed, direction, id) {
        direction = U.dir(direction);
        var template = $("#car-template").html();
        var $el = $(_.simplate(template, {id: id}))
            .css({zIndex: address.z})
            .appendTo(town.$el);
        return makeCar(town.space, address, speed, direction, id);
    }


    function renderCar (car) {
        var $el = $("#"+car.id);

        $el.css({ left: car.address.x,
                  top:  car.address.y });
        if (car.brake_light)
            $el.addClass("braking");
        else
            $el.removeClass("braking");

        if (car.direction.axis === "y")
            $el.addClass("vertical");
        else $el.removeClass("vertical");
        if (car.direction.op === "-")
            $el.addClass("flipped");
        else $el.removeClass("flipped");
    }

    return { makeCar: makeCar,
             makeVisibleCar: makeVisibleCar,
             renderCar: renderCar };

}());
