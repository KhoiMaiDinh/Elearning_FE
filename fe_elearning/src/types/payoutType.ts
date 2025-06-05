export interface PayoutType {
  id: string;
  transaction_code?: string;
  paid_out_sent_at?: string;
  bank_account_number?: string;
  bank_code?: string;
  amount?: string;
  payout_status: string;
  failure_reason?: string;
  payee?: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  evidence: { id: string };
}

export interface PayoutRequestType {
  id: string;
  payout_status: string;
  transaction_code?: string;
  evidence: { id: string };
  failure_reason?: string;
}
