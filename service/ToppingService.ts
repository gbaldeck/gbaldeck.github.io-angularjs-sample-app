module app.service{
    import IResourceService = angular.resource.IResourceService;
    import IResourceClass = angular.resource.IResourceClass;
    import IResource = angular.resource.IResource;
    import IResourceArray = angular.resource.IResourceArray;
    import IToppingItem = app.entity.IToppingItem;
    import IPromise = angular.IPromise;
    import IHttpPromise = angular.IHttpPromise;
    import IQService = angular.IQService;

    export interface IToppingService {
        toppings:IToppingItem[];
        fetchToppings():IPromise<any>;
        createTopping(name:string):IPromise<any>;
    }

    interface IToppingResource extends IResource<IToppingItem> {}

    class ToppingService implements IToppingService {

        private ToppingResource:IResourceClass<IToppingResource>;
        toppings:IToppingItem[];

        static $inject = ['$resource', '$q'];

        constructor($resource:IResourceService, private $q:IQService) {
            this.ToppingResource = $resource("https://pizzaserver.herokuapp.com/toppings");
        }

        fetchToppings():IPromise<any> {
            var deferred = this.$q.defer();

            this.ToppingResource.query({}).$promise.then(
                (data) => {
                    this.toppings = <any>data;
                    deferred.resolve();
                },
                (error) => {
                    console.log(error);
                    deferred.reject();
                }
            );

            return deferred.promise;
        }

        createTopping(name:string):IPromise<any> {
            var jsonTopping = {topping: {name: name}};
            var deferred = this.$q.defer();

            this.ToppingResource.save(jsonTopping,
                (data) =>{
                    this.toppings.push(data);
                    deferred.resolve();
                },
                (error) => {
                    deferred.reject();
                }
            );

            return deferred.promise;
        }
    }
    
    angular.module('pizzaClient').service('ToppingService', ToppingService);
}