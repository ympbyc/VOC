var Train = (function () {
    function makeTrain (space, address, passengers, id) {
        var visual = new VOC.Visual({
            address: address, //address of the tail
            recognized_as: "train",
            door: "closed",
            passengers: passengers,
            id: id
        });

        function move_forward (v) {
            var patch = {address: _.assoc(v.address, "x", v.address.x + 5) };
            patch.passengers = _.map(v.passengers, function (pv) {
                return pv.swap(function (p) {
                    return _.merge(p, {
                        address: _.assoc(p.address, "x", p.address.x+5)});
                });
            });
            return _.merge(v, patch);
        }

        var ai;
        var itvl = setInterval(ai = function () {
            var v = visual.deref();

            var vision = space.see(U.sight360(v.address, 2));
            var at_station = vision.some(U.recognize("platform"));

            visual.swap(move_forward);
            if (at_station) {
                clearInterval(itvl);
                setTimeout(function () {
                    itvl = setInterval(ai, 200);
                }, 1000 * 10);
                visual.swap(_.flippar(_.merge, {door: "open"}));
            } else
                visual.swap(_.flippar(_.merge, {door: "closed"}));


            if (v.address.x > 1000) {
                clearInterval(itvl);
                space.displace(visual);
            }
        }, 200);

        return visual;
    }

    function makeVisibleTrain (town, address, passengers, id) {
        var template = $("#train-template").html();
        var $el = $(_.simplate(template, {id: id}))
                .css({zIndex: address.z})
                .appendTo(town.$el);
        return makeTrain(town.space, address, passengers, id);
    }

    function renderTrain (train) {
        var $el = $("#" + train.id);
        $el.css({top: train.address.y,
                 left: train.address.x - 300});
    }

    return {
        makeTrain: makeTrain,
        makeVisibleTrain: makeVisibleTrain,
        renderTrain: renderTrain
    };

}());
