ItemSchema = new SimpleSchema({
  name: {
    type: String
  },
  amount: {
    type: Number
  }
});

Items = new Mongo.Collection("item");
Items.attachSchema( ItemSchema );

Items.allow({
  insert: function(uid,doc){
    return true;
  },
  update: function(uid,doc){
    return true;
  },
  remove: function(){
    return true;
  }
});

if( Meteor.isClient ){
  Meteor.subscribe("Items");
}

if( Meteor.isServer ){
  Meteor.publish("Items",function(){
    return Items.find();
  });

  Factory.define('item', Items, {
    name: function(){ return Fake.word(); },
    amount: function(){ return _.random(100,10000); }
  });

  if( Items.find().count() === 0 ){
    _(50).times(function(){
      Factory.create('item');
    });
  }
}
