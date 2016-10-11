describe('filter: repeatObjectToArrayFilter', function(){

  beforeEach(module('app'));
  var before = {
    5: {
      id: 5,
      criteria: 9
    },
    6: {
      id: 6,
      criteria: 2
    },
  };
  var after = [
    {id:6, criteria: 2},
    {id:5, criteria: 9},
  ];

  it('should convert object to array an perform an order by', inject(function($filter){
    expect($filter('repeatObjectToArrayFilter')(before, ['criteria'])).toEqual(after);
  }));

});
