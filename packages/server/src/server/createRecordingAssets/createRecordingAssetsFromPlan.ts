import { RecordingsPlan } from './createRecorderApolloServer';

type CreateRecordingAssetsFromPlan = (plan: RecordingsPlan) => Promise<void>;
export const createRecordingAssetsFromPlan: CreateRecordingAssetsFromPlan = async (
  plan
) => {};
