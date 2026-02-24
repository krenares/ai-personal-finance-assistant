
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { CalculatorReport } from '../types';
import { SavingsIcon, AlertIcon, TipsIcon, BudgetIcon, DebtIcon } from './icons';

interface CalculatorViewProps {
  data: CalculatorReport;
}

const COLORS = ['#0ea5e9', '#06b6d4', '#14b8a6', '#f97316', '#ef4444', '#8b5cf6'];

const CalculatorView: React.FC<CalculatorViewProps> = ({ data }) => {
    const expenseData = Object.entries(data.expense_summary)
        .filter(([key]) => !['total_expenses', 'remaining_income'].includes(key))
        .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title="Total Expenses" value={`$${data.expense_summary.total_expenses.toLocaleString()}`} color="text-red-400" />
                <MetricCard title="Remaining Income" value={`$${data.expense_summary.remaining_income.toLocaleString()}`} color="text-green-400" />
                <MetricCard title="Expected Savings" value={`$${data.savings_opportunities.expected_savings.toLocaleString()}`} color="text-sky-400" />
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-semibold mb-4 text-slate-300">Expense Breakdown</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={expenseData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {expenseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b', // slate-800
                                    borderColor: '#334155', // slate-700
                                }}
                                itemStyle={{ color: '#cbd5e1' }} // slate-300
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <InfoCard title="Budget Suggestions" icon={<BudgetIcon/>}>
                    <p>Next Month's Limit: <span className="font-bold text-sky-400">${data.budget_suggestions.next_month_limit.toLocaleString()}</span></p>
                    <h4 className="font-semibold mt-3 mb-1 text-slate-400">Adjustments:</h4>
                    <ul className="list-disc list-inside space-y-1">
                       {Object.entries(data.budget_suggestions.adjustments).map(([key, value]) => (
                           <li key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: <span className={value < 0 ? 'text-green-400' : 'text-red-400'}>${value}</span></li>
                       ))}
                    </ul>
                </InfoCard>

                 <InfoCard title="Savings Opportunities" icon={<SavingsIcon/>}>
                    <ul className="list-disc list-inside space-y-1">
                        {data.savings_opportunities.actions.map((action, index) => <li key={index}>{action}</li>)}
                    </ul>
                </InfoCard>

                <InfoCard title="Debt Management" icon={<DebtIcon/>}>
                    <p>Priority: <span className="font-bold text-sky-400">{data.debt_management.priority}</span></p>
                    <p>Suggested Payment: <span className="font-bold text-sky-400">${data.debt_management.monthly_payment.toLocaleString()}</span></p>
                    <p>Strategy: <span className="font-bold text-sky-400">{data.debt_management.strategy}</span></p>
                </InfoCard>

                <InfoCard title="Alerts" icon={<AlertIcon/>}>
                    {data.alerts.overspending_categories.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-yellow-400">
                             {data.alerts.overspending_categories.map((cat, index) => <li key={index}>High spending in {cat}</li>)}
                        </ul>
                    ) : <p className="text-green-400">No overspending alerts. Great job!</p>}
                </InfoCard>
            </div>
             <InfoCard title="Financial Tips" icon={<TipsIcon/>}>
                <ul className="list-disc list-inside space-y-2">
                    {data.financial_tips.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
            </InfoCard>
        </div>
    );
};

const MetricCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
        <p className="text-sm text-slate-400">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);

const InfoCard: React.FC<{ title: string; icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
            <div className="text-sky-400">{icon}</div>
            <h3 className="text-xl font-semibold text-slate-300">{title}</h3>
        </div>
        <div className="text-slate-300 space-y-2">{children}</div>
    </div>
);


export default CalculatorView;
