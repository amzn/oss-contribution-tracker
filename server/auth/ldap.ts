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
import * as ldap from 'ldapjs';
import * as winston from 'winston';

import config from '../config';

export class LDAPAuth {
  getActiveUser(request): string {
    const remoteUser =
      request.get('X-FORWARDED-USER') || `${config.fallbackUser}@`;
    return remoteUser.substring(0, remoteUser.indexOf('@'));
  }

  async getGroups(user) {
    const ldapGroups = await this._ldapsearch(
      `ou=groups,o=${config.ldap.o}`,
      {
        scope: 'sub',
        filter: 'memberuid=' + encodeURIComponent(user),
        attributes: ['cn'],
      },
      obj => `ldap:${obj.cn}`
    );
    const posixGroups = await this._ldapsearch(
      `ou=posix groups,ou=infrastructure,o=${config.ldap.o}`,
      {
        scope: 'sub',
        filter: 'memberuid=' + encodeURIComponent(user),
        attributes: ['cn'],
      },
      obj => `posix:${obj.cn}`
    );
    return [].concat(ldapGroups, posixGroups);
  }

  /**
   * Fetch a CN for a user.
   */
  getUser(user) {
    return this._ldapsearch(
      `o=${config.ldap.o}`,
      {
        scope: 'sub',
        filter: 'uid=' + encodeURIComponent(user),
        attributes: 'gecos',
      },
      obj => obj.gecos
    ).then(results => {
      if (results.length === 0) {
        return null;
      }
      if (results.length > 1) {
        return Promise.reject(
          new Error(`ldap returned more than one result for user ${user}`)
        );
      }
      return results[0];
    });
  }

  getAllUserInfo(user) {
    return this._ldapsearch(
      `o=${config.ldap.o}`,
      {
        scope: 'sub',
        filter: 'uid=' + encodeURIComponent(user),
        attributes: config.ldap.attributes,
      },
      obj => obj
    ).then(results => {
      if (results.length === 0) {
        return null;
      }
      return results;
    });
  }

  /**
   * Generic LDAP search.
   *
   * Given a base DN and options, perform a search. For each result, transform using
   * `pick` before adding to a list. At end of result set, resolves promise.
   */
  _ldapsearch(base, opts, pick): Promise<any[]> {
    const client = ldap.createClient({
      url: config.ldap.url,
    });
    client.on('error', err => {
      // connection errors will hard-crash node, so catch them here
      winston.warn('Unexpected ldap connection error', err);
    });

    // search LDAP for group membership
    return new Promise((resolve, reject) => {
      client.search(base, opts, (searchErr, res) => {
        if (searchErr) {
          return reject(new Error(searchErr));
        }

        const results = [];

        // build a list, resolving when complete
        res.on('searchEntry', entry => {
          results.push(pick(entry.object));
        });
        res.on('error', err => {
          client.unbind();
          reject(new Error(err));
        });
        res.on('end', () => {
          client.unbind();
          resolve(results);
        });
      });
    });
  }
}

export default new LDAPAuth();
