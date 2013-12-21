describe("With initializing a `slice` function", function() {
	var testArray = ko.observableArray([1,2,3,4,5,6]);

	it("should return an observable", function() {
		var result = testArray.observableSlice(0);
		expect(ko.isObservable(result)).toBeTruthy();
	});

	it("should contain the spliced items", function() {
		var result = testArray.observableSlice(0);
		expect(result().length).toBe(6);
	});

	it("should limit the results based on the passed in indexes", function() {
		var result = testArray.observableSlice(3,6);
		expect(result().length).toBe(3);
		expect(result()[0]).toBe(4);
	});
});

describe("When updating source array", function() {
	var testArray = ko.observableArray([1,2,3,4,5,6]);

	it("should update the sliced array if the update falls within the existing range", function() {
		var source = ko.observableArray([1,2,3,4,5,6]);
		var result = source.observableSlice(0,3);

		source.unshift(0);
		expect(result()[0]).toBe(0);
		expect(result()[2]).toBe(2);
		expect(result().length).toBe(3);
	});

	it("should not update the sliced array if it does not fall within the range", function() {
		var source = ko.observableArray([1,2,3,4,5,6]);
		var result = source.observableSlice(0,3);

		source.push(0);
		expect(result()[0]).toBe(1);
		expect(result()[2]).toBe(3);
		expect(result().length).toBe(3);
	});

	it("should notify subscribers when an applicable update occurs", function() {
		var source = ko.observableArray([1,2,3,4,5,6]);
		var result = source.observableSlice(0,3);
		var fired = false;

		result.subscribe(function() {
			fired = true;
		});

		source.unshift(0);
		expect(fired).toBeTruthy();
	});

	it("should not notify subscribers when an update occurs that does not apply", function() {
		var source = ko.observableArray([1,2,3,4,5,6]);
		var result = source.observableSlice(0,3);
		var fired = false;

		result.subscribe(function() {
			fired = true;
		});

		source.push(0);
		expect(fired).toBeFalsy();
	});

	it("should return the entire array if no arguments are passed in", function() {
		var source = ko.observableArray([1,2,3,4,5,6]);
		var result = source.observableSlice();

		expect(result().length).toBe(6);
	});

	it("should always be notified if no arguments are passed in", function() {
		var source = ko.observableArray([1,2,3,4,5,6]);
		var result = source.observableSlice();
		var fired = false;

		result.subscribe(function() {
			fired = true;
		})

		source.push(0);
		expect(fired).toBeTruthy();

		fired = false;
		source.unshift(0);
		expect(fired).toBeTruthy();
	});

	it("should be notified of changes based on negative begin index", function() {
		var source = ko.observableArray([1,2,3,4,5,6]);
		var result = source.observableSlice(-2);
		var fired = false;

		result.subscribe(function() { fired = true });

		source.push(0);

		expect(fired).toBeTruthy();
		expect(result().length).toBe(2);
		expect(result()[1]).toBe(0);
	});

	it("should be notified of changes based on negative end indexes", function() {
		var source = ko.observableArray([1,2,3,4,5,6]);
		var result = source.observableSlice(2,-1);
		var fired = false;

		result.subscribe(function() { fired = true });

		source.push(0);

		expect(fired).toBeTruthy();
		expect(result().length).toBe(4);
		expect(result()[3]).toBe(6);
	});
})