'use strict';

import {Ticket} from '../../models.js';

module.exports = can.Component.extend({
	tag: 'sc-support',
	template: can.view('/apps/main/components/tickets/tickets.mustache'),
	scope: {},
	events: {
		init(el, ev){
			can.route.attr('tickets', new Ticket.List({}));
		}
	}
});