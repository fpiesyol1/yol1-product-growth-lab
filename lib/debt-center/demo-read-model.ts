export const DEBT_CENTER_DEMO_READ_MODEL = {
  receivables: [
    {
      debtId: "debt_nico_10000",
      publicToken: "pay_demo_nico_10000",
      personName: "Nico",
      outstandingAmount: 10_000,
      originalAmount: 10_000,
      paidAmount: 0,
      expenseTitle: "Reserva de la cabaña",
      groupName: "Viaje a Pucón",
    },
    {
      debtId: "debt_josefa_30000",
      publicToken: "pay_demo_josefa_30000",
      personName: "Josefa",
      outstandingAmount: 18_000,
      originalAmount: 30_000,
      paidAmount: 12_000,
      expenseTitle: "Reserva de la cabaña",
      groupName: "Viaje a Pucón",
    },
  ],
  payables: [
    {
      debtId: "debt_felipe_42000",
      publicToken: "pay_demo_felipe_42000",
      personName: "Camila",
      outstandingAmount: 42_000,
      originalAmount: 42_000,
      paidAmount: 0,
      expenseTitle: "Gastos comunes agosto",
      groupName: "Depto agosto",
    },
  ],
  companionDrafts: {
    liguria: {
      title: "Rest. Liguria",
      amount: 41_600,
      sourceLabel: "Cartola BCI ficticia · 1 ago",
      confidence: "low" as const,
    },
  },
} as const;

export const DEBT_CENTER_DEMO_TOTALS = {
  receivableOutstanding: DEBT_CENTER_DEMO_READ_MODEL.receivables.reduce((sum, debt) => sum + debt.outstandingAmount, 0),
  payableOutstanding: DEBT_CENTER_DEMO_READ_MODEL.payables.reduce((sum, debt) => sum + debt.outstandingAmount, 0),
} as const;
