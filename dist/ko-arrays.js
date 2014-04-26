;(function(ko, undefined) {
// add non-mutating methods to the observable array - this will make dealing
// with observables more intuitive as the api will match regular arrays
["concat", "every", "forEach", "join", "lastIndexOf", "reduce", "reduceRight", "some"].forEach(function(methodName) {
	ko.observableArray.fn[methodName] = ko.observableArray.fn[methodName] || function() {
		var underlyingArray = this.peek();
		return underlyingArray[methodName].apply(underlyingArray, arguments);
	};
});

ko.observableArray.fn.observableSlice = function(begin, end) {
	var self = this;
	var newArray = ko.observableArray(self.peek().slice(begin, end));

	self.subscribe(function(changes) {
		var endingIndex = end;
		var underlyingArray = self.peek();
		// note: if no arguments are passed in, the result is the entire array so always notify
		var hasUpdates = begin === undefined;

		// need to account for no ending index or negative ending index
		if (endingIndex === undefined) {
			endingIndex = underlyingArray.length;
		} else if (endingIndex < 0) {
			endingIndex += underlyingArray.length + 1;
		}

		if (!hasUpdates) {
			hasUpdates = changes.some(function (change) {
				return change.index >= begin && change.index < endingIndex;
			});
		}	

		if (hasUpdates) {
			// update our observable with the new results
			newArray(underlyingArray.slice(begin, end));
		}
	}, null, "arrayChange");

	return ko.computed({
		read: newArray
	});
};
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
})(ko);