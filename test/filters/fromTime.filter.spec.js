describe('filter: fromTimeFilter', function(){

  beforeEach(module('app'));
  var before = [1,2,3,4,5,6,7,8,9,10,11,12];
  var after = [1,2,3,4,5];

  it('should return an array with numbers smaller than...', inject(function($filter){
    expect($filter('fromTimeFilter')(before, 6)).toEqual(after);
  }));

});
