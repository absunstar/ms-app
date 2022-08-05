app.controller('register', function ($scope, $http) {

    $scope.busy = false;
  
    $scope.register = function () {
        $scope.error = '';
        $scope.busy = true;
        $http({
            method: 'POST',
            url: '/api/user/register',
            data: {
                $encript : '123',
                email: site.to123($scope.userEmail),
                password: site.to123($scope.userPassword)
            }
        }).then(function (response) {
           
            if (response.data.error) {
                $scope.error = response.data.error;
                $scope.busy = false;
            }
            if (response.data.user) {
                window.location.reload(true);
            }
        } , function(err){
            $scope.busy = false;
            $scope.error = err;
        });

    };


    $scope.addRegisterCustomer = function () {
        $scope.busy = true;
        $scope.user.type = 'customer';

        $http({
            method: "POST",
            url: "/api/user/add",
            data: $scope.user
        }).then(
            function (response) {
                $scope.busy = false;
                if (response.data.done) {
                    site.hideModal('#customerRegisterModal');

                    $scope.error = '';
                    $scope.busy = true;
                    $http({
                        method: 'POST',
                        url: '/api/user/login',
                        data: {
                            $encript: '123',
                            email: site.to123($scope.user.email),
                            password: site.to123($scope.user.password)
                        }
                    }).then(function (response) {

                        if (response.data.error) {
                            $scope.error = response.data.error;
                        }
                        if (response.data.done) {
                            window.location.reload(true);
                        }
                        $scope.busy = false;
                    }, function (err) {
                        $scope.busy = false;
                        $scope.error = err;
                    });


                } else {
                    $scope.error = response.data.error;
                }
            }
        )
    };

});