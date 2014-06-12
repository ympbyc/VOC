var U = VOC.utils;
var space = new VOC.Space();


function frontSight (addr, distance) {
    return U.directedSight(addr, "x", distance, 5);
};


function makeCar (address, speed, id) {
    var visual = new VOC.Visual({
        recognized_as: "car",
        address: address,
        brake_light: false,
        id: id
    });

    setInterval(function () {
        var v = visual.deref();

        var vision = space.see(frontSight(v.address, 50));

        var red_light_p = vision
                .filter(U.recognize("traffic light"))
                .some(U.propEq("color", "red"));

        var cars_in_front = vision.filter(U.recognize("car"));

        var braking_cars_p = cars_in_front.some(U.getProp("brake_light"));

        var really_close_p = cars_in_front.some(function (car) {
            return U.distance(car.address.x, v.address.x) < 30;
        });

        if (red_light_p || braking_cars_p || really_close_p)
            visual.swap(_.flippar(_.merge, {brake_light: true}));
        else
            visual.swap(function (v) {
                return _.merge(v, {address: _.merge(v.address, {x: v.address.x + 1}),
                                   brake_light: false });
            });
    }, 3600 / speed);

    return visual;
}



function makeTrafficLight (address, green_length, red_length, id) {
    var visual = new VOC.Visual({
        address: address,
        color: "green",
        recognized_as: "traffic light",
        id: id
    });

    function start_green () {
        visual.swap(_.flippar(_.merge, {color: "green"}));
        setTimeout(function () {
            start_red();
        }, green_length);
    }

    function start_red () {
        visual.swap(_.flippar(_.merge, {color: "red"}));
        setTimeout(function () {
            start_green();
        }, red_length);
    }

    start_green();

    return visual;
}


function always (x) { return true; }

var light_opposite = {red: "green", green: "red"};

$(function () {

    var car_html_tmpl = $("#car-template").html();
    var light_html_tmpl = $("#light-template").html();
    var $road = $("#road");
    var $sidewalk = $("#sidewalk");
    var road_width = $road.width();

    function makeVisibleCar (address, speed, id) {
        $(_.simplate(car_html_tmpl, {id: id})).appendTo($road);
        return new makeCar(address, speed, id);
    }

    function makeVisibleLight (address, gl, rl, id) {
        $(_.simplate(light_html_tmpl, {id: id, x: address.x})).appendTo($sidewalk);
        return new makeTrafficLight(address, gl, rl, id);
    }


    space.place(makeVisibleLight(new VOC.Address(200, 3, 0), 1000, 1000, "light-a"));
    space.place(makeVisibleLight(new VOC.Address(400, 3, 0), 2000, 1000, "light-b"));
    space.place(makeVisibleLight(new VOC.Address(600, 3, 0), 1000, 3000, "light-c"));
    space.place(makeVisibleLight(new VOC.Address(800, 3, 0), 0, 1000, "light-d"));
    space.place(makeVisibleCar(new VOC.Address(0, 0, 0), 80, "car-a"));
    space.place(makeVisibleCar(new VOC.Address(50, 0, 0), 70, "car-b"));
    space.place(makeVisibleCar(new VOC.Address(80, 0, 0), 80, "car-c"));
    space.place(makeVisibleCar(new VOC.Address(120, 0, 0), 80, "car-d"));

    console.log("start");
    setInterval(function () {
        var cars = space.see(always).filter(U.recognize("car"));

        var lights = space.see(always).filter(U.recognize("traffic light"));

        cars.forEach(function (car) {
            var $car = $("#"+car.id);
            $car.css("left", car.address.x);
            if (car.brake_light)
                $car.addClass("braking");
            else
                $car.removeClass("braking");
        });

        lights.forEach(function (light) {
            var $l = $("#"+light.id);
            $l.addClass(light.color);
            $l.removeClass(light_opposite[light.color]);
        });

    }, 100);
});
