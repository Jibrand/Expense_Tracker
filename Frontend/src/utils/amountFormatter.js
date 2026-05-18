export const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0';

  const absVal = Math.abs(val);

  let formatted = '';
  if (absVal >= 1e24) {
    formatted = `${(absVal / 1e24).toFixed(2)} Sept`;
  } else if (absVal >= 1e21) {
    formatted = `${(absVal / 1e21).toFixed(2)} Sext`;
  } else if (absVal >= 1e18) {
    formatted = `${(absVal / 1e18).toFixed(2)} Quint`;
  } else if (absVal >= 1e15) {
    formatted = `${(absVal / 1e15).toFixed(2)} Quad`;
  } else if (absVal >= 1e12) {
    formatted = `${(absVal / 1e12).toFixed(2)} T`;
  } else if (absVal >= 1e9) {
    formatted = `${(absVal / 1e9).toFixed(2)} B`;
  } else if (absVal >= 1e6) {
    formatted = `${(absVal / 1e6).toFixed(2)} M`;
  } else {
    formatted = absVal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  // Remove trailing .00 or .00 if formatting has it (e.g. "100.00 M" -> "100 M")
  formatted = formatted.replace(/\.00(?=\s|$)/, '').replace(/(\.\d)0(?=\s|$)/, '$1');

  return `${val < 0 ? '-' : ''}${formatted}`;
};
