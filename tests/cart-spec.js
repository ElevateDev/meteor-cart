Cart.configure({
  Items: {
    collection: Items
  }
});

describe("Cart", function(){
  beforeEach(function(done){
    CleanDatabase( done );
  });

  it("should begin empty",function(){
    expect( Cart.numItems() ).toBe( 0 );
    expect( Cart.items().count() ).toBe( 0 );
  }); 

  describe("add",function(){
    it("should return an item that has been added",function(){
      var expected = ValidCartItem();

      Cart.add( expected );
      expect( Cart.numItems() ).toBe( 1 );
      expect( 
        OmitHelpers( Cart.items().fetch()[0] )
      ).toEqual( expected );
    });
    
    it("should increment an item by quantity if it is already in cart",function(){
      var expected = ValidCartItem();

      Cart.add( _.extend(expected,{quantity: 1}));
      Cart.add( _.extend(expected,{quantity: 10}));
      expect( Cart.numItems() ).toBe( 11 );
      expect( 
        OmitHelpers( Cart.items().fetch()[0] )
      ).toEqual( _.extend(expected,{quantity: 11}) );
    });
  });
   
  describe("remove",function(){
    it("should remove an item",function(){
      var expected = ValidCartItem();

      Cart.add( expected );
      var id = Cart.items().fetch()[0]._id;
      Cart.remove( id );
      expect( Cart.numItems() ).toBe( 0 );
      expect( Cart.items().count() ).toEqual( 0 );
    });
  });

  /*
   * Check amount calculation
   */
  describe("amount",function(){
    it("should return the sum of everything in cart",function(){
      var expected = _.extend(ValidCartItem(),{
        relationId: Items.insert({amount: 500})
      });

      Cart.add( expected );
      expect( Cart.amount() ).toBe( 500 );
    });
    
    it("should return the sum of everything in cart",function(){
      Cart.add( _.extend(ValidCartItem(),{
        relationId: Items.insert({amount: 750}),
        quantity: 2
      }));

      Cart.add( _.extend(ValidCartItem(),{
        relationId: Items.insert({amount: 1})
      }));

      expect( Cart.amount() ).toBe( 1501 );
    });
  });
});
