var app = angular.module("MyApp", ['ApiService','ngCookies'])

app.controller('RegistrationController', function ($scope, $http, $window) {
    $scope.ButtonClick = function () {

        var post = $http({
            method: "POST",
            url: "/api/Customers",
            dataType: "json",
            data: {
                customerid: $scope.CustomerID,
                name: $scope.Name,
                surname: $scope.Surname,
                email: $scope.Email,
                phone: $scope.Phone,
                password: $scope.Password
            },
            headers: { "Content-Type": "application/json" }
        }).then(function (success, response) {
            
            swal("Congrats " + $scope.Name + "!", "Your account is created!", "success");
            $scope.CustomerID = undefined;
            $scope.Name = undefined;
            $scope.Surname = undefined;
            $scope.Email = undefined;
            $scope.Phone = undefined;
            $scope.Password = undefined;
           
            }, function (error, response) {
          
                swal("Error", "Hey, " + $scope.Name + " Seems like an account is already associated with this ID Number!", "error");
                //$window.location.href = 'index.html';
            }
        );
    }
});

app.controller('CustomerTable', function ($scope, $http, AppApi) {
    $http({
        method: "GET",
        url: "http://localhost:44790/api/Customers"
    }).then(function mySuccess(response) {
        $scope.customerdetail = response.data;
    }, function myError(response) {
        $scope.customerdetail = response.statusText;
    });
    $scope.LoadTable = function () {
        $http({
            method: "GET",
            url: "http://localhost:44790/api/Customers"
        }).then(function mySuccess(response) {
            $scope.customerdetail = response.data;
        }, function myError(response) {
            $scope.customerdetail = response.statusText;
        });
    }
    $scope.DeleteCustomer = function (id) {
        AppApi.DeleteCustomer(id)
            .then(function (success, response) {
                $scope.LoadTable();
                
            }, function (error, response) {
                console.log("Could not deleted customer.");
            });
    };
});

app.controller('AdminProductTable', function ($scope, $http, $cookieStore, $cookies, userPersistenceService, AppApi) {
    $http({
        method: "GET",
        url: "http://localhost:44790/api/Products"
    }).then(function mySuccess(response) {
        $scope.productsData = response.data;

        var user = $cookies.getObject('currentUser');
        $scope.name = user.name;

    }, function myError(response) {
        $scope.products = response.statusText;
    });

    $http({
        method: "GET",
        url: "http://localhost:44790/api/Products"
    }).then(function mySuccess(response) {
        $scope.productsData = response.data;

        var user = $cookies.getObject('currentUser');
        $scope.name = user.name;

    }, function myError(response) {
        $scope.products = response.statusText;
    });
});

