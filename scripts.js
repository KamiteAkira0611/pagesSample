window.addEventListener('load', function() {

  var config = JSON.parse(
    decodeURIComponent(escape(window.atob('@@config@@')))
  );

  var leeway = config.internalOptions.leeway;
  if (leeway) {
    var convertedLeeway = parseInt(leeway);
  
    if (!isNaN(convertedLeeway)) {
      config.internalOptions.leeway = convertedLeeway;
    }
  }

  var params = Object.assign({
    overrides: {
      __tenant: config.auth0Tenant,
      __token_issuer: config.authorizationServer.issuer
    },
    domain: config.auth0Domain,
    clientID: config.clientID,
    redirectUri: config.callbackURL,
    responseType: 'code'
  }, config.internalOptions);

  var webAuth = new auth0.WebAuth(params);
  var databaseConnection = 'Username-Password-Authentication';
  var captcha = webAuth.renderCaptcha(
    document.querySelector('.captcha-container')
  );

  function login(e) {
    e.preventDefault();
    var button = this;
    var username = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    button.disabled = true;
    webAuth.login({
      realm: databaseConnection,
      username: username,
      password: password,
      captcha: captcha.getValue()
    }, function(err) {
      if (err) displayError(err);
      button.disabled = false;
    });
  }

  function signup() {
    var button = this;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    button.disabled = true;
    webAuth.redirect.signupAndLogin({
      connection: databaseConnection,
      email: email,
      password: password,
      captcha: captcha.getValue()
    }, function(err) {
      if (err) displayError(err);
      button.disabled = false;
    });
  }

  function loginWithGoogle() {
    webAuth.authorize({
      connection: 'google-oauth2'
    }, function(err) {
      if (err) displayError(err);
    });
  }
  
  function loginWithTwitter() {
    webAuth.authorize({
      connection: 'twitter'
    }, function(err) {
      if (err) displayError(err);
    });
  }
  
  function loginWithFacebook() {
    webAuth.authorize({
      connection: 'facebook'
    }, function(err) {
      if (err) displayError(err);
    });
  }

  function displayError(err) {
    captcha.reload();
    var errorMessage = document.getElementById('error-message');
    errorMessage.innerHTML = err.policy || err.description;
    errorMessage.style.display = 'block';
  }

  document.getElementById('btn-login').addEventListener('click', login);
  document.getElementById('btn-google').addEventListener('click', loginWithGoogle);
  document.getElementById('btn-twitter').addEventListener('click', loginWithTwitter);
  document.getElementById('btn-facebook').addEventListener('click', loginWithFacebook);
  document.getElementById('btn-signup').addEventListener('click', signup);
});
