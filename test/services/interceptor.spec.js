describe('service: interceptor', function(){

  beforeEach(module('app'));

  it('leave requests as they are', inject(function(interceptor){
    var before = {a: 1};
    var after = {a: 1};
    expect(interceptor.request(before)).toEqual(after);
  }));

  it('reject on requestError', inject(function(interceptor, $q){
    expect(interceptor.requestError({})).toEqual($q.reject({}));
  }));

  it('handle responses', inject(function(interceptor, $q, $rootScope){
    var response = {data: {status: 'OK', payload: 1}};
    var msg = null;
    $rootScope.$on('ERROR', function(e,payload){
      msg = payload;
    });
    expect(interceptor.response(response)).toEqual(response);
    response.data.status = 'ERROR';
    expect(interceptor.response(response)).toEqual($q.reject(response));
    expect(msg).toEqual(response.data.payload);
  }));

  it('handle response errors', inject(function(interceptor, $q, $rootScope){
    var response = {status: 403, data: {payload: 1}};
    var sLogin = false;
    var sRoot = false;
    $rootScope.$on('goToLogin', function(){
      sLogin = true;
    });
    $rootScope.$on('goToRoot', function(){
      sRoot = true;
    });
    expect(interceptor.responseError(response)).toEqual($q.reject(response));
    response.status = 400;
    interceptor.responseError(response);
    expect(sLogin).toBeTruthy();
    expect(sRoot).toBeTruthy();
  }));

});
