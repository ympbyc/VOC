var Pedestrian = (function () {
    function makePedestrian (space, address, destination, id) {
        var visual = new VOC.Visual({
            address: address,
            destination: destination,
            recognized_as: "pedestrian",
            id: id
        });

        var itvl = setInterval(function () {
            var v = visual.deref();

            var vision = space.see(U.sight360(v.address, 15));

            var close_cars = vision.some(U.recognize("car"));
            var close_building = vision.some(U.recognize("wall"));
            var stopping_train = vision.filter(U.recognize("train"))
                    .filter(U.propEq("door", "open"));

            if (close_cars)
                return null;
            if (U.distance(v.address.x, v.destination.x) > 2)
                visual.swap(function (v) {
                   return _.merge(v, {address: _.assoc(v.address, "x", v.address.x+1)});
                });
            if (U.distance(v.address.y, v.destination.y) > 2)
                visual.swap(function (v) {
                   return _.merge(v, {address: _.assoc(v.address, "y", v.address.y+1)});
                });
            if (stopping_train.length) {
                console.log("乗車中");
                clearInterval(itvl);
                stopping_train[0]._visual.swap(function (tr) {
                    return _.merge(tr, {passengers: _.conj(tr.passengers, visual)});
                });
            }



            return null;
        }, 200);

        return visual;
    }

    function makeVisiblePedestrian (town, address, destination, id) {
        var template = $("#pedestrian-template").html();
        var $el = $(_.simplate(template, {id: id}))
                .css({zIndex: address.z})
                .appendTo(town.$el);
        return makePedestrian(town.space, address, destination, id);
    }

    function renderPedestrian (pedestrian) {
        var $el = $("#"+pedestrian.id);
        $el.css({ left: pedestrian.address.x,
                  top:  pedestrian.address.y });
    }

    return {
        makePedestrian: makePedestrian,
        makeVisiblePedestrian: makeVisiblePedestrian,
        renderPedestrian: renderPedestrian
    };
}());