app.controller('ProductTable', function ($scope, $http, $cookieStore, $cookies, userPersistenceService, AppApi) {
    var formdata = new FormData();
    $http({
        method: "GET",
        url: "http://localhost:44790/api/Products"
    }).then(function mySuccess(response) {
        $scope.productsData = response.data;

        var user = $cookies.getObject('currentUser');
        $scope.name = user.name;

        }, function myError(response) {
            $scope.products = response.statusText;
        });

    $scope.LoadTable = function () {
        $http({
            method: "GET",
            url: "http://localhost:44790/api/Products"
        }).then(function mySuccess(response) {
            $scope.productsData = response.data;

            var user = $cookies.getObject('currentUser');
            $scope.name = user.name;

        }, function myError(response) {
            $scope.products = response.statusText;
        });
    };

    $http({
        method: "GET",
        url: "http://localhost:44790/api/Suppliers"
    }).then(function mySuccess(response) {
        $scope.names = response.data;

        var user = $cookies.getObject('currentUser');
        $scope.name = user.name;

    }, function myError(response) {
        $scope.products = response.statusText;
    });

    var obj = [];
    var id = 0;
    $scope.count = 0;
    $scope.items = $cookies.getObject("Cart");
    angular.forEach($scope.items, function (item) {
        $scope.count++;
    });

    $scope.addToCart = function (ID,Name, Price, Quantity) {
        id = id + 1;
        $scope.count = $scope.count + 1;
        obj.push({ ID: ID, name: Name, price: Price, quantity: 1 });
        $cookies.putObject("Cart", obj, { 'path': "/" });
        console.log(obj);

        //var items = $cookies.getObject("Cart");
        //var len = items.length;
        //for (var i = 0; i < len; i++) {
        //    if (items[i].name == Name) {
        //        items.splice(i, 1);
        //        $cookies.putObject("Cart", items, { 'path': "/" });
        //        break;
        //    }
        //}
    };

    $scope.getTotalAmount = function () {
        var i = 0;
        for (i = 0; i < $scope.myCart.length; i++){
           $scope.myCart.product.Price[i] * $scope.myCart.item.Price[i];
        };
        $scope.amount = 0.00;
    }

    $scope.GetImages = function ($files) {
        console.log("Activated");
        $scope.imagesrc = [];

        for (var g = 0; g < $files.length; g++) {
            var reader = new FileReader();
            reader.Filename = $files[g].name;

            reader.onload = function (event) {
                var image = {};
                image.Name = event.target.Filename;
                image.Size = (event.total / 1024).toFixed(2);
                image.Src = event.target.result;
                $scope.imagesrc.push(image);
                $scope.$apply();
            }
            reader.readAsDataURL($files[g]);
        };
        angular.forEach($files,
            function (value, key) {
                formdata.append(key, value);
                formdata.append("Name", $scope.productName);
                formdata.append("Price", $scope.productPrice);
                formdata.append("Quantity", $scope.productQuantity);
                formdata.append("Batch", $scope.productBatch);
                formdata.append("Supplier", $scope.productSupplier);
                formdata.append("StockThreshold", $scope.productStock);
                console.log(formdata);
            });

    };
    $scope.AddProduct = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:44790/api/Products',
            data: formdata,
            headers: {
                'Content-Type': undefined
            }
        }).then(function (success) {
            alert("Done");
            location.reload();
            }, function (error, response) {
                alert(JSON.stringify(error));
                console.log(JSON.stringify(error));
                
        });
        //var post = $http({
        //    method: "POST",
        //    url: "/api/Products",
        //    dataType: "json",
        //    data: { /*ID: $scope.driverID,*/ Name: $scope.productName, Price: $scope.productPrice, Quantity: $scope.productQuantity},
        //    headers: { "Content-Type": "application/json" }
        //}).then(function (success, response) {
        //    //alert("Product added!");
        //}, function (error, response) {
        //    //alert("Product could not be added");
        //    //$window.location.href = 'index.html';
        //});
    }

    $scope.EditProduct = function () {
        var Product = {
            'ID': $scope.productID,
            'Name': $scope.productName,
            'Price': $scope.productPrice,
            'Quantity': $scope.productQuantity
        };
        AppApi.UpdateProduct(Product)
            .then(function (success, response) {
                //alert("Product updated");
                location.reload();
            }, function (error, response) {
                //alert("Could not update.");
            });
    }

    $scope.DeleteProduct = function (ID) {
        AppApi.DeleteProduct(ID)
            .then(function (success, response) {
                $scope.LoadTable();
            }, function (error, response) {
                //alert("Could not delete product.");
            });
    }

    $scope.logoutUser = function () {
        userPersistenceService.clearCookieData();
        location.reload();
    }

});

app.controller('ProductDetailView', function ($scope, $http, $window) {
    var ID = ProductView.get();
    $http({
        method: "GET",
        url: "http://localhost:18617/api/Products/4",

    }).then(function mySuccess(response) {
        $scope.productDetail = response.data;
    }, function myError(response) {
        //alert("Could not get product details");
    });
});

app.controller('StoreController', ['$scope', '$cookies', function ($scope, $cookieStore, $http) {

    $http({
        method: "GET",
        url: "http://localhost:44790/api/Products"
    }).then(function mySuccess(response) {
        $scope.products = response.data;
        }, function myError(response) {
           $scope.products = response.statusText;
        });

    $scope.addItemToCart = function (product) {
        //alert("s");
    };

    $scope.products = productsData;
    $scope.cart = [];
    $scope.total = 8;
    /*
      if ($cookieStore.get('cart') !== null) {
                  $scope.cart =  $cookieStore.get('cart');
      }
      */

    if (!angular.isUndefined($cookies.get('total'))) {
        $scope.total = parseFloat($cookies.get('total'));
    }
    //Sepetimiz daha önceden tanımlıysa onu çekelim
    if (!angular.isUndefined($cookies.get('cart'))) {
        $scope.cart = $cookies.getObject('cart');
    }

    $scope.addItemToCart = function (product) {

        if ($scope.cart.length === 0) {
            product.count = 1;
            $scope.cart.push(product);

        } else {
            var repeat = false;
            for (var i = 0; i < $scope.cart.length; i++) {
                if ($scope.cart[i].id === product.id) {
                    repeat = true;
                    $scope.cart[i].count += 1;
                    $scope.cart
                }
            }
            if (!repeat) {
                product.count = 1;
                $scope.cart.push(product);
            }
        }
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
        $scope.cart = $cookies.getObject('cart');

        $scope.total += parseFloat(product.price);
        $cookies.put('total', $scope.total, { 'expires': expireDate });
    };

    $scope.removeItemCart = function (product) {

        if (product.count > 1) {
            product.count -= 1;
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 1);
            $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
            $scope.cart = $cookies.getObject('cart');
        }
        else if (product.count === 1) {
            var index = $scope.cart.indexOf(product);
            $scope.cart.splice(index, 1);
            expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 1);
            $cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
            $scope.cart = $cookies.getObject('cart');

        }

        $scope.total -= parseFloat(product.price);
        $cookies.put('total', $scope.total, { 'expires': expireDate });

    };

}]);

