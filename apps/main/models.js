'use strict';

export var Todo = can.Feathers.Model.extend('Todo', {
	resource: 'api/todos'
}, {});

export var Secret = can.Feathers.Model.extend('Secret', {
	resource: 'api/secrets'
}, {});