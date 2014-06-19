var U = VOC.utils;

function always (x) { return true; }

function makeTown () {
    var town = {space: new VOC.Space(),
                $el: $("#town") };

    //cars
    town.space.place(
        Car.makeVisibleCar(town, new VOC.Address(10, 10, 1), 80, "+x", "car-a")
    );
    town.space.place(
        Car.makeVisibleCar(town, new VOC.Address(40, 10, 1), 90, "+x", "car-b")
    );
    town.space.place(
        Car.makeVisibleCar(town, new VOC.Address(70, 10, 1), 100, "+x", "car-c")
    );
    town.space.place(
        Car.makeVisibleCar(town, new VOC.Address(100, 10, 1), 80, "+x", "car-d")
    );
    town.space.place(
        Car.makeVisibleCar(town, new VOC.Address(130, 10, 1), 80, "+x", "car-e")
    );


    //pedestrians
    town.space.place(
        Pedestrian.makeVisiblePedestrian(town, new VOC.Address(200, 200, 1),
                               new VOC.Address(300, 280, 1), "pedestrian-a")
    );
    town.space.place(
        Pedestrian.makeVisiblePedestrian(town, new VOC.Address(100, 200, 1),
                               new VOC.Address(305, 280, 1), "pedestrian-b")
    );
    town.space.place(
        Pedestrian.makeVisiblePedestrian(town, new VOC.Address(100, 100, 1),
                               new VOC.Address(310, 280, 1), "pedestrian-c")
    );

    town.space.place(
        Train.makeVisibleTrain(town, new VOC.Address(-900, 275, 5), [], "train-a")
    );


    town.space.place(new VOC.Visual({address: new VOC.Address(300, 275, 4),
                                     recognized_as: "platform"}));

    //trafic lights
    town.space.place(
        TrafficLight.makeVisibleLight(town,
                                      new VOC.Address(600, 10, 2),
                                      3000, "green", "+x", "light-a"));
    town.space.place(
        TrafficLight.makeVisibleLight(town,
                                      new VOC.Address(620, 40, 2),
                                      3000, "red", "-y", "light-b"));

    town.space.place(
        TrafficLight.makeVisibleLight(town,
                                      new VOC.Address(600, 400, 2),
                                      3000, "green", "+x", "light-c"));
    town.space.place(
        TrafficLight.makeVisibleLight(town,
                                      new VOC.Address(620, 380, 2),
                                      3000, "red", "+y", "light-d"));
    town.space.place(
        TrafficLight.makeVisibleLight(town,
                                      new VOC.Address(620, 430, 2),
                                      3000, "red", "-y", "light-e"));


    //intersections
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(50, 10, 1),
                                                   ["+x", "-x", "+y"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(300, 10, 1),
                                                   ["+x", "-x", "+y"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(620, 10, 1),
                                                   ["-x", "+y"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(50, 200, 1),
                                                   ["+x", "+y", "-y"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(50, 400, 1),
                                                   ["+x", "+y", "-y"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(620, 200, 1),
                                                   ["-x", "+y", "-y"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(620, 400, 1),
                                                   ["-x", "+y", "-y"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(300, 200, 1),
                                                   ["+x", "-x", "-y"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(50, 600, 1),
                                                   ["+x", "-y", "+y"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(620, 600, 1),
                                                   ["-x", "-y", "+y"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(0, 10, 1),
                                                   ["+x"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(50, 710, 1),
                                                   ["-y"]));
    town.space.place(Intersection.makeIntersection(town.space,
                                                   new VOC.Address(620, 710, 1),
                                                   ["-y"]));




    setInterval(function () {
        var vision = town.space.see(always);

        var cars = vision.filter(U.recognize("car"));
        var lights = vision.filter(U.recognize("traffic light"));
        var pedestrians = vision.filter(U.recognize("pedestrian"));
        var trains = vision.filter(U.recognize("train"));

        cars.forEach(Car.renderCar);
        lights.forEach(TrafficLight.renderTrafficLight);
        pedestrians.forEach(Pedestrian.renderPedestrian);
        trains.forEach(Train.renderTrain);

    }, 100);

    return town;
}

var _town = makeTown();
