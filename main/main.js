var app;
(function (app) {
    var main;
    (function (main) {
        'use strict';
        var PizzaItem = app.entity.PizzaItem;
        var ToppingItem = app.entity.ToppingItem;
        var MainController = (function () {
            function MainController(PizzaService, ToppingService, $uibModal, $scope) {
                var _this = this;
                this.PizzaService = PizzaService;
                this.ToppingService = ToppingService;
                this.$uibModal = $uibModal;
                this.$scope = $scope;
                this.itemsPerPage = 12;
                this.pizzaPageNumber = 1;
                this.toppingsPageNumber = 1;
                this.detailsPageNumber = 1;
                this.newTopping = "";
                this.errors = {};
                this.emptyPizza = new PizzaItem();
                this.emptyPizza.name = "None";
                this.emptyTopping = new ToppingItem();
                this.emptyTopping.name = "None";
                this.selectedPizza = this.emptyPizza;
                this.selectedTopping = this.emptyTopping;
                this.PizzaService.fetchPizzas().then(function () {
                    _this.paginatePizzas();
                }, function () {
                    console.log('Error fetching pizzas');
                });
                this.ToppingService.fetchToppings().then(function () {
                    _this.paginateToppings();
                }, function () {
                    console.log('Error fetching toppings');
                });
            }
            MainController.prototype.showDetails = function () {
                var _this = this;
                this.showingDetails = true;
                this.errors['pizzaName'] = null;
                this.PizzaService.getPizzaToppings(this.selectedPizza.id).then(function (data) {
                    console.log(data);
                    _this.selectedPizza.toppings = data;
                    _this.detailsPageNumber = 1;
                    _this.paginateDetails();
                    _this.showingDetails = false;
                    _this.openModal();
                }, function () {
                    _this.showingDetails = false;
                    _this.errors['pizzaName'] = "Could not load details at this time.";
                });
            };
            MainController.prototype.paginateDetails = function () {
                this.paginatedDetails = [];
                var lastIndex = this.detailsPageNumber * this.itemsPerPage;
                for (var i = lastIndex - this.itemsPerPage; i < lastIndex; i++) {
                    if (i >= this.selectedPizza.toppings.length)
                        break;
                    this.paginatedDetails.push(this.selectedPizza.toppings[i]);
                }
            };
            MainController.prototype.paginatePizzas = function () {
                this.paginatedPizzas = [];
                var lastIndex = this.pizzaPageNumber * this.itemsPerPage;
                for (var i = lastIndex - this.itemsPerPage; i < lastIndex; i++) {
                    if (i >= this.PizzaService.pizzas.length)
                        break;
                    this.paginatedPizzas.push(this.PizzaService.pizzas[i]);
                }
            };
            MainController.prototype.paginateToppings = function () {
                this.paginatedToppings = [];
                var lastIndex = this.toppingsPageNumber * this.itemsPerPage;
                for (var i = lastIndex - this.itemsPerPage; i < lastIndex; i++) {
                    if (i >= this.ToppingService.toppings.length)
                        break;
                    this.paginatedToppings.push(this.ToppingService.toppings[i]);
                }
            };
            MainController.prototype.createTopping = function () {
                var _this = this;
                this.toppingSaved = false;
                this.addingNewTopping = true;
                if (this.newTopping && this.newTopping.trim() != "") {
                    this.errors['toppingName'] = null;
                    var promise = this.ToppingService.createTopping(this.newTopping);
                    promise.then(function () {
                        _this.toppingSaved = true;
                        _this.toppingsPageNumber = _this.totalToppingPages();
                        _this.paginateToppings();
                        _this.addingNewTopping = false;
                    }, function () {
                        _this.errors['toppingName'] = "There was an error saving the topping.";
                        _this.addingNewTopping = false;
                    });
                }
                else {
                    this.errors['toppingName'] = "You must enter a name for the topping.";
                    this.addingNewTopping = false;
                }
            };
            MainController.prototype.createPizza = function () {
                var _this = this;
                this.pizzaSaved = false;
                this.addingPizza = true;
                if (!this.pizzaName || this.pizzaName.trim() == "") {
                    this.errors['pizzaName'] = "You must enter a name for the pizza.";
                    this.addingPizza = false;
                }
                else {
                    this.errors['pizzaName'] = null;
                }
                if (!this.pizzaDesc || this.pizzaDesc.trim() == "") {
                    this.errors['pizzaDesc'] = "You must enter a description for the pizza.";
                    this.addingPizza = false;
                }
                else {
                    this.errors['pizzaDesc'] = null;
                }
                if (!this.errors['pizzaName'] && !this.errors['pizzaDesc']) {
                    this.PizzaService.createPizza(this.pizzaName, this.pizzaDesc).then(function () {
                        _this.pizzaSaved = true;
                        _this.pizzaPageNumber = _this.totalPizzaPages();
                        _this.paginatePizzas();
                        _this.addingPizza = false;
                    }, function () {
                        _this.errors['pizzaName'] = "There was an error saving the pizza.";
                        _this.addingPizza = false;
                    });
                }
            };
            MainController.prototype.addPizzaTopping = function () {
                var _this = this;
                this.addingTopping = true;
                this.toppingSaved = false;
                this.errors['toppingName'] = null;
                this.PizzaService.addTopping(this.selectedPizza.id, this.selectedTopping.id).then(function (data) {
                    _this.addingTopping = false;
                    _this.toppingSaved = true;
                }, function () {
                    _this.addingTopping = false;
                    _this.errors['toppingName'] = "There was an error saving the topping.";
                });
            };
            MainController.prototype.totalPizzaPages = function () {
                return Math.ceil(this.PizzaService.pizzas.length / this.itemsPerPage);
            };
            MainController.prototype.totalToppingPages = function () {
                return Math.ceil(this.ToppingService.toppings.length / this.itemsPerPage);
            };
            MainController.prototype.openModal = function () {
                var self = this;
                this.modalInstance = this.$uibModal.open({
                    animation: true,
                    templateUrl: 'main/detailsModal.html',
                    size: 'md',
                    scope: self.$scope
                });
            };
            MainController.prototype.closeModal = function () {
                this.modalInstance.dismiss();
            };
            MainController.$inject = ['PizzaService', 'ToppingService', '$uibModal', '$scope'];
            return MainController;
        }());
        angular.module('pizzaClient').controller('MainController', MainController);
    })(main = app.main || (app.main = {}));
})(app || (app = {}));
//# sourceMappingURL=main.js.map