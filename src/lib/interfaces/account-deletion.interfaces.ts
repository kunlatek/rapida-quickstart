export interface IAccountDeletionState {
  isDeleted: boolean;
  deletedAt: string | null;
  daysRemaining: number;
  loading: boolean;
  error: string | null;
}