export interface UserInput {
  income: number;
  expenses: {
    rent: number;
    utilities: number;
    subscriptions: number;
    food: number;
    transport: number;
    entertainment: number;
  };
  savingsGoal: number;
  debt: {
    amount: number;
  };
  financialPriority: string;
  period: string;
}

export interface ExpenseSummary {
  rent: number;
  utilities: number;
  subscriptions: number;
  food: number;
  transport: number;
  entertainment: number;
  total_expenses: number;
  remaining_income: number;
}

export interface BudgetSuggestions {
  next_month_limit: number;
  adjustments: {
    food: number;
    entertainment: number;
    subscriptions: number;
  };
}

export interface SavingsOpportunities {
  expected_savings: number;
  actions: string[];
}

export interface DebtManagement {
  priority: string;
  monthly_payment: number;
  strategy: string;
}

export interface Alerts {
  overspending_categories: string[];
}

export interface CalculatorReport {
  expense_summary: ExpenseSummary;
  budget_suggestions: BudgetSuggestions;
  savings_opportunities: SavingsOpportunities;
  debt_management: DebtManagement;
  financial_tips: string[];
  alerts: Alerts;
}

export interface FullReport {
  calculator_mode: CalculatorReport;
  advisor_mode: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
