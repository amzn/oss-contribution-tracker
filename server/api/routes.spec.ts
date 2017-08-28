/* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
import * as mockery from 'mockery';

describe('routes', function () {
  let mock: any, auth: any, config: any;

  beforeEach(function () {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mock = {
      LDAP: {},
    };
    mockery.registerMock('../auth/ldap', {default: mock.LDAP});
    config = {
      admin: {
        posixGroup: ['fake2'],
      },
      approver: {
        posixGroup: 'fakefake',
      }};
    mockery.registerMock('../config', {default: config});
    mockery.registerAllowable('./routes');
    auth = require('./routes');
  });

  afterEach(function () {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('checkAccess', function () {
    it('should return admin', async function (done) {
      let user = 'jamesiri';
      mock.LDAP.getGroups = jasmine.createSpy('LDAP.getGroups').and.returnValue(returnAdmin());
      let access = await auth.checkAccess(user);
      expect(access).toEqual('admin');
      done();
    });

    it('should return anon', async function (done) {
      let user = 'nobody';
      mock.LDAP.getGroups = jasmine.createSpy('getGroups').and.returnValue(returnAnon());
      let access = await auth.checkAccess(user);
      expect(access).toEqual('anon');
      done();
    });
  });

  describe('approvedAccess', function () {
    let list = ['first', 'admin'];
    it('should return true one', function (done) {
      let type = 'admin';
      expect(auth.approvedAccess(type, list)).toEqual(true);
      done();
    });
    it('should return true two', function (done) {
      let type = 'first';
      expect(auth.approvedAccess(type, list)).toEqual(true);
      done();
    });
    it('should return true', function(done) {
      let type = 'hats';
      expect(auth.approvedAccess(type, list)).toEqual(false);
      done();
    });
  });

  function returnAdmin() {
    return (Promise.resolve(['fake2']));
  }

  function returnAnon() {
    return (Promise.resolve(['fake1']));
  }
});