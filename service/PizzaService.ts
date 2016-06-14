module app.service {
    import IResourceService = angular.resource.IResourceService;
    import IResourceClass = angular.resource.IResourceClass;
    import IResource = angular.resource.IResource;
    import IPizzaItem = app.entity.IPizzaItem;
    import PizzaItem = app.entity.PizzaItem;
    import IResourceArray = angular.resource.IResourceArray;
    import IToppingItem = app.entity.IToppingItem;
    import IPromise = angular.IPromise;
    import IHttpPromise = angular.IHttpPromise;
    import IQService = angular.IQService;

    export interface IPizzaService {
        pizzas:IPizzaItem[];
        getPizzaToppings(pizzaId:string):IPromise<any>;
        fetchPizzas():IPromise<any>;
        createPizza(name:string, desc:string):IPromise<any>;
        addTopping(pizzaId:string, toppingId:string):IPromise<any>;
    }

    interface IPizzaResource extends IResource<IPizzaItem> {}

    class PizzaService implements IPizzaService {

        private PizzaResource:IResourceClass<IPizzaResource>;
        pizzas:IPizzaItem[];

        static $inject = ['$resource', '$q'];

        constructor($resource:IResourceService, private $q:IQService) {
            this.PizzaResource = $resource("https://pizzaserver.herokuapp.com/pizzas/:id/:toppings", {id: '@id'});
        }

        fetchPizzas():IPromise<any> {
            var deferred = this.$q.defer();
            
            this.PizzaResource.query({}).$promise.then(
                (data) => {
                    this.pizzas = <any>data;
                    deferred.resolve();
                },
                (error) => {
                    console.log(error);
                    deferred.reject();
                }
            );
            
            return deferred.promise;
        }

        getPizzaToppings(pizzaId:string):IPromise<any> {
            return this.PizzaResource.query({id: pizzaId, toppings: 'toppings'}).$promise;
        }

        createPizza(name:string, desc:string):IPromise<any>{
            var deferred = this.$q.defer();
            var jsonPizza = {pizza: {name: name, description: desc}};

            this.PizzaResource.save({}, jsonPizza).$promise.then(
                (data) =>{
                    this.pizzas.push(data);
                    deferred.resolve();
                },
                (error) => {
                    deferred.reject();
                }
            );
            
            return deferred.promise;
        }
        
        addTopping(pizzaId:string, toppingId:string):IPromise<any>{
            return this.PizzaResource.save({id: pizzaId, toppings: 'toppings'}, {topping_id: toppingId}).$promise;
        }
    }

    angular.module('pizzaClient').service('PizzaService', PizzaService);
}