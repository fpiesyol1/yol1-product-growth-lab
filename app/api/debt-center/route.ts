import {
  createDebtGroup,
  createRecurringTemplate,
  createSharedExpense,
  cancelExpenseForCorrection,
  confirmCollectionShared,
  getDebtDashboard,
  materializeRecurringOccurrence,
  pauseRecurringTemplate,
  loadMockStatement,
  confirmReconciliationCandidate,
  rejectReconciliationEntry,
  reopenReconciliationEntry,
  reverseReconciliationDecision,
  resetDebtDemo,
  skipRecurringOccurrence,
} from "../../../lib/debt-center/service";
import { assertDebtCenterSimulatorEnabled, debtCenterErrorResponse, noStoreHeaders } from "../../../lib/debt-center/http";
import { assertSameOriginMutation, debtCenterSessionHeaders, getDebtCenterSession, readBoundedJson } from "../../../lib/debt-center/session";

function recurringResultView(result: {
  template: { id: string };
  occurrence: { id: string; status: "materialized" | "skipped" };
  expense?: { id: string };
}) {
  return {
    template: { id: result.template.id },
    occurrence: { id: result.occurrence.id, status: result.occurrence.status },
    ...(result.expense ? { expense: { id: result.expense.id } } : {}),
  };
}

function reconciliationDecisionView(decision: {
  id: string;
  statementEntryId: string;
  debtId?: string;
  amount?: number;
  action: string;
  decidedAt: string;
}) {
  return {
    id: decision.id,
    statementEntryId: decision.statementEntryId,
    debtId: decision.debtId,
    amount: decision.amount,
    action: decision.action,
    decidedAt: decision.decidedAt,
  };
}