app.controller('LoginController', function ($scope, $http, AppApi, $rootScope, $window, $cookies, userPersistenceService) {
    $scope.Login = function () {
        on();
        AppApi.AttemptLogin($scope.Email, $scope.Password)
            .then(function (response, xhr)
            {
                if (response.data == null) {
                    off();
                    swal("Error", "Login unsuccessful", "error");
                } else {
                    off();
                    console.log(response.data);
                    console.log(response.status);
                    //$scope.name = response.data.Surname;
                    //userPersistenceService.setCookieData(response.data.Name);
                    var user = {
                        id: response.data.CustomerID,
                        name: response.data.Name,
                        surname: response.data.Surname,
                        email: response.data.Email,
                        phone: response.data.Phone
                    };
                    userPersistenceService.setCookieData(user);
                   
                    location.href = "../Index.html";
                }
            }), function (error) {
                //alert("Error");
            }
    };
});

app.controller('DriverTable', function ($scope, $http, AppApi, CurrentDriver) {
    $http({
        method: "GET",
        url: "http://localhost:44790/api/Drivers"
    }).then(function mySuccess(response) {
        $scope.driverdetail = response.data;
    }, function myError(response) {
        $scope.customerdetail = response.statusText;
        });

    $scope.names = ["Emil", "Tobias", "Linus"];

    $scope.LoadTable = function () {
        $http({
            method: "GET",
            url: "http://localhost:44790/api/Drivers"
        }).then(function mySuccess(response) {
            $scope.driverdetail = response.data;
        }, function myError(response) {
            $scope.customerdetail = response.statusText;
        });
    }
    $scope.LoginDriver = function () {
        $scope.editdriverID = "fdsfds";
        var Driver = { 'Email': $scope.LoginEmail, 'Password': $scope.Password };
        AppApi.LoginDriver(Driver)
            .then(function (response) {
                if (response.data === null) {
                    //alert("Please check your credentials and try again");
                } else {
                    var user = {
                        id: response.data.DriverID,
                        name: response.data.Name,
                        surname: response.data.Surname,
                        email: response.data.Email
                    };
                    $scope.drivername = response.data.Name;
                    CurrentDriver.setCookieData(user);
                    //alert("Hello "+$scope.drivername);
                    location.href = "../Account/Driver/Dashboard.html";
                }
            }), function (error) {
                swal("Error", "Login unsuccessful", "error");

            }
    };
    
    $scope.Edit = function (id) {
      
        for (i in $scope.driverdetail) {
            if ($scope.driverdetail[i].DriverID === id) {
                $scope.currentDriver = {
                    driverid: $scope.driverdetail[i].DriverID
                }
                console.log($scope.currentDriver.driverid);
            };
        }
    };
    

    $scope.AddDriver = function () {
        var Driver = {
            'DriverID': $scope.driverID,
            'Name': $scope.driverName,
            'Surname': $scope.driverSurname,
            'Email': $scope.driverEmail,
            'PhoneNumber': $scope.driverPhone,
            'LicenseNumber': $scope.driverLicense,
            'DriverCode': $scope.driverCode,
            'Password': $scope.driverPassword,
        };
        var post = $http({
            method: "POST",
            url: "/api/Drivers",
            dataType: "json",
            data: Driver,
            headers: { "Content-Type": "application/json" }
        }).then(function (success, response) {
            $scope.LoadTable();
            console.log("sdsd");
        }, function (error, response) {
            //alert("Driver could not be registered");
            //$window.location.href = 'index.html';
        });
    }

    $scope.UpdateDriver = function () {
        var Driver = {
            'ID': $scope.editdriverID,
            'Name': $scope.editdriverName,
            'Surname': $scope.editdriverSurname,
            'Email': $scope.editdriverEmail,
            'PhoneNumber': $scope.editdriverPhone,
            'LicenseNumber': $scope.editdriverLicense,
            'DriverCode': $scope.editdriverCode,
            'Password': $scope.editPassword
        };
        AppApi.UpdateDriver(Driver)
            .then(function (success, response) {
                //alert("Driver updated");
                location.reload();
            }, function (error, response) {
                console.log("Could not delete driver");
            });
    }

    $scope.DeleteDriver = function (Driver) {
        
        AppApi.DeleteDriver(Driver)
            .then(function (success, response) {
                $scope.LoadTable();
                
            }, function (error, response) {
                //alert("Could not delete driver.");
            });
    }
});

