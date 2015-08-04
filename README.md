cart
===========

Provides a cart for meteor.  Does not include a payment system, or ui.

#Installation
	$ meteor add elevatedevdesign:cart

# Setup 
	Cart.configure({
	  Items: {
	    collection: Items
	  }
	});

# Use

## Add 
    Cart.add({
      relationType: "Items", 
      relationId: "1234567898", // ID of the item 
      quantity: 1
    });

## Remove
    Cart.remove( this._id ); // Id of the cart item, _not_ the id of the object

## Info
Number of items in cart.

    Cart.numItems();

Get all items in cart

    Cart.items();

Get total cost of items in cart.  Integer representing number of cents.

    Cart.amount();




# TODO
- Move tests to demo and setup tests to run via test-packages.
- Helpers for publish of items in cart.
- Add shipping costs, and more flexibility in amount calculation.
- Add more tests
