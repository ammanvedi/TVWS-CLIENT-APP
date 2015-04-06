
/**
 * @ngdoc controller
 * @name clientAngularApp.controller.RegisterCtrl
 * @description
 * Controller to mediate creation of user accounts and login to existing accounts
 */
angular.module('clientAngularApp')
  .controller('RegisterCtrl', ['$location', '$rootScope', '$scope','MeasureSpaceAPIService', 'CookieService' ,function ($location, $rootScope, $scope, MeasureSpaceAPIService, CookieService) {




  	$scope.loginUser = function()
  	{
  		MeasureSpaceAPIService.loginUser( $('input[name="uname"]').val(),
                                        $('input[name="loginpass"]').val(),
                                        $scope.successLogin,
                                        $scope.failedLogin
                                      );
  	}

    $scope.failedLogin = function(data)
    {
      console.log("failure");
      console.log(data);
    }

    $scope.successLogin = function(data)
    {
      console.log("success");
      console.log(data);
      CookieService.storeUserData(data);
      CookieService.setLoggedIn();
      console.log("from cookie");
      console.log("login status : " + CookieService.LoggedIn);
      console.log(CookieService.getToken());
      $location.path("/me");
    }

  	$scope.registerUser = function()
  	{
  		console.log("HAHHA");
  		if(!$scope.validateform(
			 				$('input[name="email"]').val(),
							$('input[name="password"]').val(),
							$('input[name="passwordverify"]').val(),
							$('input[name="fname"]').val(),
							$('input[name="sname"]').val()
  							))
  		{
  			  		MeasureSpaceAPIService.registerUser(
  											$('input[name="email"]').val(),
  											$('input[name="password"]').val(),
  											$('input[name="fname"]').val(),
  											$('input[name="sname"]').val(), 
  											$scope.successregistration,
  											$scope.failedregistration
  											);
  		}



  	}

  	$scope.validateform = function(email, pass1, pass2, fname, sname)
  	{

  		var error_detected = false;

  		$('.inputTooltip').css('opacity', '0.0');

  		if(pass1 != pass2)
  		{
  			//passwords do not match
  			$('#passwordverify').addClass("error");
  			$('#passwordverifyerr').css('opacity', '1.0');
  			error_detected = true;
  		}else
  		{
  			$('#passwordverify').removeClass("error");
  		}

  		if(!new RegExp("^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\.\\w{2,3})+$").test(email))
  		{
  			//email failed
  			$('#email').addClass("error");
  			$('#emailerr').css('opacity', '1.0');
  			error_detected = true;
  		}else
  		{
  			$('#email').removeClass("error");
  		}

  		if(new RegExp("^([\\w]*\\s[\\w]*)+$").test(fname) || (fname == ""))
  		{
  			$('#fname').addClass("error");
  			$('#fnameerr').css('opacity', '1.0');
  			error_detected = true;
  		}else
  		{
  			$('#fname').removeClass("error");
  		}

  		if(new RegExp("^([\\w]*\\s[\\w]*)+$").test(sname) || (sname == ""))
  		{
  			$('#sname').addClass("error");
  			$('#snameerr').css('opacity', '1.0');
  			error_detected = true;
  		}else
  		{
  			$('#sname').removeClass("error");
  		}

  		if(!(new RegExp("^[^\\s]+$").test(pass1)) || (pass1 == ""))
  		{
  			$('#password').addClass("error");
  			$('#passworderr').css('opacity', '1.0');
  			error_detected = true;
  		}else
  		{
  			$('#password').removeClass("error");
  		}

  		return error_detected;
  	}

  	$scope.failedregistration = function(data)
  	{
  		console.log(data);

  	}

  	$scope.successregistration = function(data)
  	{
  		console.log(data);
  		
  		//allow user to log in
  		//hide the sign up box
  		$(".signupbox").css("width", "0px");
  		$(".signupbox").css("opacity", "0");
  		$(".vertdivider").css("opacity", "0");
  		
  	}

  }]);