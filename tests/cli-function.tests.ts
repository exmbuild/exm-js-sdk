import {functionTest} from "../src/cli/cmd/functions/function-test";

describe('CLI Functions module', () => {

   test('function test successful', async () => {
      const testUserRegistry = await functionTest({
         input: [`{"username": "Andres"}`, `{"username": "Superman"}`],
         src: './tests/testdata/user-registry.js',
         initState: '{"users":[]}',
         type: "js"
      });
      expect(testUserRegistry.state).toEqual({
         "users": [
            {
               "username": "Andres"
            },
            {
               "username": "Superman"
            }
         ]
      });
   });

   test('function test successful (init-state file)', async () => {
      const testUserRegistry = await functionTest({
         input: [`{"username": "Andres"}`, `{"username": "Superman"}`],
         src: './tests/testdata/user-registry.js',
         initStateSrc: './tests/testdata/user-registry-init.json',
         type: "js"
      });
      expect(testUserRegistry.state).toEqual({
         "users": [
            {
              "username": "Deadpool"
            },
            {
               "username": "Andres"
            },
            {
               "username": "Superman"
            }
         ]
      });
   });

});