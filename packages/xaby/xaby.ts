
type Key = unknown; // uuid?

type Concept = {
  key: Key,
  name: string,
};

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

type XabyFace<
  Spoken = unknown,
  Understood = unknown,
> = {
  /**
   * i exist!
   *
   * return an arbitrary (maybe random) possible action
   */
  async i_exist(more?: Understood): Result<Spoken & PossibleAction>,

  /**
   * i act!
   *
   * perform an action
   * return a record of the action and its effects
   */
  async i_act(more?: Understood): Result<Spoken & PastAction>,

  /**
   * i observe!
   *
   * return a snapshot of your current surroundings
   */
  async i_observe(more?: Understood): Result<Spoken & Observation>,

  /**
   * i wonder!
   *
   * return a summary of your history with this face
   * (may or may not be complete)
   */
  async i_wonder(more?: Understood): Result<Spoken & Reflection>,
};
