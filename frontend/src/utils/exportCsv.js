export const exportTransactionsToCsv = (transactions = [], currency = 'USD') => {
  if (!transactions.length) {
    alert('No transactions to export.');
    return;
  }

  const headers = ['Date', 'Title', 'Type', 'Category', 'Amount', 'Currency', 'Payment Method', 'Notes'];

  const rows = transactions.map((t) => [
    `"${t.date || ''}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${t.type || ''}"`,
    `"${(t.category?.name || '').replace(/"/g, '""')}"`,
    t.amount,
    `"${currency}"`,
    `"${t.paymentMethod || ''}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `money_tracker_statement_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

