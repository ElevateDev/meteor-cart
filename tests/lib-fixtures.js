Items = new Mongo.Collection('items');

Items.allow({
  insert: function(){ return true; },
  update: function(){ return true; },
  remove: function(){ return true; }
});

if( Meteor.isClient ){
  CleanDatabase = function(callback){
    Cart._collections.local.remove({});
    Meteor.call('clean',callback);
  };
}else{
  CleanDatabase = function( callback ){
    console.log( "Cleaning" );
    var cleanItems = Meteor.wrapAsync( Items.remove, Items);
    cleanItems({});
    var cleanCart = Meteor.wrapAsync( Cart._collections.user.remove, Cart._collections.user );
    cleanCart({});
    if( callback ){
      callback();
    }
  };

  Meteor.methods('clean',CleanDatabase);
}


ValidCartItem = function(){
  return {
    relationType: "Items",
    relationId: "12345666565",
    quantity: 1
  };
};

OmitHelpers = function( doc ){
  return _.omit(doc,'doc','amount');
}
