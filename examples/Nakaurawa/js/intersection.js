var Intersection = (function () {
    function makeIntersection (space, address, directions) {
        var visual = new VOC.Visual({
            address: address,
            directions: _.map(directions, U.dir),
            recognized_as: "intersection"
        });

        return visual;
    }

    return {makeIntersection: makeIntersection};
}());