app.controller('CustomerDetail', function ($scope, $http, AppApi, $rootScope, $window) {
    $scope.LoadTable = function () {
        $http({
            method: "GET",
            url: "http://localhost:44790/api/Customers"
        }).then(function mySuccess(response) {
            $scope.customerdetail = response.data;
        }, function myError(response) {
            $scope.customerdetail = response.statusText;
        });
    }

    $scope.UpdateCustomer = function () {
        var Customer = {
            'ID': $scope.cusID,
            'Name': $scope.cusName,
            'Surname': $scope.cusSurname,
            'Email': $scope.cusEmail,
            'Phone': $scope.cusPhone,
            'Password': $scope.cusPassword
        };

        AppApi.EditCustomer(Customer)
            .then(function (success, response) {
                //alert("Customer details updated successfully");
                location.reload();
            }, function (error, response) {
                //alert("Could details could not be updated.");
            });
    };

    $scope.DeleteCustomer = function (id) {
        AppApi.DeleteCustomer(id)
            .then(function (success, response) {
                $scope.LoadTable();
                location.reload();
            }, function (error, response) {
                console.log("Could not deleted customer.");
            });
    };
});

app.controller('CartController', function ($scope, $http, Cart, $cookies, userPersistenceService) {
    var userData = userPersistenceService.getCookieData();
    $scope.name = userData.name;
    $scope.items = $cookies.getObject("Cart");
    $scope.quantity = 1;
    $scope.total = function () {
        var total = 0;
        var subtotal = 0;
        angular.forEach($scope.items, function (item) {
            subtotal += item.price * $scope.quantity;
            total = subtotal * 0.15 + subtotal;
        });
        return total;
    }

    $scope.count = 0;
    angular.forEach($scope.items, function (item) {
        $scope.count++;
    });

    $scope.updateTotal = function () {
        angular.forEach($scope.items, function (item) {
            subtotal += item.price * $scope.quantity;
            total = subtotal * 0.15 + subtotal;
        });
        return total;
    }

    $scope.removeItem = function (Name) {
        var items = $cookies.getObject("Cart");
        for (var i = 0; i < items.length; i++) {
            if (items[i].name === Name) {
                items.splice(i, 1);
                $cookies.putObject("Cart", items, { 'path': "/" });
                break;
            }
        }
        $scope.items = $cookies.getObject("Cart");
    }

    
});

app.controller('AdminController', function ($http,$scope, userPersistenceService) {
    var user = userPersistenceService.getCookieData();
    $scope.name = user.name

    $http({
        method: "GET",
        url: "http://localhost:44790/api/Drivers"
    }).then(function mySuccess(response) {
        $scope.driverdetail = response.data;
    }, function myError(response) {
        $scope.customerdetail = response.statusText;
        });

    $scope.Edit = function (id) {
        console.log(id);
        for (i in $scope.driverdetail) {
            if ($scope.driverdetail[i].DriverID === id) {
                $scope.currentDriver = {
                    driverid: $scope.driverdetail[i].DriverID
                }
                console.log($scope.currentDriver.driverid);
            };
        }
    };

    $scope.logoutUser = function () {
        userPersistenceService.clearCookieData();
        location.reload();
        location.href = "../Index.html";
    }
});

