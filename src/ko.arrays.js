(function(ko, undefined) {

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
				newArray(underlyingArray.slice(begin, end));
			}
		}, null, "arrayChange");

		return ko.computed({
			read: newArray
		});
	};

})(window.ko);