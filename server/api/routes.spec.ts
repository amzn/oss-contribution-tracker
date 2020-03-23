/* Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

// tslint:disable:no-empty

describe('routes', function() {
  let mock: any;
  let auth: any;
  let config: any;

  beforeEach(function() {
    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
    mock = {
      LDAP: {
        getActiveUser: jasmine
          .createSpy('LDAP.getActiveUser')
          .and.callFake(function(req, res, next) {
            if (req.type === 'admin') {
              return 'adminTestUser';
            } else if (req.type === 'approver') {
              return 'approverTestUser';
            } else if (req.type === 'cla') {
              return 'claTestUser';
            } else {
              return 'anonTestUser';
            }
          }),
        getGroups: jasmine
          .createSpy('LDAP.getGroups')
          .and.callFake(function(user) {
            if (user === 'adminTestUser') {
              return ['group1', 'group3'];
            } else if (user === 'approverTestUser') {
              return ['group2', 'group3'];
            } else if (user === 'claTestUser') {
              return ['group4', 'group3'];
            } else {
              return ['group3'];
            }
          }),
      },
    };
    mockery.registerMock('../auth/ldap', {
      default: mock.LDAP,
    });
    config = {
      admin: {
        posixGroup: ['group1'],
      },
      approver: {
        posixGroup: ['group2'],
      },
      cla: {
        posixGroup: ['group4'],
      },
    };
    mockery.registerMock('../config', { default: config });
    mockery.registerAllowable('./routes');
    auth = require('./routes');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('checkAccess', function() {
    it('should return admin', async function(done) {
      const req = { type: 'admin' };
      const res = {};
      const next = () => {};
      await auth.checkAccess(req, res, next);
      expect((req as any).UserAccess).toEqual(['admin']);
      done();
    });

    it('should return approver', async function(done) {
      const req = { type: 'approver' };
      const res = {};
      const next = () => {};
      await auth.checkAccess(req, res, next);
      expect((req as any).UserAccess).toEqual(['approver']);
      done();
    });

    it('should return cla', async function(done) {
      const req = { type: 'cla' };
      const res = {};
      const next = () => {};
      await auth.checkAccess(req, res, next);
      expect((req as any).UserAccess).toEqual(['cla']);
      done();
    });

    it('should return anon', async function(done) {
      const req = { type: 'nope' };
      const res = {};
      const next = () => {};
      await auth.checkAccess(req, res, next);
      expect((req as any).UserAccess).toEqual(['anon']);
      done();
    });
  });
});