app.controller('AdminTable', function ($scope, userPersistenceService, AppApi) {
    $scope.Login = function () {
        AppApi.AdminLogin($scope.adminLoginEmail, $scope.adminLoginPassword)
            .then(function (response) {
                if (response.data === null) {
                    //alert("Sorry, incorrect credentials");
                } else {
                    $scope.name = response.data.Surname;
                    //userPersistenceService.setCookieData(response.data.Name);
                    var user = {
                        name: response.data.Name,
                        surname: response.data.Surname,
                        email: response.data.Email,
                        role: "Administrator"
                    };
                    userPersistenceService.setCookieData(user);
                   
                    setTimeout(location.href = "../Administrator/Index.html", 2500);
                }
            }), function (error) {
                //alert("");
            }
    };

    $scope.logoutUser = function () {
        console.log("Activated");
    }
});

app.controller('OrderController', function ($http, $scope, userPersistenceService, $cookies) {
    var user = userPersistenceService.getCookieData();
    $scope.name = user.name;
    console.log($scope.name);
    $scope.items = $cookies.getObject("Cart");

    $scope.quantity = 1;
    $scope.total = function () {
        var total = 0;
        var subtotal = 0;
        angular.forEach($scope.items, function (item) {
            subtotal += item.price * $scope.quantity;
            total = subtotal * 0.15 + subtotal;
        });
        return total;
        $scope.totalAmount = total;
    }

    var Order = {
        'Email': $scope.email,
        'RecieverName': $scope.fullname,
        'RecieverCode': $scope.recieversurname,
        'Address': $scope.address,
        'City': $scope.city,
        'Suburb': $scope.suburb,
        'PostalCode': $scope.postalcode,
        'Province': $scope.provice,
        'TotalPrice': $scope.totalprice
    };
    $scope.ConfirmOrder = function () {
        console.log("Hello!");
        $http({
            method: "POST",
            url: "api/Orders",
            data: Order,
            dataType: "json",
            headers: { "Content-Type": "application/json" }
        }).then(function (success, response) {
            //alert("Order confirmed!");
            location.href = "../Account/OrderReview.html"
        }, function (error, response) {
            //alert("Could not finalise your order");
        });
    };

    $scope.resetOrder = function () {
        $scope.city = undefined;
    }
});

app.controller('CheckoutController', function ($rootScope,$scope, $http, $cookieStore, $cookies, userPersistenceService) {
    var userData = userPersistenceService.getCookieData();
    $scope.id = userData.id;
    $scope.name = userData.name;
    $scope.email = userData.email;
    $scope.surname = userData.surname;

    var driversID = [];


    $http({
        method: "get",
        url: "http://localhost:44790/api/Drivers",
        headers: { "Content-Type": "application/json" }
    }).then(function success(response)
    {
        $scope.drivers = response.data;
        console.log();
        angular.forEach($scope.drivers, function (item) {
            driversID.push(item.DriverID);
        });
        var driverid = driversID[Math.floor(Math.random() * driversID.length)];
        console.log(driverid);
        $scope.driverID = driverid;
        //Insert to card table 
        $scope.saveOrder = function () {
            $http({
                method: "post",
                url: "http://localhost:44790/api/CardInformations",
                dataType: "json",
                data: {
                    Address: $scope.address,
                    CustomerID: $scope.id,
                    CVV: $scope.cvv,
                    City: $scope.city,
                    CreditCardNumber: $scope.cardnumber,
                    Email: $scope.email,
                    ExpMonth: $scope.month,
                    ExpYear: $scope.year,
                    Name: $scope.name,
                    NameOnCard: $scope.cardname,
                    State: $scope.state,
                    Zip: $scope.zip},
                headers: { "Content-Type": "application/json" }
            }).then(function (success, response) {
                
                //alert("done");
                //Insert to  order
                $http({
                    method: "post",
                    url: "http://localhost:44790/api/Orders",
                    dataType: "json",
                    data: {
                        DriverID: $scope.driverID,
                        CustomerID: userData.id,
                        Name: $scope.name,
                        Surname: $scope.surname,
                        Email: $scope.email,
                        Address: $scope.address,
                        OrderStatus: "Pending"},
                    headers: { "Content-Type": "application/json" }
                }).then(function (success, response) {
                    //alert("sadas");
                    location.href = "../Account/OrderReview.html";
                }, function (error, response) {
                    //alert("Looks like we already have your card information, so sorry.");
                });

            }, function (error, response) {
                //alert("There was an error, sorry.");
            });
        }
    }, function (error, response) {
        //alert("There was an error, sorry.");
        });
})

