var VOC = {};
VOC.utils = {};
VOC._private = {};

VOC.Space = function Space () {
    this._space = [];
};
VOC.Space.prototype.place =  function place (visual) {
    this._space.push(visual);
};
VOC.Space.prototype.see = function see (sight) {
    return this._space
        .map(VOC.utils.callMethod("deref"))
        .filter(function (x) { return sight(x.address); });
};



VOC.Ref = function Ref (state) {
    this._state = state;
};
VOC.Ref.prototype.deref = function deref () {
    return _.clone(this._state);
};
VOC.Ref.prototype.swap = function deref (f) {
    this._state = f(this.deref());
};



VOC.Visual = function Visual (state) {
    if ( ! state.address instanceof VOC.Address)
        console.warn("Visual should have a valid `address`");
    if ( ! state.recognized_as)
        console.warn("Visual should have `recognized_as`");
    return new VOC.Ref(state);
};
VOC.Visual.prototype = VOC.Ref;


VOC.Address = function makeAddress (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};


//utils

VOC._private.close_p = function close_p (addr1, addr2, distance) {
    return VOC.utils.distance(addr1.x, addr2.x) < distance
        && VOC.utils.distance(addr1.y, addr2.y) < distance
        && VOC.utils.distance(addr1.z, addr2.z) < distance;
};

VOC._private.other_axis = {x: ["y", "z"], y: ["x", "z"], z: ["x", "y"]};

VOC.utils.getProp = function (key) {
    return function (x) { return x[key]; };
};

VOC.utils.callMethod = _.optarg(function (method, args) {
    return function (x) { return x[method].apply(x, args); };
});

VOC.utils.propEq = function (key, val) {
    return function (x) { return x[key] == val; };
};

VOC.utils.recognize = function (recognized_as) {
    return VOC.utils.propEq("recognized_as", recognized_as);
};

VOC.utils.distance = function diff (x, y) {
    return Math.max(x, y) - Math.min(x, y);
};

VOC.utils.sight360 = function sight360 (address, distance) {
    return function (addr) {
        return close_p(address, addr, distance);
    };
};

VOC.utils.directedSight = function directedSight (va, axis, distance, side_distance) {
    return function (addr) {
        var diff = addr[axis] - va[axis];
        var oa = VOC._private.other_axis[axis];
        return ((distance < 0)
                ? diff > distance && diff < 0
                : diff < distance && diff > 0)
            && VOC.utils.distance(addr[oa[0]], addr[oa[0]]) < side_distance
            && VOC.utils.distance(addr[oa[1]], addr[oa[1]]) < side_distance;
    };
}
