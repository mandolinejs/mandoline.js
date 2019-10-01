
type Key = unknown; // uuid?

type PossibleAction = {
  name: string,
};

type PastAction = {
  action: PossibleAction,
};

type Observation = {
};

type Reflection = {
  pastActions: PastAction,
};

type XabyFace = {
  /**
   * i exist!
   *
   * return an arbitrary (maybe random) possible action
   */
  async i_exist(): Result<PossibleAction>,

  /**
   * i act!
   *
   * perform an action
   * return a record of the action and its effects
   */
  async i_act(): Result<PastAction>,

  /**
   * i observe!
   *
   * return a snapshot of your current surroundings
   */
  async i_observe(): Result<Observation>,

  /**
   * i wonder!
   *
   * return a summary of your history with this face
   * (may or may not be complete)
   */
  async i_wonder(): Result<Reflection>,
};
