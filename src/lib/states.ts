export type BuddyState = "idle" | "walking" | "sitting" | "looking" | "talking";

export interface StateConfig {
  minDuration: number;
  maxDuration: number;
  transitions: { state: BuddyState; weight: number }[];
}

export const STATE_CONFIG: Record<BuddyState, StateConfig> = {
  idle: {
    minDuration: 3000,
    maxDuration: 8000,
    transitions: [
      { state: "walking", weight: 40 },
      { state: "sitting", weight: 25 },
      { state: "looking", weight: 25 },
      { state: "talking", weight: 10 },
    ],
  },
  walking: {
    minDuration: 2000,
    maxDuration: 4000,
    transitions: [
      { state: "idle", weight: 60 },
      { state: "sitting", weight: 20 },
      { state: "looking", weight: 20 },
    ],
  },
  sitting: {
    minDuration: 5000,
    maxDuration: 12000,
    transitions: [
      { state: "idle", weight: 50 },
      { state: "looking", weight: 30 },
      { state: "talking", weight: 20 },
    ],
  },
  looking: {
    minDuration: 2000,
    maxDuration: 4000,
    transitions: [
      { state: "idle", weight: 60 },
      { state: "walking", weight: 30 },
      { state: "talking", weight: 10 },
    ],
  },
  talking: {
    minDuration: 4000,
    maxDuration: 7000,
    transitions: [
      { state: "idle", weight: 70 },
      { state: "sitting", weight: 30 },
    ],
  },
};

export function pickNextState(current: BuddyState): BuddyState {
  const config = STATE_CONFIG[current];
  const totalWeight = config.transitions.reduce((sum, t) => sum + t.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const transition of config.transitions) {
    roll -= transition.weight;
    if (roll <= 0) return transition.state;
  }

  return config.transitions[config.transitions.length - 1].state;
}

export function randomDuration(state: BuddyState): number {
  const { minDuration, maxDuration } = STATE_CONFIG[state];
  return minDuration + Math.random() * (maxDuration - minDuration);
}
