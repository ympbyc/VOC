var TrafficLight = (function () {

    //make a visual for a traffic light and initialize its AI
    function makeTrafficLight (space, address, length, color, facing, id) {
        //visual for a traffic light
        var visual = new VOC.Visual({
            address: address,
            color: color,
            recognized_as: "traffic light",
            facing: facing,  //U.dir instance
            id: id
        });

        var color_opposite = {green: "red", red: "green"};

        /* AI for traffic lights
         * Stay green for a while, then turn red
         * Stay red for a while, then turn green
         */
        function start_color (color) {
            visual.swap(_.flippar(_.merge, {color: color}));
            return setTimeout(_.partial(start_color, color_opposite[color]), length);
        }

        start_color(color);

        return visual;
    }


    function makeVisibleLight (town, address, length, color, facing, id) {
        facing = U.dir(facing);
        var template = $("#light-template").html();
        var $el = $(_.simplate(template, {id: id}))
            .css({zIndex: address.z, left: address.x, top: address.y})
            .appendTo(town.$el);

        if (facing.axis === "x")
            $el.addClass("vertical");


        return makeTrafficLight(town.space, address, length, color, facing, id);
    }


    var light_opposite = {red: "green", green: "red"};

    function renderTrafficLight (light) {
        var $el = $("#"+light.id);
        $el.addClass(light.color);
        $el.removeClass(light_opposite[light.color]);
    }


    return {
        makeTrafficLight: makeTrafficLight,
        makeVisibleLight: makeVisibleLight,
        renderTrafficLight: renderTrafficLight
    };

}());
