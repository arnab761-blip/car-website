/**
 * Advanced Luxury Automotive Financing & EMI Utility Suite
 * Computes real-time amortization, Loan-to-Value (LTV), dual-currency conversion (USD & BDT),
 * and standard EMI compounding.
 */

export const DEFAULT_USD_TO_BDT_RATE = 122; // 1 USD ≈ 122 BDT

export interface FinanceCalculationInput {
  carPrice: number;
  downPaymentPercent: number; // 0 - 50%
  loanTermMonths: number;     // 24, 36, 48, 60, 72 etc.
  interestRateAPR: number;    // 1.9 - 15.9%
  tradeInValue?: number;      // Trade-in equity
  salesTaxPercent?: number;   // e.g. 5.5%
  includeTaxInLoan?: boolean; // Capitalize tax into loan principal
}

export interface AmortizationPoint {
  periodLabel: string;
  year: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface FinanceCalculationResult {
  monthlyPayment: number;
  downPaymentAmount: number;
  tradeInValue: number;
  taxAmount: number;
  principalLoanAmount: number;
  totalInterestPayable: number;
  totalLoanCost: number;       // EMI * n
  totalCostOfOwnership: number; // Down Payment + Total Loan Cost (+ trade-in equity)
  loanToValuePercent: number;
  principalRatioPercent: number;
  interestRatioPercent: number;
  schedule: AmortizationPoint[];
}

/**
 * Standard Compound EMI Formula:
 * P * [r(1+r)^n / ((1+r)^n - 1)]
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  months: number
): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualInterestRate <= 0) return principal / months;

  const r = annualInterestRate / 12 / 100;
  const numerator = principal * r * Math.pow(1 + r, months);
  const denominator = Math.pow(1 + r, months) - 1;

  if (denominator === 0) return principal / months;
  return numerator / denominator;
}

/**
 * Calculates full detailed financing breakdown including amortization timeline
 */
export function calculateFinanceDetails(
  input: FinanceCalculationInput
): FinanceCalculationResult {
  const {
    carPrice = 350000,
    downPaymentPercent = 20,
    loanTermMonths = 60,
    interestRateAPR = 4.9,
    tradeInValue = 0,
    salesTaxPercent = 0,
    includeTaxInLoan = false,
  } = input;

  const sanitizedCarPrice = Math.max(0, carPrice);
  const sanitizedDownPercent = Math.min(50, Math.max(0, downPaymentPercent));
  const sanitizedMonths = Math.max(1, loanTermMonths);
  const sanitizedAPR = Math.max(0, interestRateAPR);
  const sanitizedTradeIn = Math.max(0, tradeInValue);
  const sanitizedTaxPercent = Math.max(0, salesTaxPercent);

  // Down Payment Dollar Amount
  const downPaymentAmount = Math.round((sanitizedCarPrice * sanitizedDownPercent) / 100);

  // Sales Tax Amount
  const taxAmount = Math.round((sanitizedCarPrice * sanitizedTaxPercent) / 100);

  // Total Initial Cost
  const grossCost = includeTaxInLoan ? sanitizedCarPrice + taxAmount : sanitizedCarPrice;

  // Principal Loan Amount P = Gross Cost - Down Payment - Trade In
  const principalLoanAmount = Math.max(0, grossCost - downPaymentAmount - sanitizedTradeIn);

  // Monthly EMI
  const monthlyPayment = calculateEMI(principalLoanAmount, sanitizedAPR, sanitizedMonths);

  // Total Loan Cost = monthly payment * months
  const totalLoanCost = Math.round(monthlyPayment * sanitizedMonths);

  // Total Interest Payable = Total Loan Cost - Principal
  const totalInterestPayable = Math.max(0, totalLoanCost - principalLoanAmount);

  // Total Cost of Ownership
  const upfrontOutOfPocket = downPaymentAmount + (includeTaxInLoan ? 0 : taxAmount);
  const totalCostOfOwnership = upfrontOutOfPocket + totalLoanCost + sanitizedTradeIn;

  // LTV & Ratios
  const loanToValuePercent =
    sanitizedCarPrice > 0
      ? Math.min(100, Math.round((principalLoanAmount / sanitizedCarPrice) * 100))
      : 0;

  const totalFinanced = principalLoanAmount + totalInterestPayable;
  const principalRatioPercent =
    totalFinanced > 0 ? Math.round((principalLoanAmount / totalFinanced) * 100) : 100;
  const interestRatioPercent = Math.max(0, 100 - principalRatioPercent);

  // Compute Year-by-Year Amortization Schedule
  const schedule: AmortizationPoint[] = [];
  let balance = principalLoanAmount;
  let cumInterest = 0;
  let cumPrincipal = 0;
  const monthlyRate = sanitizedAPR / 12 / 100;

  const totalYears = Math.ceil(sanitizedMonths / 12);

  for (let yr = 1; yr <= totalYears; yr++) {
    const monthsInThisYear = Math.min(12, sanitizedMonths - (yr - 1) * 12);
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let m = 1; m <= monthsInThisYear; m++) {
      if (balance <= 0) break;
      const monthInterest = balance * monthlyRate;
      const monthPrincipal = Math.min(balance, monthlyPayment - monthInterest);

      yearlyInterest += monthInterest;
      yearlyPrincipal += monthPrincipal;
      balance = Math.max(0, balance - monthPrincipal);
    }

    cumInterest += yearlyInterest;
    cumPrincipal += yearlyPrincipal;

    schedule.push({
      periodLabel: `Year ${yr}`,
      year: yr,
      principalPaid: Math.round(yearlyPrincipal),
      interestPaid: Math.round(yearlyInterest),
      remainingBalance: Math.round(balance),
      cumulativeInterest: Math.round(cumInterest),
      cumulativePrincipal: Math.round(cumPrincipal),
    });
  }

