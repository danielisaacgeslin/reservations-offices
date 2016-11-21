describe('filter: toTimeFilter', function(){

  beforeEach(module('app'));
  var before = [1,2,3,4,5,6,7,8,9,10,11,12];
  var after = [7,8,9,10,11,12];

  it('should return an array with numbers bigger than...', inject(function($filter){
    expect($filter('toTimeFilter')(before, 6)).toEqual(after);
  }));

});
