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
enum ParseState {
  Irrelevant,
  ChunkEmpty,
  ChunkAdd,
  ChunkDel,
}

enum Chunk {
  Add,
  Del,
}

function getDiffChunks(diff: string): Array<[Chunk, string[]]> {
  const lines = diff.split('\n');

  const chunks: Array<[Chunk, string[]]> = [];
  let currentChunk: string[] = [];
  let state: ParseState = ParseState.Irrelevant;

  const commitChunk = (trimmed: string) => {
    let chunkType;
    if (state === ParseState.ChunkAdd) {
      chunkType = Chunk.Add;
    } else if (state === ParseState.ChunkDel) {
      chunkType = Chunk.Del;
    } else {
      throw new Error('parse logic error: cannot commit outside of active chunk');
    }

    chunks.push([chunkType, currentChunk]);
    currentChunk = [trimmed];
  };

  for (const line of lines) {

    if (state === ParseState.Irrelevant) {
      // don't start looking for chunks until we see a chunk marker
      if (line.startsWith('@@')) {
        state = ParseState.ChunkEmpty;
        continue;
      }

      continue;
    }

    const trimmed = line.substr(1).trim();

    if (state === ParseState.ChunkEmpty) {
      if (line.startsWith(' ') || line === '') {
        continue;
      } else if (line.startsWith('+')) {
        state = ParseState.ChunkAdd;
      } else if (line.startsWith('-')) {
        state = ParseState.ChunkDel;
      } else {
        state = ParseState.Irrelevant;
        continue;
      }
      currentChunk = [trimmed];
    } else if (state === ParseState.ChunkAdd) {
      // no state change; keep adding lines to chunk
      if (line.startsWith('+')) {
        currentChunk.push(trimmed);
      } else if (line.startsWith('-')) {
        commitChunk(trimmed);
        state = ParseState.ChunkDel;
      } else if (line.startsWith(' ') || line === '') {
        commitChunk(trimmed);
        state = ParseState.ChunkEmpty;
      } else {
        commitChunk(trimmed);
        state = ParseState.Irrelevant;
      }
    } else if (state === ParseState.ChunkDel) {
      // no state change; keep adding lines to chunk
      if (line.startsWith('-')) {
        currentChunk.push(trimmed);
      } else if (line.startsWith('+')) {
        commitChunk(trimmed);
        state = ParseState.ChunkAdd;
      } else if (line.startsWith(' ') || line === '') {
        commitChunk(trimmed);
        state = ParseState.ChunkEmpty;
      } else {
        commitChunk(trimmed);
        state = ParseState.Irrelevant;
      }
    }
  }

  // there may be one last chunk
  if (state === ParseState.ChunkAdd || state === ParseState.ChunkDel) {
    commitChunk(null);
  }

  return chunks;
}

export function getDiffSize(diff: string): number {
  const chunks = getDiffChunks(diff);

  chunks.forEach((chunk, i) => {
    if (i === 0) {
      return;
    }

    // if this chunk is adding items
    // and the previous chunk removed some items...
    const prevChunk = chunks[i - 1];
    if (chunk[0] === Chunk.Add && prevChunk[0] === Chunk.Del) {
      // see if any deleted lines match added lines, signifying no code change
      // beyond whitespace for relevant lines
      const filtered = chunk[1].filter((addLine) => {
        // filter out this line if it was removed in the previous chunk.
        // whitespace has already been trimmed when building chunks, so
        // a simple inclusion check works here
        if ((prevChunk[1] as any).includes(addLine)) {
          return false;
        }
        return true;
      });
      chunk[1] = filtered;
    }
  });

  // get the number of lines in add chunks
  return chunks
    .filter((chunk) => chunk[0] === Chunk.Add)
    .reduce((acc, curr) => acc + curr[1].length, 0);
}
