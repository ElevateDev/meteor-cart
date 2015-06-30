Template.demo.helpers({
  cartItems: function(){
    return Cart.items();
  },
  cartTotal: function(){
    return Cart.amount();
  },
  cartNumItems: function(){
    return Cart.numItems();
  },
  items: function(){
    return Items.find();
  }
});

Template.cartItem.events({
  'click *[name="remove"]': function(){
    Cart.remove( this._id );
  }
});

Template.item.events({
  'click *[name="addToCart"]': function(){
    Cart.add( {relationType: "Items", relationId: this._id, quantity: 1} );
  }
});
