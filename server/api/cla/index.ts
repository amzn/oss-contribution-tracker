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
import * as db from '../../db/cla';

export async function listCLA(req) {
  const claTable = await db.getClaTable();
  return { claTable };
}

export async function listCLAProjectNames(req) {
  const projectNames = await db.getClaProjectNames();
  return { projectNames };
}

export async function addNewCLA(req, body) {
  const contributionID = await db.pushNewCla(
    body.project_name,
    body.signatory_name,
    body.approver_name,
    body.contact_name,
    body.date_signed,
    body.date_approved,
    body.ticket_link,
    body.contributor_names,
    body.additional_notes
  );
  return { contributionID };
}

export async function updateCLA(req, body) {
  const updatedCla = await db.updateSingleCla(
    body.project_name,
    body.signatory_name,
    body.approver_name,
    body.contact_name,
    body.date_signed,
    body.date_approved,
    body.ticket_link,
    body.contributor_names,
    body.additional_notes,
    body.project_id
  );
  return { updatedCla };
}

export async function deleteCLA(req, body) {
  const deleteCla = await db.deleteSingleCla(body.project_id);
  return { deleteCla };
}

export async function getCLA(req, id) {
  const gotCla = await db.getSingleCla(id);
  return { gotCla };
}
