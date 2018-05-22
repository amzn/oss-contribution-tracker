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
import { By } from 'selenium-webdriver';
import build, { CustomDriver } from './driver';

describe('page navigation', function() {
  let driver: CustomDriver;
  beforeAll(async function(done) {
    driver = await build();
    done();
  });
  afterAll(async function(done) {
    await driver.quit();
    done();
  });

  it('initial load', async function(done) {
    driver.getRelative('/');
    const title = await driver.getTitle();
    expect(title).toContain('OSS Contribution Tracker');
    done();
  });

  it('can load my works', async function(done) {
    driver.findElement(By.css('a[href="/employee"]')).click();
    await driver.findElement(By.id('projectLISearch'));
    done();
  });

  it('can load the contribution list', async function(done) {
    driver.findElement(By.css('a[href="/list"]')).click();
    await driver.findElement(By.id('contributionsListAll'));
    done();
  });

  it('can reach the new contribution', async function(done) {
    driver.findElement(By.css('a[href="/contribute"]')).click();
    await driver.findElement(By.id('contributions-form'));
    done();
  });

  it('can load the admin', async function(done) {
    driver.findElement(By.css('a[href="/admin"]')).click();
    await driver.findElement(By.id('admin_container'));
    done();
  });

  it('can return to the landing page', async function(done) {
    driver.findElement(By.css('a[href="/"]')).click();
    const url = await driver.getCurrentUrl();
    expect(url).toMatch(/:8000\/$/);
    done();
  });
});
