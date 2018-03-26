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
import 'whatwg-fetch';

/**
 * Convenience function for sending/receiving JSON for API calls.
 *
 * Write more that will cover use cases
 */
export async function reqJSON(url, method = 'GET') {
  const f = await fetch(url, {
    credentials: 'same-origin',
    method,
  });
  // Unpack promises
  const hold = await f.json();
  return hold;
}

export async function postJSON(url, obj, method = 'POST') {
  const f = await fetch(url, {
    credentials: 'same-origin',
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: obj,
  });
  return await f;
}
