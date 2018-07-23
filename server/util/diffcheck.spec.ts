/* Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

import { getDiffSize } from './diffcheck';

describe('diff checker', () => {
  it('counts lines', () => {
    expect(getDiffSize(diff1)).toEqual({
      lines: 2,
      chunks: 2,
    });
  });

  it('doesnt fail on invalid diff', () => {
    expect(getDiffSize(diff2)).toEqual({
      lines: 0,
      chunks: 0,
    });
  });

  it('ignores space changes', () => {
    expect(getDiffSize(diff3)).toEqual({
      lines: 1,
      chunks: 3,
    });
  });

  it('reports chunk sizes even with no line changes', () => {
    expect(getDiffSize(diff4)).toEqual({
      lines: 0,
      chunks: 2,
    });
  });
});

// two line count, two chunks
const diff1 = `
blah blah
@@ hello
 oariestn arsetiars
 aioretn;awyuft
+ awfoitenarsitears
+//yarsiteonarsot
-oufarst
`;

// 0 lines, 0 chunks
const diff2 = `
not a real diff
`;

// 1 line count (spacing change), 3 chunks
const diff3 = `
@@
-hello
+   hello
 oaresntoaeirs t
 arstarst
+  arsotnyufpt
`;

const diff4 = `
@@
 oarpiutnasotars
 airsthairsetn
-hello
+hello
 ioaorste
`;
