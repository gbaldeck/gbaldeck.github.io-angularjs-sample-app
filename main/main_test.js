'use strict';
describe('MainController', function () {
    beforeEach(module('pizzaClient'));

    var $controller;

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe('paginate the list of toppings', function () {
        it('paginates by splitting the list', function() {

            var $scope = {};
            var viewCtrl = $controller('MainController', {$scope: $scope});
            expect(viewCtrl).toBeDefined();

            var toppings = []

            for(var i = 0; i < 50; i++){
                var topping = new ToppingItem();
                topping.id = i;
                topping.name = "Topping "+i;
                toppings.push(topping);
            }

            viewCtrl.ToppingService = {toppings: toppings};

            viewCtrl.paginateToppings();

            expect(viewCtrl.paginatedToppings.length).toEqual(viewCtrl.itemsPerPage);
        });
    });
});