app.controller('SupplierLogin', function ($scope, $http, AppApi, $cookieStore, $cookies, CurrentSupplier) {
    $scope.SupplierLogin = function () {
        var Supplier = { 'SupplierEmail': $scope.email, 'Password': $scope.password };
        AppApi.SupplierLogin(Supplier)
            .then(function (response) {
                if (response.data === null) {
                    //alert("Wrong")
                } else {
                    console.log(response.data["0"].SupplierName);
                    var user = { 'name': response.data["0"].SupplierName, 'email': response.data["0"].SupplierEmail};
                    CurrentSupplier.setCookieData(user);
                    console.log("Successful login" + response.data.SupplierName);
                    location.href = "../Supplier/Index.html";
                }
            }), function (error) {
                console.log("Unsuccessful login");
            }
    }
});

app.controller('SupplierController', function ($scope, $http, AppApi, $cookieStore, $cookies, CurrentSupplier) {
    var user = $cookies.getObject('currentSupplier');
    $scope.supplier = user.name;
    console.log(user.name);

    var Supplier = { 'name': user.name };

    AppApi.GetSupplierData(Supplier).then(function (response) {
        $scope.data = response.data;
        console.log(response.data.Supplier.Products);
    }), function (error) {
        console.log("Unsuccessful login");
    }
    

    $scope.Logout = function () {
        CurrentSupplier.clearCookieData();
        location.href = "../Account/SupplierAccount.html";
    }

    $scope.AddBatch = function (product) {
        console.log(product+"asda");
    }

});

app.controller('SupplierBatch', function ($scope, $http, AppApi, $cookieStore, $cookies, CurrentSupplier) {
    

});

app.controller('SupplierTable', function ($scope, $http, AppApi, $cookieStore, $cookies, CurrentSupplier) {
    $http({
        method: "GET",
        url: "http://localhost:44790/api/Products"
    }).then(function mySuccess(response) {
        $scope.productsData = response.data;

        var user = $cookies.getObject('currentSupplier');
        $scope.supplier = user.name;

    }, function myError(response) {
        $scope.products = response.statusText;
    });
});

app.controller('DriverDashboardController', function ($scope, $http, AppApi, $cookieStore, $cookies, CurrentDriver) {
    var user = CurrentDriver.getCookieData();
    var filterData = [];
    $scope.driverid = user.id;
    $scope.drivername = user.name;
    $scope.driversurname = user.surname;
    $scope.driveremail = user.email;
    if ($scope.drivername === undefined) {
        location.href = "../../Account/DriverAccount.html";
    }
    else {

    }
 
    $http({
        method: "GET",
        url: "http://localhost:44790/api/Orders"
    }).then(function mySuccess(response) {
        $scope.productData = response.data;
        angular.forEach($scope.productData, function (key, value) {
            if ($scope.driverid == key.DriverID) {
                filterData.push(key);
                $scope.data = filterData;
            }
        });
    }, function myError(response) {
        console.log("Not done");
    });

    $scope.UpdateOrderStatus = function (Order) {
        AppApi.UpdateOrderStatus(Order)
            .then(function (response, success) {
                console.log("Successfully updated");
        }), function (error) {
            console.log(error);
        }
    };

    $scope.logoutDriver = function () {
        CurrentDriver.clearCookieData();
        location.href = "../../Account/DriverAccount.html";
    }
});

app.controller('MyAccountController', function ($scope, $http, AppApi, $cookieStore, $cookies, userPersistenceService) {
    var user = userPersistenceService.getCookieData();
    var filterData = [];
    $scope.ID = user.id;
    $scope.Name = user.name;
    $scope.Surname = user.surname;
    $scope.Email = user.email;
    $scope.Phone = user.phone;
})

app.controller('MyOrderController', function ($scope, $http, userPersistenceService, $cookies) {
    var user = userPersistenceService.getCookieData();
    var filterData = [];

    $scope.ID = user.id;
    $scope.Name = user.name;
    $scope.Surname = user.surname;
    $scope.Email = user.email;
    $scope.Phone = user.phone;

    $scope.count = 0;
    $scope.items = $cookies.getObject("Cart");
    angular.forEach($scope.items, function (item) {
        $scope.count++;
    });

    $http({
        method: "GET",
        url: "http://localhost:44790/api/Orders"
    }).then(function mySuccess(response) {
        $scope.productData = response.data;
        angular.forEach($scope.productData, function (key, value) {
            if ($scope.Email == key.Email) {
                console.log(key.Email);
                filterData.push(key);
                $scope.data = filterData;
                console.log($scope.data);
            }

        });
    }, function myError(response) {
        console.log("Not done");
        });

    $scope.logoutUser = function () {
        userPersistenceService.clearCookieData();
        location.reload();
        location.href = "../Index.html";
    }
})
function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}