'use strict';

export var Todo = can.Feathers.Model.extend('Todo', {
	resource: 'api/todos'
}, {});

export var Secret = can.Feathers.Model.extend('Secret', {
	resource: 'api/secrets'
}, {});

export var Ticket = can.Feathers.Model.extend('Ticket', {
	resource: 'api/tickets'
}, {});

export var User = can.Feathers.Model.extend('User', {
	resource: 'api/users'
}, {});

export var PublicUser = can.Model.extend('PublicUser', {
	resource: 'api/users'
}, {});
