describe('Cart', function(){
  describe('on login',function(){
    beforeEach(function(){
      Cart.collection.insert({'relationType': "Widget", "relationId": "ID", "quantity": 5});
      Cart.collection.insert({'relationType': "Widget", "relationId": "ID2", "quantity": 5});
    });

    afterEach(function(done){
      Meteor.call("removeAll","Cart._collections.user",function(){

        Meteor.logout(function(){
          done();
        });
      }); 
    });

    it("should remove all from local", function(done){
      spyOn( Cart, "_onLoginHook" ).and.callThrough().and.callFake(function(){
        expect( Cart._collections.find().count() ).toBe( 0 );
        done();
      });

      Meteor.loginWithPassword("user@gmail.com","password1");
    });

    it("should add existing items to remote collection", function(){
    });

    it("should change default collection to remote", function(){
    });
  });
  describe("on logout",function(){
    it("should set default collection to local",function(){
    });
  });
});