export async function GET(request: Request) {
  try {
    assertDebtCenterSimulatorEnabled();
    const session = getDebtCenterSession(request);
    return Response.json({ ok: true, dashboard: await getDebtDashboard(session.id) }, { headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
  } catch (error) {
    return debtCenterErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertDebtCenterSimulatorEnabled();
    assertSameOriginMutation(request);
    const session = getDebtCenterSession(request);
    const body = await readBoundedJson(request);
    if (body.action === "reset_demo") {
      return Response.json({ ok: true, dashboard: await resetDebtDemo(session.id) }, { headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
    }
    if (body.action === "create_group") {
      const group = await createDebtGroup(session.id, {
        commandId: String(body.commandId ?? ""),
        name: String(body.name ?? ""),
        category: (["trip", "home", "meal", "activity", "monthly", "other"].includes(String(body.category)) ? body.category : "other") as "trip" | "home" | "meal" | "activity" | "monthly" | "other",
        participantIds: Array.isArray(body.participantIds) ? body.participantIds.map(String) : [],
        newParticipantNames: Array.isArray(body.newParticipantNames) ? body.newParticipantNames.map(String) : [],
      });
      return Response.json({ ok: true, group: { id: group.result.id }, dashboard: await getDebtDashboard(session.id) }, { status: 201, headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
    }
    if (body.action === "create_recurring_template") {
      const template = await createRecurringTemplate(session.id, {
        commandId: typeof body.commandId === "string" ? body.commandId : "",
        sourceExpenseId: typeof body.sourceExpenseId === "string" ? body.sourceExpenseId : "",
        nextOccurrenceOn: typeof body.nextOccurrenceOn === "string" ? body.nextOccurrenceOn : "",
      });
      return Response.json({ ok: true, template: { id: template.result.id, status: template.result.status }, dashboard: await getDebtDashboard(session.id) }, { status: 201, headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
    }
    if (body.action === "materialize_recurring_occurrence" || body.action === "skip_recurring_occurrence") {
      const input = {
        commandId: typeof body.commandId === "string" ? body.commandId : "",
        templateId: typeof body.templateId === "string" ? body.templateId : "",
        expectedOccurrenceKey: typeof body.expectedOccurrenceKey === "string" ? body.expectedOccurrenceKey : "",
      };
      const occurrence = body.action === "materialize_recurring_occurrence"
        ? await materializeRecurringOccurrence(session.id, input)
        : await skipRecurringOccurrence(session.id, input);
      return Response.json({ ok: true, result: recurringResultView(occurrence.result), dashboard: await getDebtDashboard(session.id) }, { status: 201, headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
    }
    if (body.action === "pause_recurring_template") {
      const template = await pauseRecurringTemplate(session.id, {
        commandId: typeof body.commandId === "string" ? body.commandId : "",
        templateId: typeof body.templateId === "string" ? body.templateId : "",
      });
      return Response.json({ ok: true, template: { id: template.result.id, status: template.result.status }, dashboard: await getDebtDashboard(session.id) }, { headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
    }
    if (body.action === "confirm_collection_shared") {
      const messageKind = String(body.messageKind ?? "");
      if (messageKind !== "initial" && messageKind !== "follow_up") throw new Error("INVALID_COLLECTION_MESSAGE_KIND");
      const confirmation = await confirmCollectionShared(session.id, {
        commandId: typeof body.commandId === "string" ? body.commandId : "",
        debtId: typeof body.debtId === "string" ? body.debtId : "",
        messageKind,
      });
      return Response.json({
        ok: true,
        confirmation: {
          id: confirmation.result.id,
          debtId: confirmation.result.debtId,
          messageKind: confirmation.result.messageKind,
          occurredAt: confirmation.result.occurredAt,
        },
        dashboard: await getDebtDashboard(session.id),
      }, { headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
    }
    if (body.action === "cancel_expense_for_correction") {
      const result = await cancelExpenseForCorrection(session.id, {
        commandId: String(body.commandId ?? ""),
        expenseId: String(body.expenseId ?? ""),
        reason: String(body.reason ?? "") as "wrong_amount" | "wrong_people" | "duplicate" | "other",
      });
      return Response.json({
        ok: true,
        result: { expense: { id: result.result.expense.id, lifecycle: result.result.expense.lifecycle } },
        dashboard: await getDebtDashboard(session.id),
      }, { headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
    }
    if (body.action === "load_mock_statement") {
      const result = await loadMockStatement(session.id, { commandId: String(body.commandId ?? ""), fixtureVersion: String(body.fixtureVersion ?? "") });
      return Response.json({
        ok: true,
        statement: { id: result.result.id, fixtureVersion: result.result.fixtureVersion, loadedAt: result.result.loadedAt },
        dashboard: await getDebtDashboard(session.id),
      }, { headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
    }
    if (body.action === "confirm_reconciliation_candidate") {
      const result = await confirmReconciliationCandidate(session.id, {
        commandId: String(body.commandId ?? ""),
        candidateId: String(body.candidateId ?? ""),
        expectedOutstandingAmount: typeof body.expectedOutstandingAmount === "number" ? body.expectedOutstandingAmount : Number.NaN,
      });
      return Response.json({ ok: true, decision: reconciliationDecisionView(result.result), dashboard: await getDebtDashboard(session.id) }, { headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
    }
    if (body.action === "reject_reconciliation_entry" || body.action === "reopen_reconciliation_entry") {
      const input = { commandId: String(body.commandId ?? ""), entryId: String(body.entryId ?? "") };
      const result = body.action === "reject_reconciliation_entry"
        ? await rejectReconciliationEntry(session.id, input)
        : await reopenReconciliationEntry(session.id, input);
      return Response.json({ ok: true, decision: reconciliationDecisionView(result.result), dashboard: await getDebtDashboard(session.id) }, { headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
    }
    if (body.action === "reverse_reconciliation_decision") {
      const result = await reverseReconciliationDecision(session.id, { commandId: String(body.commandId ?? ""), decisionId: String(body.decisionId ?? "") });
      return Response.json({ ok: true, decision: reconciliationDecisionView(result.result), dashboard: await getDebtDashboard(session.id) }, { headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
    }
    if (body.action !== "create_expense") {
      return Response.json({ ok: false, error: "INVALID_ACTION", message: "Acción demo no reconocida." }, { status: 400 });
    }
    const splitMode = String(body.splitMode);
    if (!["equal", "amount", "percentage", "shares"].includes(splitMode)) throw new Error("INVALID_SPLIT_MODE");
    if (!Array.isArray(body.participantIds) || !body.participantIds.every((value) => typeof value === "string")) throw new Error("INVALID_EXPENSE");
    const legacySplitValues = splitMode === "equal" ? undefined : body.amounts;
    const rawSplitValues = body.splitValues ?? legacySplitValues;
    if (rawSplitValues !== undefined && (!rawSplitValues || typeof rawSplitValues !== "object" || Array.isArray(rawSplitValues))) throw new Error("INVALID_SPLIT_VALUES");
    const result = await createSharedExpense(session.id, {
      commandId: String(body.commandId ?? ""),
      groupId: String(body.groupId ?? ""),
      title: String(body.title ?? ""),
      totalAmount: typeof body.totalAmount === "number" ? body.totalAmount : Number.NaN,
      paidByParticipantId: String(body.paidByParticipantId ?? ""),
      participantIds: body.participantIds as string[],
      splitMode: splitMode as "equal" | "amount" | "percentage" | "shares",
      splitValues: rawSplitValues as Record<string, number> | undefined,
      receiptName: typeof body.receiptName === "string" ? body.receiptName : undefined,
      correctionOfExpenseId: typeof body.correctionOfExpenseId === "string" ? body.correctionOfExpenseId : undefined,
    });
    return Response.json({ ok: true, result: { expense: { id: result.result.expense.id } }, dashboard: await getDebtDashboard(session.id) }, { status: 201, headers: debtCenterSessionHeaders(session, noStoreHeaders()) });
  } catch (error) {
    return debtCenterErrorResponse(error);
  }
}
