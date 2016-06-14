module app.main {
    'use strict';
    import IPizzaService = app.service.IPizzaService;
    import IPizzaItem = app.entity.IPizzaItem;
    import IToppingService = app.service.IToppingService;
    import IToppingItem = app.entity.IToppingItem;
    import PizzaItem = app.entity.PizzaItem;
    import ToppingItem = app.entity.ToppingItem;

    class MainController {

        private paginatedPizzas:IPizzaItem[];
        private paginatedToppings:IToppingItem[];
        private itemsPerPage = 12;
        private pizzaPageNumber:number;
        private toppingsPageNumber:number;
        private newTopping:string;
        private toppingSaved:boolean;
        private pizzaName:string;
        private pizzaDesc:string;
        private pizzaSaved:boolean;
        private selectedPizza:IPizzaItem;
        private emptyPizza:IPizzaItem;
        private selectedTopping:IToppingItem;
        private emptyTopping:IToppingItem;
        private addingTopping:boolean;
        private addingNewTopping:boolean;
        private addingPizza:boolean;
        private showingDetails:boolean;
        private detailsPageNumber:number;
        private paginatedDetails:IToppingItem[];
        
        private errors:any;
        private modalInstance:any;

        static $inject = ['PizzaService', 'ToppingService', '$uibModal', '$scope']
        constructor(private PizzaService:IPizzaService, private ToppingService:IToppingService, private $uibModal:any, private $scope:any) {
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
            
            this.PizzaService.fetchPizzas().then(
                () => {
                    this.paginatePizzas();
                },
                () => {
                    console.log('Error fetching pizzas');
                }
            );
            
            this.ToppingService.fetchToppings().then(
                () => {
                    this.paginateToppings();
                },
                () => {
                    console.log('Error fetching toppings');
                }
            );
        }
        
        showDetails():void{
            this.showingDetails = true;
            this.errors['pizzaName'] = null;
            
            this.PizzaService.getPizzaToppings(this.selectedPizza.id).then(
                (data) => {
                    console.log(data);
                    this.selectedPizza.toppings = data;
                    this.detailsPageNumber = 1;
                    this.paginateDetails();
                    this.showingDetails = false;
                    this.openModal();
                },
                () => {
                    this.showingDetails = false;
                    this.errors['pizzaName'] = "Could not load details at this time.";
                }
            );
        }

        paginateDetails():void{
            this.paginatedDetails = [];

            var lastIndex = this.detailsPageNumber * this.itemsPerPage;

            for(var i = lastIndex - this.itemsPerPage; i < lastIndex; i++){
                if(i >= this.selectedPizza.toppings.length)
                    break;

                this.paginatedDetails.push(this.selectedPizza.toppings[i]);
            }
        }

        paginatePizzas():void{
            this.paginatedPizzas = [];
            
            var lastIndex = this.pizzaPageNumber * this.itemsPerPage;
            
            for(var i = lastIndex - this.itemsPerPage; i < lastIndex; i++){
                if(i >= this.PizzaService.pizzas.length)
                    break;
                
                this.paginatedPizzas.push(this.PizzaService.pizzas[i]);
            }
        }

        paginateToppings():void{
            this.paginatedToppings = [];

            var lastIndex = this.toppingsPageNumber * this.itemsPerPage;

            for(var i = lastIndex - this.itemsPerPage; i < lastIndex; i++){
                if(i >= this.ToppingService.toppings.length)
                    break;

                this.paginatedToppings.push(this.ToppingService.toppings[i]);
            }
        }

        createTopping():void{
            this.toppingSaved = false;
            this.addingNewTopping = true;

            if(this.newTopping && this.newTopping.trim() != ""){
                this.errors['toppingName'] = null;
                var promise = this.ToppingService.createTopping(this.newTopping);
                
                promise.then(
                    () => {
                        this.toppingSaved = true;
                        this.toppingsPageNumber = this.totalToppingPages();
                        this.paginateToppings();
                        this.addingNewTopping = false;
                    },
                    () => {
                        this.errors['toppingName'] = "There was an error saving the topping."
                        this.addingNewTopping = false;
                    }
                );
            }
            else{
                this.errors['toppingName'] = "You must enter a name for the topping.";
                this.addingNewTopping = false;
            }
        }
        
        createPizza():void{
            this.pizzaSaved = false;
            this.addingPizza = true;

            if(!this.pizzaName || this.pizzaName.trim() == ""){
                this.errors['pizzaName'] = "You must enter a name for the pizza."
                this.addingPizza = false;
            }
            else{
                this.errors['pizzaName'] = null;
            }

            if(!this.pizzaDesc || this.pizzaDesc.trim() == ""){
                this.errors['pizzaDesc'] = "You must enter a description for the pizza."
                this.addingPizza = false;
            }
            else{
                this.errors['pizzaDesc'] = null;
            }
            
            if(!this.errors['pizzaName'] && !this.errors['pizzaDesc']){
                this.PizzaService.createPizza(this.pizzaName, this.pizzaDesc).then(
                    () => {
                        this.pizzaSaved = true;
                        this.pizzaPageNumber = this.totalPizzaPages();
                        this.paginatePizzas();
                        this.addingPizza = false;
                    },
                    () => {
                        this.errors['pizzaName'] = "There was an error saving the pizza."
                        this.addingPizza = false;
                    }
                );
                
            }
        }
        
        addPizzaTopping():void{
            this.addingTopping = true;
            this.toppingSaved = false;
            this.errors['toppingName'] = null;
            
            this.PizzaService.addTopping(this.selectedPizza.id, this.selectedTopping.id).then(
                (data) => {
                    this.addingTopping = false;
                    this.toppingSaved = true;
                },
                () => {
                    this.addingTopping = false;
                    this.errors['toppingName'] = "There was an error saving the topping."
                }
            );
        }

        totalPizzaPages():number{
            return Math.ceil(this.PizzaService.pizzas.length / this.itemsPerPage);
        }

        totalToppingPages():number{
            return Math.ceil(this.ToppingService.toppings.length / this.itemsPerPage);
        }

        openModal():void{
            var self = this;
            this.modalInstance = this.$uibModal.open({
                animation: true,
                templateUrl: 'main/detailsModal.html',
                size: 'md',
                scope: self.$scope
            });
        }
        
        closeModal():void{
            this.modalInstance.dismiss();
        }
    }

    angular.module('pizzaClient').controller('MainController', MainController);
}