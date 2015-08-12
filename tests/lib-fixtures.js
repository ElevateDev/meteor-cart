Items = new Mongo.Collection('items');

Items.allow({
  insert: function(){ return true; },
  update: function(){ return true; },
  remove: function(){ return true; }
});

CleanDatabase = function(callback){
  Cart._collections.local.remove({});
  Meteor.call('clean',callback);
};

Meteor.methods('clean',function(){
  console.log( "Cleaning" );
  var cleanItems = Meteor.wrapAsync( Items.remove, Items);
  cleanItems({});
  var cleanCart = Meteor.wrapAsync( Cart._collections.user.remove, Cart._collections.user );
  return cleanCart({});
});
