const { Model } = require('mongoose');
const util = require('util');

'use strict';
const save = (mongomodel = Model, modelconvertor = Function(), selector = Function()) => async entities => {
	let models = modelconvertor(entities);
	if (!models) {
		return;
	}
	if (util.isArray(models)) {
		let bulk = mongomodel.collection.initializeOrderedBulkOp();
		for (const carrier of models) {
			bulk.find(selector(carrier)).upsert().updateOne(carrier);
		}
		await bulk.execute();
	} else {
		await mongomodel.findOneAndUpdate(selector(models), models, { upsert: true });
	}
};


const convertToModels = modelconvertor => entities => {
	if (util.isArray(entities)) {
		return entities.map(entity => modelconvertor(entity));
	}
	return modelconvertor(entities);
};

module.exports = {
	save : save,
	convertToModels : convertToModels
};