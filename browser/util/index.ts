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
export async function reqJSON(
  url: string,
  obj?: any,
  method = 'GET'
): Promise<any> {
  const body = obj !== undefined ? JSON.stringify(obj) : undefined;
  const res = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  });

  // happy? return
  if (res.ok) {
    return res.json();
  }

  // error handling
  let error: Error & { code?: number; response?: any };
  try {
    // assume it's json first; try to get the message out of it
    const json = await res.json();
    error = new Error(json.error);
  } catch (ex) {
    // otherwise just use the HTTP status code
    error = new Error(res.statusText);
  }

  // package it up nicely and throw
  error.code = res.status;
  error.response = res;
  throw error;
}

export async function postJSON(url: string, obj?: any): Promise<any> {
  return reqJSON(url, obj, 'POST');
}
