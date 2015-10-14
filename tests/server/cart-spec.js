describe("Cart", function(){
  beforeEach(function(done){
    CleanDatabase( done );
  });

  describe("empty",function(){
    it("should clear a users cart",function(){
      var userId = "Test-User-Id";
      Cart._collections.user.insert(
        _.extend(ValidCartItem(),{userId: userId}),
        {getAutoValues: false}
      );

      Cart.empty( userId );
      expect( 
        Cart._collections.user.find({userId: userId}).count()
      ).toBe( 0 );
    });
    it("should not clear another users cart",function(){
      var userId = "Test-User-Id";
      var anotherUserId = "Test-Another";
      Cart._collections.user.insert(
        _.extend(ValidCartItem(),{userId: anotherUserId}),
        {getAutoValues: false}
      );

      Cart.empty( userId );
      expect( 
        Cart._collections.user.find({userId: anotherUserId}).count()
      ).toBe( 1 ); 
    });
  });
});
