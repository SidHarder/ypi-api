var pantherOperation = require('../panther/panther_operation');

var args = require('./hpv1618_panther_result.json');



pantherOperation.submitResult(args, function (error, result)
{
  describe('Sample Test', () => {
    it('should test that true === true', () => {
      expect(true).toBe(true)
    })
  })
});