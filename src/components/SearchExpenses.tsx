import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X, Calendar } from 'lucide-react';

import { ExpenseList } from './ExpenseList';
import { IncomeList } from './IncomeList';
import { useCurrency } from '@/hooks/useCurrency';
import { Transaction } from '@/types/financial';

interface SearchExpensesProps {
  expenses: Transaction[];
  income: Transaction[];
  onDeleteExpense: (id: string) => void;
  onDeleteIncome: (id: string) => void;
}



export const SearchExpenses: React.FC<SearchExpensesProps> = ({
  expenses,
  income,
  onDeleteExpense,
  onDeleteIncome
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const { currency } = useCurrency();

  const allCategories = useMemo(() => {
    const categories = new Set([
      ...expenses.map(e => e.category),
      ...income.map(i => i.category)
    ]);
    return Array.from(categories).sort();
  }, [expenses, income]);

  const filteredTransactions = useMemo(() => {
    let allTransactions = [...expenses, ...income];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      allTransactions = allTransactions.filter(transaction =>
        transaction.description.toLowerCase().includes(term) ||
        transaction.category.toLowerCase().includes(term) ||
        (transaction.account && transaction.account.toLowerCase().includes(term))
      );
    }

    if (categoryFilter !== 'all') {
      allTransactions = allTransactions.filter(transaction =>
        transaction.category === categoryFilter
      );
    }

    if (typeFilter !== 'all') {
      allTransactions = allTransactions.filter(transaction =>
        transaction.type === typeFilter
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (dateFilter) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      allTransactions = allTransactions.filter(transaction =>
        new Date(transaction.date) >= cutoffDate
      );
    }

    return allTransactions.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses, income, searchTerm, categoryFilter, typeFilter, dateFilter]);

  const filteredExpenses = filteredTransactions.filter(t => t.type === 'expense');
  const filteredIncome = filteredTransactions.filter(t => t.type === 'income');

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setDateFilter('all');
  };

  const hasActiveFilters =
    searchTerm !== '' || categoryFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all';

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: currency || 'ZMW',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by description, category, or account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expenses Only</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && <Badge variant="secondary">Search: "{searchTerm}"</Badge>}
              {typeFilter !== 'all' && <Badge variant="secondary">Type: {typeFilter}</Badge>}
              {categoryFilter !== 'all' && <Badge variant="secondary">Category: {categoryFilter}</Badge>}
              {dateFilter !== 'all' && <Badge variant="secondary">Period: {dateFilter}</Badge>}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Found {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} 
          ({filteredIncome.length} income, {filteredExpenses.length} expenses)
        </div>

        {filteredTransactions.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {filteredIncome.length > 0 && (
              <Badge variant="secondary" className="text-income">
                Income: {formatCurrency(filteredIncome.reduce((sum, inc) => sum + (inc.amount || 0), 0))}
              </Badge>
            )}
            {filteredExpenses.length > 0 && (
              <Badge variant="secondary" className="text-expense">
                Expenses: {formatCurrency(filteredExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0))}
              </Badge>
            )}
          </div>
        )}
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No transactions found</p>
          <p>Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredIncome.length > 0 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-income">Income ({filteredIncome.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <IncomeList income={filteredIncome} onDelete={onDeleteIncome} />
              </CardContent>
            </Card>
          )}

          {filteredExpenses.length > 0 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-expense">Expenses ({filteredExpenses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseList expenses={filteredExpenses} onDelete={onDeleteExpense} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
