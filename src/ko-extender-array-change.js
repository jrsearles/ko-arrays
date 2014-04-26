ko.extenders.arrayChanges = function(target) {
	var underlyingArray = target.peek();
	if (!Array.isArray(underlyingArray)) {
		throw new TypeError("The `arrayChanges` extender can only be used against arrays.");
	}

	// keep a copy of the original array
	var original = underlyingArray.slice(0);
	var differences = ko.observableArray();
	var mapperFn = function (status) {
		return function() { 
			return differences()
				.filter(function (d) { return d.status === status; })
				.map(function (d) { return d.value; });
		};
	};

	target.subscribe(function () {
		var diff = ko.utils.compareArrays(original, target.peek());
		differences(diff.filter(function (d) { return d.status !== "retained"; }));
	});

	target.$$adds = ko.computed(mapperFn("added"));
	target.$$deletes = ko.computed(mapperFn("deleted"));

	return target;
};