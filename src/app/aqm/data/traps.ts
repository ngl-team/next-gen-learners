export type Trap = {
  topic: string;
  rule: string;
  why: string;
  example: string;
  drill: string;
};

export const traps: Trap[] = [
  {
    topic: 'Dummy coefficient interpretation',
    rule: 'When interpreting a factor/dummy coefficient, ALWAYS name the baseline you are comparing to.',
    why: 'You lost points twice on the midterm (Q28 RegionAsia, Q37 Urban) for forgetting "as compared to Europe" / "as compared to suburban".',
    example: 'Model: Salary = 38,000 + 12,000*Bachelors + 22,000*Masters + 1,000*YearsExp. Baseline = High School.\n\n✓ "On average, someone with a Bachelor\'s earns $12,000 more than someone with a HIGH SCHOOL education, holding all else constant."\n✗ "Bachelor\'s earn $12,000 more on average."',
    drill: 'For ANY dummy coefficient: state (1) on average, (2) the comparison vs the BASELINE level, (3) all else equal, (4) correct units.',
  },
  {
    topic: 'geom_bar default vs stat="identity"',
    rule: 'Default geom_bar() COUNTS rows. To plot a real value (revenue, sales, totals), you must use stat="identity".',
    why: 'You picked the count version on the midterm when the chart was clearly showing total revenue per region.',
    example: '✓ ggplot(df, aes(x=Region, y=Revenue)) + geom_bar(stat="identity")\n✗ ggplot(df, aes(x=Region)) + geom_bar()  // counts rows, ignores Revenue',
    drill: 'See a y= mapped to a real value? You need stat="identity". No y= and just counting categories? Default geom_bar is fine.',
  },
  {
    topic: 'geom_stacked() does not exist',
    rule: 'There is no geom_stacked() function. Stacked bars = geom_bar(stat="identity") with fill = breakdown variable.',
    why: 'You picked geom_stacked() on the midterm. It is a fake function name designed to trick you.',
    example: '✓ ggplot(df, aes(x=Region, y=Revenue, fill=Product)) + geom_bar(stat="identity")\n✗ ggplot(df, aes(x=Region, y=Revenue, fill=Product)) + geom_stacked()',
    drill: 'Stacked = geom_bar + stat="identity" + fill=Var. 100% scaled = add position="fill".',
  },
  {
    topic: 'Min-max normalization: observation vs value',
    rule: 'When asked which OBSERVATION normalizes to 0, return the row index of the smallest value — not the value itself.',
    why: 'You answered "3" on the midterm; the right answer was "1" (observation 1 had value 10, which is the minimum).',
    example: 'Observations: 1=10, 2=12, 3=14, 4=16, 5=18.\nMin-max → observation 1 (value 10) → 0. Observation 5 (value 18) → 1. Everything else between.',
    drill: 'Re-read the question — does it ask for the OBSERVATION number (the row) or the VALUE? Min-max: smallest → 0, largest → 1.',
  },
  {
    topic: 'Association Rules vs Clustering',
    rule: 'Items co-occurring in baskets/transactions = ASSOCIATION RULES. Users grouped by similarity = CLUSTERING.',
    why: 'Q34 on the midterm — chips and salsa together — you picked Clustering. Right answer was Association Rules.',
    example: '✓ "Frequently purchased together" → Association Rules\n✓ "Items in the same transaction/basket" → Association Rules\n✓ "Users with similar viewing patterns" → Clustering\n✓ "Players with similar stats" → Clustering',
    drill: 'Listen for "together", "basket", "transaction", "co-occur" → Association Rules. Listen for "groupings", "similar people/users/items by profile" → Clustering.',
  },
  {
    topic: 'step() purpose',
    rule: 'step(model) addresses OVERFITTING by removing weak predictors. It does NOT relate to benchmarking, scaling, or outcome type.',
    why: 'You picked "did not outperform the benchmark" on the midterm. step() has nothing to do with benchmarks.',
    example: 'model = lm(Price ~ ., data=training)  // big complex model, all predictors\nmodel = step(model)                    // drop weak ones to avoid overfitting',
    drill: 'See step(model) in the code? The concern is OVERFITTING. Period.',
  },
  {
    topic: 'Logistic regression coefficient — exponentiate',
    rule: 'Logistic coefficients are LOG-ODDS. Exponentiate to get a MULTIPLICATIVE effect on ODDS.',
    why: 'High-frequency final-exam topic. Trap answers will say "additive on odds" or "% on probability".',
    example: 'Coefficient for YearsExperience = 0.41.\n→ exp(0.41) ≈ 1.5\n→ "For each additional year, the odds of [outcome] are multiplied by ~1.5, on average, all else equal."',
    drill: '✓ multiplicative on ODDS  ✗ additive on odds  ✗ % on probability  ✗ multiplicative on log-odds',
  },
];
