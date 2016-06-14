var app;
(function (app) {
    var service;
    (function (service) {
        var PizzaService = (function () {
            function PizzaService($resource, $q) {
                this.$q = $q;
                this.PizzaResource = $resource("https://pizzaserver.herokuapp.com/pizzas/:id/:toppings", { id: '@id' });
            }
            PizzaService.prototype.fetchPizzas = function () {
                var _this = this;
                var deferred = this.$q.defer();
                this.PizzaResource.query({}).$promise.then(function (data) {
                    _this.pizzas = data;
                    deferred.resolve();
                }, function (error) {
                    console.log(error);
                    deferred.reject();
                });
                return deferred.promise;
            };
            PizzaService.prototype.getPizzaToppings = function (pizzaId) {
                return this.PizzaResource.query({ id: pizzaId, toppings: 'toppings' }).$promise;
            };
            PizzaService.prototype.createPizza = function (name, desc) {
                var _this = this;
                var deferred = this.$q.defer();
                var jsonPizza = { pizza: { name: name, description: desc } };
                this.PizzaResource.save({}, jsonPizza).$promise.then(function (data) {
                    _this.pizzas.push(data);
                    deferred.resolve();
                }, function (error) {
                    deferred.reject();
                });
                return deferred.promise;
            };
            PizzaService.prototype.addTopping = function (pizzaId, toppingId) {
                return this.PizzaResource.save({ id: pizzaId, toppings: 'toppings' }, { topping_id: toppingId }).$promise;
            };
            PizzaService.$inject = ['$resource', '$q'];
            return PizzaService;
        }());
        angular.module('pizzaClient').service('PizzaService', PizzaService);
    })(service = app.service || (app.service = {}));
})(app || (app = {}));
//# sourceMappingURL=PizzaService.js.map