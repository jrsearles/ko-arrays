describe("ChangeTracking", function() {

	describe("When initializing", function() {
		it("should fail when the target is not an array", function() {
			var target = ko.observable();
			expect(function() { target.extend({ "arrayChanges": true }); }).toThrow();
		});

		it("should add a `$$adds` observable array to the target", function() {
			var target = ko.observableArray().extend({ "arrayChanges": true });
			expect(Array.isArray(target.$$adds())).toBeTruthy();
		});

		it("should add a `$$deletes` observable array to the target", function() {
			var target = ko.observableArray().extend({ "arrayChanges": true });
			expect(Array.isArray(target.$$deletes())).toBeTruthy();
		});

		it("should not have any adds or deletes", function() {
			var target = ko.observableArray([{},{}]).extend({ "arrayChanges": true });

			expect(target.$$adds().length).toBe(0);
			expect(target.$$deletes().length).toBe(0);
		});
	});

	describe("When adding an object to the array", function() {
		it("should add the object to the `$$adds` collection", function() {
			var target = ko.observableArray().extend({ "arrayChanges": true });
			var obj = {};

			target.push(obj);

			expect(target.$$adds()[0]).toBe(obj);
		});

		it("should notify subscribers to the `$$adds` collection", function() {
			var target = ko.observableArray().extend({ "arrayChanges": true });
			var fired = false;
			target.$$adds.subscribe(function() { fired = true; });

			target.push({});

			expect(fired).toBeTruthy();
		});
	});

	describe("When removing an object from the array", function() {
		it("should add the object to the `$$deletes` collection", function() {
			var obj = {};
			var target = ko.observableArray([obj]).extend({ arrayChanges: true });

			target.pop();

			expect(target.$$deletes()[0]).toBe(obj);
		});

		it("should notify subscribers to the `$$deletes` collection", function() {
			var target = ko.observableArray([{}]).extend({ "arrayChanges": true });
			var fired = false;
			target.$$deletes.subscribe(function() { fired = true; });

			target.pop();

			expect(fired).toBeTruthy();
		});
	});
});