  return {
    monthlyPayment: Math.round(monthlyPayment),
    downPaymentAmount,
    tradeInValue: sanitizedTradeIn,
    taxAmount,
    principalLoanAmount,
    totalInterestPayable,
    totalLoanCost,
    totalCostOfOwnership,
    loanToValuePercent,
    principalRatioPercent,
    interestRatioPercent,
    schedule,
  };
}

/**
 * Currency Formatting Utilities
 */

export function formatUSD(amount: number, compact = false): string {
  const rounded = Math.round(amount);
  if (compact && rounded >= 1000000) {
    return `$${(rounded / 1000000).toFixed(2)}M`;
  }
  if (compact && rounded >= 1000) {
    return `$${(rounded / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(rounded);
}

export function formatBDT(amountInUSD: number, rate = DEFAULT_USD_TO_BDT_RATE, compact = false): string {
  const bdtAmount = Math.round(amountInUSD * rate);
  if (compact) {
    if (bdtAmount >= 10000000) {
      // 1 Crore = 10,000,000 BDT
      return `৳ ${(bdtAmount / 10000000).toFixed(2)} কোটি`;
    }
    if (bdtAmount >= 100000) {
      // 1 Lakh = 100,000 BDT
      return `৳ ${(bdtAmount / 100000).toFixed(2)} লাখ`;
    }
  }
  // Standard South Asian comma numbering: ৳ 4,27,00,000
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(bdtAmount);
  return `৳ ${formatted}`;
}

export function formatDualCurrency(
  amountInUSD: number,
  primaryCurrency: 'USD' | 'BDT' = 'USD',
  rate = DEFAULT_USD_TO_BDT_RATE
): { primary: string; secondary: string } {
  if (primaryCurrency === 'BDT') {
    return {
      primary: formatBDT(amountInUSD, rate),
      secondary: formatUSD(amountInUSD),
    };
  }
  return {
    primary: formatUSD(amountInUSD),
    secondary: formatBDT(amountInUSD, rate),
  };
}
