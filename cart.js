/*
 * Cart has a non user and a user component.
 * The non-user component is only present on the client
 */

/*
 * Setup the schemas for the collections
 */
var baseCartItemSchema = {
  relationType: {
    type: String
  },
  relationId: {
    type: String
  },
  quantity: {
    type: Number
  }
};

var cartItemSchema = new SimpleSchema(_.extend({
  userId: {
    type: String,
    autoValue: function(){
      return Meteor.userId();
    }
  }
},baseCartItemSchema) );

var cartClientSchema = new SimpleSchema( baseCartItemSchema );

/*
 * Allow/Deny for Remote collection
 */
var allowDeny = {
  insert: function(userId, doc){
    return userId === doc.userId;
  },
  update: function(userId, doc){
    return userId === doc.userId;
  },
  remove: function(userId, doc){
    return userId === doc.userId;
  }
};

var helpers = {
  doc: function(){
    return Cart._getItemDoc( this.relationType, this.relationId );
  }
};

/*
 * Initialize both collections on client, and remote only collecion on server
 */
CartImplementation = function(){
  this._collections = {};
  
  this._config = {};
  
  this._collections.user = new Meteor.Collection('cartItems');  
  this._collections.user.attachSchema( cartItemSchema );
  this._collections.user.allow( allowDeny );
  this._collections.user.helpers( helpers );

  if( Meteor.isClient ){
    this._collections.local = new Ground.Collection('cartItems/local', { connection: null });
    this._collections.local.attachSchema( cartClientSchema );
    this._collections.local.helpers( helpers );
    this._collections.dep = new Deps.Dependency();
    this._changeToLocal();
  }
};

CartImplementation.prototype._mergeCarts = function(){
  if( Meteor.isServer ){ return; }

  if( Meteor.userId() ){
    var self = this;
    var ids = [];
    self._collections.local.find().forEach(function(item){
      self._collections.user.insert(_.omit(item,'_id'));
      ids.push( item._id );
    });

    self._collections.local.remove({'_id': {$in: ids}});
  }
};

CartImplementation.prototype._changeToLocal = function(){
  if( Meteor.isServer ){ return; }
  this.collection = this._collections.local;
  this._collections.dep.changed();
};

CartImplementation.prototype._changeToRemote = function(){
  if( Meteor.isServer ){ return; }
  this.collection = this._collections.user;
  this._collections.dep.changed();
};

// Add to cart
CartImplementation.prototype.add = function(item){
  var existItem = this.collection.findOne( _.pick( item, ['relationId','relationType'] ) );
  if( existItem ){
    this.collection.update( {'_id': existItem._id},{$inc: {quantity: 1 }} );
  }else{
    this.collection.insert( item );
  }
};

CartImplementation.prototype.remove = function( id ){
  this.collection.remove( {'_id': id} );
};

// Calculate total

CartImplementation.prototype.items = function(){
  this._collections.dep.depend();
  return this.collection.find();
};

CartImplementation.prototype.numItems = function(){
  this._collections.dep.depend();
  return this.collection.find().count();
};

CartImplementation.prototype.amount = function(){
  this._collections.dep.depend();
  var amount = 0;
  this.collection.find().forEach(function(item){
    amount += item.doc().amount * item.quantity;
  });
  return amount;
};

CartImplementation.prototype._onLoginHook = function(user){
  console.log( "Login hook called" );
  var self = this;
  Meteor.setTimeout(function(){
    self._mergeCarts();
    self._changeToRemote();
    self._subscription = Meteor.subscribe('Cart');
  },300); 
};

CartImplementation.prototype._onLogoutHook = function(user){
  this._changeToLocal();
  this._subscription.stop();
};

/*
 * Setup profiles
 */
CartImplementation.prototype.configure = function(config){
  this._config = _.extend(this._config, config);
};

CartImplementation.prototype._getItemDoc = function(type,id){
  return this._config[type].collection.findOne({'_id': id});
};

Cart = new CartImplementation();

if( Meteor.isClient ){
  // On login merge carts and save to server, also switch local collections used
  Accounts.onLogin( Cart._onLoginHook );

  Accounts.onLogout( Cart._onLogoutHook );
}

if( Meteor.isServer ){
  Meteor.publish('Cart', function(){
    return Cart._collections.user.find({'userId': this.userId});
  });
}
