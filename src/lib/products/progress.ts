export type GenerationState = {
  purchaseId: string;
  status: "queued" | "running" | "completed" | "failed";
  progress: number;
  stage: string;
  error?: string;
  updatedAt: number;
  deliveryUrl?: string;
};

const store = new Map<string, GenerationState>();

export function setGenerationState(purchaseId: string, partial: Partial<GenerationState>) {
  const previous = store.get(purchaseId) ?? {
    purchaseId,
    status: "queued",
    progress: 0,
    stage: "Queued",
    updatedAt: Date.now(),
  };

  const next: GenerationState = {
    ...previous,
    ...partial,
    purchaseId,
    updatedAt: Date.now(),
  };

  store.set(purchaseId, next);
  return next;
}

export function getGenerationState(purchaseId: string) {
  return store.get(purchaseId);
}
