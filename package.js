Package.describe({
    name: "elevatedevdesign:cart",
    summary: "A simple shopping cart.",
  	version: "0.0.2-rc.1",
    git: "https://github.com/ElevateDev/meteor-cart.git"
});

Package.on_use(function (api) {
	api.versionsFrom("METEOR@1.0.2");

  api.use([
    'aldeed:simple-schema@1.3.3',
    'underscore',
    'accounts-base',
    'peppelg:on-login-logout@1.0.0',
    'deps',
    'dburles:collection-helpers@1.0.3'
  ]);

	api.use([
    'ground:db@0.3.10',
	],
	'client');
	
	api.add_files('cart.js',['client','server']);

  api.export('Cart', ['client','server']);
});
