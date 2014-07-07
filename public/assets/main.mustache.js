(function(window) {
 can.view.preloadStringRenderer('apps_main_components_auth_change-password_change-password_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<form class=\"well\" role=\"form\" can-submit=\"changePassword\"",can.view.pending({attrs: ['can-submit'], scope: scope,options: options}),">");___v1ew.push(
"\n\t<h3>Change Password</h3>\n\t<p>Enter and confirm your new password</p>");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'form',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"success"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"  <div class=\"bg-success\"><p>Password changed successfully.</p></div>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"  ");___v1ew.push(
can.view.txt(
0,
'form',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"passwordMismatch"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\n  <div class=\"bg-danger\"><p>Passwords must match.</p></div>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"  ");___v1ew.push(
can.view.txt(
0,
'form',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"passwordTooShort"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\n\t<div class=\"bg-danger\"><p>Password must be at least 6 characters long.</p></div>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"  <input type=\"password\" class=\"form-control top\" placeholder=\"New Password\" required can-value=\"password\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),"/>");___v1ew.push(
"\n  <input type=\"password\" class=\"form-control bottom\" placeholder=\"Confirm Password\" required can-value=\"password2\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),"/>");___v1ew.push(
"\n  <div class=\"signup-messages bg-danger\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'div',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"notVerified"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"      <p>That account has not been verified.  Please check your email and click the verification link.</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"  </div>\n  <br/>\n  <button class=\"btn btn-success\" type=\"submit\">Change Password</button>\n</form>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_auth_login_login_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<div class=\"col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3\">\n  <h2>Login</h2>\n  <p>Enter your email and password</p>\n  <div id=\"email-login-error\"></div>\n  <form role=\"form\" can-submit=\"login\"",can.view.pending({attrs: ['can-submit'], scope: scope,options: options}),">");___v1ew.push(
"\n    <input type=\"text\" class=\"form-control top\" placeholder=\"Email\" required autofocus=\"\" can-value=\"email\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),"/>");___v1ew.push(
"\n    <input type=\"password\" class=\"form-control bottom\" placeholder=\"Password\" required can-value=\"password\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),"/>");___v1ew.push(
"\n    <div class=\"signup-messages bg-danger\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'div',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"notVerified"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"        <p>That account has not been verified.  Please check your email and click the verification link.</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"      ");___v1ew.push(
can.view.txt(
0,
'div',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"invalidLogin"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\n        <p>Email address or password incorrect. <button class=\"btn btn-link\" can-click=\"resetPassword\"",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
"Reset Password</button></p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"    </div>\n    <br/>\n    <button class=\"btn btn-lg btn-success btn-block\" type=\"submit\">Sign in</button>\n    <a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'signup')));___v1ew.push(
"\" class=\"btn btn-block btn-link cancel\" type=\"button\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"No account? Get signed up</a>\n  </form>\n</div>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_auth_my-account_my-account_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<div class=\"page\" id=\"my-account\">\n\t<h2>My Account</h2>\n\t<div class=\"row\">\n\t\t<div class=\"col-md-8\">\n\t\t\t<p>If there were any details about your account to show, they would be shown here.</p>\n\t\t</div>\n\t\t<div class=\"col-md-4\">\n\t\t\t<change-password",can.view.pending({tagName:'change-password',scope: scope,options: options}));___v1ew.push(
"></change-password>\n\t\t</div>\n\t</div>\n</div>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_auth_passwordchange_passwordchange_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"\n<div class=\"col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3\">\n  <form id=\"loginform\" class=\"form-signin\" role=\"form\" can-submit=\"send\"",can.view.pending({attrs: ['can-submit'], scope: scope,options: options}),">");___v1ew.push(
"\n    <h2>Password Change Code</h2>\n    <p>Enter the code from the email we sent you.</p>\n    <input type=\"text\" class=\"form-control\" placeholder=\"Password Reset Code\" required  can-value=\"secret\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),"/>");___v1ew.push(
"\n    <br/>\n    <p>Enter and confirm your new password.</p>\n    <input type=\"password\" class=\"form-control top\" placeholder=\"New Password\" autofocus=\"\" required can-value=\"password\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),"/>");___v1ew.push(
"\n    <input type=\"password\" class=\"form-control bottom\" placeholder=\"Confirm New Password\" required can-value=\"password2\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),"/>");___v1ew.push(
"\n    <div class=\"signup-messages bg-danger\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'div',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"invalidCode"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"        <p>That code has already been used. Please delete the email and <a href=\"#\" can-click=\"tryagain\"",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
" request a new one here</a>.</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"    </div>\n    <br/>\n    <button class=\"btn btn-lg btn-success btn-block\" type=\"submit\">Reset Password</button>\n    <button class=\"btn btn-block btn-link cancel\" type=\"button\" can-click=\"tryagain\"",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
"Didn't get the email? Try again</button>\n  </form>\n</div>\n");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_auth_passwordchangesuccess_passwordchangesuccess_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"\n<div class=\"col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3\">\n  <form id=\"loginform\" class=\"form-signin\" role=\"form\" can-submit=\"done\"",can.view.pending({attrs: ['can-submit'], scope: scope,options: options}),">");___v1ew.push(
"\n    <h2>Password Change Successful</h2>\n    <p ");___v1ew.push(
can.view.txt(2,'p','style',this,function(){var ___v1ew = [];___v1ew.push(
"style=\"");___v1ew.push(
"font-size:18px;\"");return ___v1ew.join('')}));
___v1ew.push(
">Please <strong>delete the confirmation email</strong>. It has expired for your security.</p>\n    <a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'home')));___v1ew.push(
"\" class=\"btn btn-lg btn-success btn-block\" type=\"submit\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"Log me in</a>\n  </form>\n</div>\n");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_auth_passwordemail_passwordemail_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<div class=\"col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3\">\n  <h2>Reset Password</h2>\n  <p>Enter your email address to receive the password reset code.</p>\n  <form id=\"loginform\" class=\"form-signin\" role=\"form\" can-submit=\"send\"",can.view.pending({attrs: ['can-submit'], scope: scope,options: options}),">");___v1ew.push(
"\n    <input type=\"text\" class=\"form-control\" placeholder=\"Email Address\" required autofocus=\"\" can-value=\"email\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),"/>");___v1ew.push(
"\n    <div class=\"signup-messages bg-danger\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'div',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"nonexistent"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"        <p>That account does not exist.</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"    </div>\n    <br/>\n    <button class=\"btn btn-lg btn-success btn-block\" type=\"submit\">Reset Password</button>\n    <a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'login')));___v1ew.push(
"\" class=\"btn btn-block btn-link cancel\" type=\"button\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"Already signed up? Login</a>\n  </form>\n</div>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_auth_signup_signup_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<div class=\"col-md-6 col-md-offset-3\">\n  <form id=\"signupform\" class=\"form-signin\" role=\"form\">\n  <h2>Email Signup</h2>\n  <div id=\"signup-email-error-message\"> </div>\n    <p>Enter &amp; confirm your email address.</p>\n    <div>\n      <input can-value=\"user.email\" type=\"text\" class=\"form-control top\" placeholder=\"email\" required=\"\" autofocus=\"\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),">");___v1ew.push(
"\n      <input can-value=\"user.email2\" type=\"text\" class=\"form-control bottom\" placeholder=\"email again\" required=\"\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),">");___v1ew.push(
"\n      <div class=\"signup-messages ");___v1ew.push(
can.view.txt(
true,
'div',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"emailMismatch"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"bg-danger");return ___v1ew.join("");}}])));___v1ew.push(
" ");___v1ew.push(
can.view.txt(
true,
'div',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"emailTaken"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"bg-danger");return ___v1ew.join("");}}])));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'div',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"emailMismatch"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"          <p>Email addresses do not match.</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"        ");___v1ew.push(
can.view.txt(
0,
'div',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"emailTaken"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\n          <p>That email address is already in use.</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"      </div>\n    </div>\n    <br/>\n    <p>Enter &amp; confirm your password.</p>\n    <div>\n      <input can-value=\"user.password\" type=\"password\" class=\"form-control top\" placeholder=\"password\" required=\"\" minlength=\"6\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),">");___v1ew.push(
"\n      <input can-value=\"user.password2\" type=\"password\" class=\"form-control bottom\" placeholder=\"password again\" required=\"\" minlength=\"6\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),">");___v1ew.push(
"\n      <div class=\"signup-messages bg-danger\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'div',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"passwordMismatch"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"          <p>Passwords do not match.</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"      </div>\n    </div>\n\t\t<br/>\n    <button class=\"btn btn-lg btn-success btn-block\" can-click=\"signup\"",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
"Create Account</button>\n    <a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'login')));___v1ew.push(
"\" class=\"btn btn-block btn-link cancel\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"Already signed up? Login</a>\n  </form>\n</div>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_auth_verify_verify_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<div class=\"col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3\">\n  <h2>Verify Your Account</h2>\n  <p>Please enter the code from the verification email we sent you.</p>\n  <form id=\"loginform\" class=\"form-signin\" role=\"form\" can-submit=\"verify\"",can.view.pending({attrs: ['can-submit'], scope: scope,options: options}),">");___v1ew.push(
"\n    <input type=\"text\" class=\"form-control\" placeholder=\"Secret Code\" required autofocus=\"\" can-value=\"secret\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),"/>");___v1ew.push(
"\n    <div class=\"signup-messages bg-danger\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'div',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"notVerified"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"        <p>That account has not been verified.  Please check your email and click the verification link.</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"    </div>\n    <br/>\n    <button class=\"btn btn-lg btn-success btn-block\" type=\"submit\">Verify Code</button>\n    <a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'login')));___v1ew.push(
"\" class=\"btn btn-block btn-link cancel\" type=\"button\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"Already signed up? Login</a>\n  </form>\n</div>\n");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_home_home_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<h2>Welcome to the home page.</h2>");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'undefined',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"isLoggedIn"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\t<p>You have ");___v1ew.push(
can.view.txt(
1,
'p',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"secrets.length"})));___v1ew.push(
" secrets</p>\n\t<p>You have ");___v1ew.push(
can.view.txt(
1,
'p',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"todos.length"})));___v1ew.push(
" things to do.</p>\n");return ___v1ew.join("");}},
{inverse:function(scope,options){
var ___v1ew = [];___v1ew.push(
"\n\t<p>There is some private information hidden here.</p>\n\t<h4>To see private information, please ");___v1ew.push(
can.view.txt(
1,
'h4',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"linkTo"},'login')));___v1ew.push(
"</h4>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"<br/>\n<h3>This sentence is public information.  <br/><br/>This page can include all sorts of cool, public stuff about your company.</h3>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_secrets_secrets_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<h2>My Secrets</h2>");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'undefined',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"each"},{get:"secrets"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\t<p>");___v1ew.push(
can.view.txt(
1,
'p',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"description"})));___v1ew.push(
"</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_tickets_tickets_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<h2>Support</h2>\n<h4>We'd like you to think that we have award-winning support personnel.  Thank you!</h4>\n<p>This page shows an example of a separate Support Application.  <br/>Auth / Login is shared between the apps.</p>\n<br/>\n<h3>My Support Tickets</h3>");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'undefined',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"isLoggedIn"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\t");___v1ew.push(
can.view.txt(
0,
'undefined',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"tickets.length"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\n\t\t<p>You have ");___v1ew.push(
can.view.txt(
1,
'p',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"tickets.length"})));___v1ew.push(
" tickets</p>\n\t\t<ul>");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'ul',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"each"},{get:"tickets"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\t\t\t<li>");___v1ew.push(
can.view.txt(
1,
'li',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"status"})));___v1ew.push(
" - ");___v1ew.push(
can.view.txt(
1,
'li',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"body"})));___v1ew.push(
"</li>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"\t\t</ul>\n\t");return ___v1ew.join("");}},
{inverse:function(scope,options){
var ___v1ew = [];___v1ew.push(
"\n\t\t<p>You have no tickets.</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));return ___v1ew.join("");}},
{inverse:function(scope,options){
var ___v1ew = [];___v1ew.push(
"\n\t<h4>Please ");___v1ew.push(
can.view.txt(
1,
'h4',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"linkTo"},'login')));___v1ew.push(
" to see your support tickets.</h4>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_components_todos_todos_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<h2>My Todo List</h2>");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'undefined',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"each"},{get:"todos"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"\t<p>");___v1ew.push(
can.view.txt(
1,
'p',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"description"})));___v1ew.push(
"</p>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_nav_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<nav class=\"navbar navbar-default\" role=\"navigation\">\n  <div class=\"container-fluid\">\n    <!-- Brand and toggle get grouped for better mobile display -->\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'home')));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"CanJS Example App</a>\n    </div>\n    <!-- Collect the nav links, forms, and other content for toggling -->\n    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n      <ul class=\"nav navbar-nav\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'ul',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"isLoggedIn"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"          <li><a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'home')));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"Home</a></li>\n          <li><a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'todos')));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"To-dos</a></li>\n          <li><a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'secrets')));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"Secrets</a></li>\n          <li><a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'support')));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"Support</a></li>\n        ");return ___v1ew.join("");}},
{inverse:function(scope,options){
var ___v1ew = [];___v1ew.push(
"\n          <li><a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'home')));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"Home</a></li>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"      </ul>\n      <ul class=\"nav navbar-nav navbar-right\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'ul',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"unless"},{get:"isLoggedIn"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"        <li><a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'signup')));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"Signup</a></li>\n        <li><a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'login')));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"Login</a></li>\n        ");return ___v1ew.join("");}},
{inverse:function(scope,options){
var ___v1ew = [];___v1ew.push(
"\n          <li class=\"dropdown\">\n            <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">");___v1ew.push(
can.view.txt(
1,
'a',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"session.email"})));___v1ew.push(
" <b class=\"caret\"></b></a>\n            <ul class=\"dropdown-menu\">\n              <li><a href=\"");___v1ew.push(
can.view.txt(
true,
'a',
'href',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"hrefTo"},'my-account')));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"My Account</a></li>\n              <li class=\"divider\"></li>\n              <li><a href=\"javascript://\" can-click='logout'",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
"Logout</a></li>\n            </ul>\n          </li>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"      </ul>\n    </div><!-- /.navbar-collapse -->\n  </div><!-- /.container-fluid -->\n</nav>");; return ___v1ew.join('') }));
can.view.preloadStringRenderer('apps_main_site_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<div class=\"container\">\n\t");___v1ew.push(
can.view.txt(
0,
'div',
0,
this,
function(){ return can.Mustache.renderPartial('apps/main/nav.mustache',scope,options)}));
___v1ew.push(
"\n\t<div class=\"row\">\n\t\t<div class=\"col-md-12\">\n\t\t\t<div id=\"main\">Loading ...</div>\n\t\t</div>\n\t</div>\n</div>");; return ___v1ew.join('') })); 
})(this);