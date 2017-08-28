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
import { By, until } from 'selenium-webdriver';
import build, { CustomDriver } from './driver';

describe('admin', function () {
  let driver: CustomDriver;
  beforeAll(async function (done) {
    driver = await build();
    done();
  });
  afterAll(async function (done) {
    await driver.quit();
    done();
  });

  it('initial load', async function (done) {
    driver.getRelative('/admin');
    const title = await driver.getTitle();
    expect(title).toContain('OSS Contribution Tracker');
    await driver.wait(until.elementLocated(By.id('admin_container')));
    done();
  });

  it('approve contribution table', async function (done) {
    driver.getRelative('/admin');
    driver.findElement(By.id('approve_contributions_admin_link')).click();
    driver.findElement(By.id('contributions_table_admin'));
    await driver.wait(until.elementLocated(By.id('approve_contributions_admin_link')));
    done();
  });

  it('edit contribution table', async function (done) {
    driver.getRelative('/admin');
    driver.findElement(By.id('edit_contributions_admin_link')).click();
    await driver.wait(until.elementLocated(By.id('edit_contributions_admin_link')));
    done();
  });

  it('edit contribution table navigation', async function (done) {
    driver.getRelative('/contribution/000');
    driver.findElement(By.id('edit-contributions-form'));
    await driver.wait(until.elementLocated(By.id('edit-contributions-form')));
    done();
  });

  it('view ccla table', async function (done) {
    driver.getRelative('/admin');
    driver.findElement(By.id('ccla_link_admin')).click();
    driver.sleep(1000);
    driver.findElement(By.id('view_cla_link')).click();
    await driver.wait(until.elementLocated(By.id('view_cla_table')));
    done();
  });

  it('new ccla table', async function (done) {
    driver.getRelative('/admin');
    driver.findElement(By.id('ccla_link_admin')).click();
    driver.sleep(1000);
    driver.findElement(By.id('new_cla_link')).click();
    await driver.wait(until.elementLocated(By.id('contributions-form')));
    done();
  });

});