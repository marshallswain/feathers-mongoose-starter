'use strict';

import '../change-password/change-password.js';

module.exports = can.Component.extend({
	tag: 'sc-my-account',
	template: can.view('/apps/main/components/auth/my-account/my-account.mustache'),
	scope: {}
});