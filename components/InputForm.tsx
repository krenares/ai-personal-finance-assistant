import React, { useState } from 'react';
import type { UserInput } from '../types';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

// Form state can have empty strings for number fields during input
type FormState = {
    income: string | number;
    expenses: {
        rent: string | number;
        utilities: string | number;
        subscriptions: string | number;
        food: string | number;
        transport: string | number;
        entertainment: string | number;
    };
    savingsGoal: string | number;
    debt: {
        amount: string | number;
    };
    financialPriority: string;
    period: string;
};


const getInitialFormData = (): FormState => {
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return {
        income: '',
        expenses: {
            rent: '',
            utilities: '',
            subscriptions: '',
            food: '',
            transport: '',
            entertainment: '',
        },
        savingsGoal: '',
        debt: {
            amount: '',
        },
        financialPriority: "emergency fund",
        period: `${month} ${year}`,
    };
};

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormState>(getInitialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    if (field) {
        setFormData(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [field]: value
            }
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedData: UserInput = {
        income: parseFloat(String(formData.income)) || 0,
        expenses: {
            rent: parseFloat(String(formData.expenses.rent)) || 0,
            utilities: parseFloat(String(formData.expenses.utilities)) || 0,
            subscriptions: parseFloat(String(formData.expenses.subscriptions)) || 0,
            food: parseFloat(String(formData.expenses.food)) || 0,
            transport: parseFloat(String(formData.expenses.transport)) || 0,
            entertainment: parseFloat(String(formData.expenses.entertainment)) || 0,
        },
        savingsGoal: parseFloat(String(formData.savingsGoal)) || 0,
        debt: {
            amount: parseFloat(String(formData.debt.amount)) || 0,
        },
        financialPriority: formData.financialPriority,
        period: formData.period,
    };
    onSubmit(processedData);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-sky-400">Your Financial Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Section title="Income & Period">
            <InputField label="Monthly Income" name="income" type="number" value={formData.income} onChange={handleChange} />
            <InputField label="Analysis Period" name="period" type="text" value={formData.period} onChange={handleChange} />
          </Section>
          <Section title="Expenses">
            <InputField label="Rent/Mortgage" name="expenses.rent" type="number" value={formData.expenses.rent} onChange={handleChange} />
            <InputField label="Utilities" name="expenses.utilities" type="number" value={formData.expenses.utilities} onChange={handleChange} />
            <InputField label="Subscriptions" name="expenses.subscriptions" type="number" value={formData.expenses.subscriptions} onChange={handleChange} />
            <InputField label="Food/Groceries" name="expenses.food" type="number" value={formData.expenses.food} onChange={handleChange} />
            <InputField label="Transport" name="expenses.transport" type="number" value={formData.expenses.transport} onChange={handleChange} />
            <InputField label="Entertainment" name="expenses.entertainment" type="number" value={formData.expenses.entertainment} onChange={handleChange} />
          </Section>
          <Section title="Goals & Debt">
            <InputField label="Monthly Savings Goal" name="savingsGoal" type="number" value={formData.savingsGoal} onChange={handleChange} />
            <InputField label="Total Debt Amount" name="debt.amount" type="number" value={formData.debt.amount} onChange={handleChange} />
             <div>
              <label htmlFor="financialPriority" className="block text-sm font-medium text-slate-300">Financial Priority</label>
              <select
                id="financialPriority"
                name="financialPriority"
                value={formData.financialPriority}
                onChange={handleChange}
                className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white"
              >
                <option>emergency fund</option>
                <option>investment</option>
                <option>debt reduction</option>
              </select>
            </div>
          </Section>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate Report'}
        </button>
      </form>
    </div>
  );
};


const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <fieldset className="border border-slate-700 p-4 rounded-md">
        <legend className="px-2 text-lg font-semibold text-slate-400">{title}</legend>
        <div className="space-y-4">{children}</div>
    </fieldset>
);


interface InputFieldProps {
    label: string;
    name: string;
    type: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-300">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            {type === 'number' && <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><span className="text-gray-400 sm:text-sm">$</span></div>}
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className={`block w-full bg-slate-700 border-slate-600 rounded-md sm:text-sm text-white focus:ring-sky-500 focus:border-sky-500 ${type === 'number' ? 'pl-7' : 'px-3'} py-2`}
                placeholder={type === 'number' ? '0' : undefined}
            />
        </div>
    </div>
);


export default InputForm;