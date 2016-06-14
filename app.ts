module app {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('pizzaClient', [
        'ui.router',
        'ui.bootstrap',
        'ngResource',
        'angularSpinner',
        'angular-ladda'
    ]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        // $urlRouterProvider.when('/dashboard', '/dashboard/overview');
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'main/main.html'
            });
    }])
}
