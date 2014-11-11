var app = angular.module('queue', ["firebase"]);

app.controller('queueController', ['$scope', function($scope) {
    
    $scope.queues = [
        { 'title': 'queue blah blah',
         'done': false}
    ];
    
    $scope.addQueue = function() {
        $scope.queues.push(
            {'title': $scope.newQueue, 'done': false}
        );
        $scope.newQueue = '';
    };
    $scope.clearCompleted = function() {
        $scope.queues = $scope.queues.filter(function(queue) {
            return !queue.done
        });
    }; 
    
}]);

app.service('qService', ['$firebase', function($firebase) {
    return $firebase(new Firebase("https://vanman-queue.firebaseio.com/videoQueues"));
}]);

app.controller('qController', ['$scope', 'qService', function($scope, qService) {
    $scope.queueDefault = { title: 'generic title',
                           sender: 'anon',
                           shoutOut: 'default shoutout',
                           image: '1234' };
    $scope.ques = qService.$asArray();
    //$scope.ques = $scope.fb.$asArray();
    
    $scope.addItem = function() {
        $scope.ques.$add($scope.queueDefault);
    }
    
    $scope.delete = function(index) {
        $scope.ques.$remove(index);
    }
    
    $scope.toggleDone = function(index) {
        console.log('clicked ' + index);
        $scope.ques[index].done = !$scope.ques[index].done;
        $scope.ques.$save(index);
    }
}]);