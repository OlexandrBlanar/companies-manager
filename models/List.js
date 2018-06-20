//Require mongoose package
const mongoose = require('mongoose');
const materializedPlugin = require('mongoose-materialized');
const Schema = mongoose.Schema;

//Define CompanieslistSchema with title, description and category
const CompanieslistSchema = new Schema({
    name: {type: String},
    EstimatedEarnings: {type: Number},
    EstimatedEarningsAllChild: {type: Number},
});

CompanieslistSchema.plugin(materializedPlugin);
//Create a model using mongoose.model and export it
const CompaniesList = module.exports = mongoose.model('CompaniesList', CompanieslistSchema );


//CompaniesList.find() returns all the lists
module.exports.getAllCompanies = (callback) => {
    CompaniesList.find(callback);
}

module.exports.findParentCompany = (nameParentCompany, callback) => {
    CompaniesList.findOne({name: nameParentCompany}, callback);
}

module.exports.getSiblings = (id, callback) => {
    CompaniesList.getSiblings(id, callback);
}

module.exports.getAncestors = (id, callback) => {
    CompaniesList.getAncestors(id, callback);
}
//newList.save is used to insert the document into MongoDB
module.exports.addRootCopany = (newCompany, callback) => {
    newCompany.save(callback);
}

module.exports.addChildCopany = (parentId, newCompany, callback) => {
    CompaniesList.AppendChild(parentId, newCompany, callback);
}

//We pass on an id and remove it from DB using Companieslist.remove()
module.exports.deleteListById = (id, callback) => {
    let query = {_id: id};
    CompaniesList.remove(query, callback);
}