var mongoose=require('mongoose')
var Schema=mongoose.Schema;

var urlschema=new Schema({
SearchText:String,
 SearchDate:Date 
},{timestamp:true});
var ModelClass=mongoose.model('searchText',urlschema);
module.exports = ModelClass;