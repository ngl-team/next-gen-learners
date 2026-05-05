export type Topic = {
  id: string;
  title: string;
  oneLiner: string;
  body: string;
};

export const topics: Topic[] = [
  {
    id: 'matching',
    title: 'Match the task to the technique',
    oneLiner: 'The most common question type. Decide based on the OUTCOME variable.',
    body: `**Numeric outcome (price, kW, score)** → Regression (linear or kNN regression)
**Categorical outcome (yes/no, fraud/not)** → Classification (logistic, kNN classification, tree, naive bayes)
**No Y, find groupings of users/items by similarity** → Clustering (k-means, hierarchical)
**No Y, find items co-occurring in transactions/baskets** → Association Rules

Listen for keywords:
- "predict the price/score/usage" → regression
- "label as / classify as" → classification
- "natural groupings of users/players/students" → clustering
- "frequently purchased together / chips and salsa / market basket" → association rules

**Supervised vs Unsupervised:** Supervised has a Y target. Unsupervised has no Y.
**Analytics types:** Descriptive (what happened), Diagnostic (why), Predictive (what will happen), Prescriptive (what to do).`,
  },
  {
    id: 'r-basics',
    title: 'R basics & data frame slicing',
    oneLiner: 'df[row, col]. Comma matters. c() builds vectors.',
    body: `**Object creation:** \`x <- 10\` or \`x = 10\` or \`prices = c(100, 200, 300)\`

**Slicing rules:**
- \`df[7, ]\` = row 7, ALL columns
- \`df[ , 7]\` = ALL rows, column 7
- \`df[1, 3]\` = single value at row 1 col 3
- \`df[1:5, ]\` = rows 1–5, all cols
- \`df[-2, ]\` = ALL rows EXCEPT row 2
- \`df[ , c("a","b")]\` = all rows, named columns
- \`df["a" + "b"]\` is INVALID (cannot add strings)

**Data types:**
- numeric — counts, prices, measurements
- factor — categorical with levels (Spring, Summer)
- logical — TRUE / FALSE (always caps)
- character — text strings

R imports columns as numeric by default even when the numbers represent categories. You convert with \`as.factor()\`.

**Inspection (does NOT modify):** \`View()\`, \`summary()\`, \`str()\`.`,
  },
  {
    id: 'ggplot',
    title: 'ggplot — three building blocks',
    oneLiner: 'Data + aes + geoms. Always.',
    body: `**Pick the right chart:**
| Goal | Chart |
|---|---|
| Distribution of one numeric | histogram (range), boxplot (median + quartiles) |
| Compare totals across categories | bar chart (with stat="identity") |
| Relationship between 2 numerics | scatter (geom_point) |
| Composition (parts of total) | stacked bar |
| Trend over time | line chart |
| Two-categorical heatmap | geom_tile |

**The bar chart trap:**
- \`geom_bar()\` alone COUNTS rows (no y).
- \`geom_bar(stat="identity")\` uses your y values directly. Required for revenue, sales, totals.

**Stacked bar:**
- \`geom_bar(stat="identity")\` with \`fill=BreakdownVar\`.
- \`geom_stacked()\` is FAKE. It does not exist.
- For 100% scaled stacked bars, add \`position="fill"\`.

**color vs fill:**
- color = outline / line / point color
- fill = inside of bars, boxes, areas
- Inside aes() = mapped to a variable. Outside aes() = a fixed value.`,
  },
  {
    id: 'linreg',
    title: 'Linear Regression',
    oneLiner: 'Predict a numeric Y by minimizing SUM OF SQUARED ERRORS.',
    body: `**Pipeline:**
\`\`\`r
df = read.csv("file.csv")
df$Cat = as.factor(df$Cat)
set.seed(1234)
N = nrow(df); training_size = round(N*0.6)
training_index = sample(N, training_size)
training = df[training_index, ]; test = df[-training_index, ]

model = lm(Price ~ ., data=training)
model = step(model)         # remove weak predictors → fights overfitting
predictions = predict(model, test)

errors = test$Price - predictions
rmse = sqrt(mean(errors^2))
mape = mean(abs(errors/test$Price))
\`\`\`

**Coefficient interpretation language (mandatory):**
- "On average"
- "All else equal" / "holding all else constant"
- Correct units (dollars vs thousands vs % — read what Y is)
- For DUMMIES: name the baseline ("compared to High School")

**RMSE vs MAPE:**
- RMSE = average prediction error in the units of Y. RMSE=26 on a $1000s outcome → off by $26,000.
- MAPE = average % off.

**Benchmark:** predict the mean of training$Y for everything in test. Beat it or skip the model.

**step()** = backward selection, drops weak predictors. Purpose: prevent OVERFITTING.`,
  },
  {
    id: 'knn',
    title: 'kNN (regression & classification)',
    oneLiner: 'Predict Y by averaging (or voting) the k nearest neighbors. Distance based.',
    body: `**Two requirements:**
1. ALL inputs must be NUMERIC (drop factors, dummy variables, categories).
2. STANDARDIZE or normalize, otherwise variables with bigger ranges dominate distance.

**Standardize vs normalize:**
- Standardize: \`preProcess(df, c("center","scale"))\` → mean 0, SD 1. Default choice.
- Normalize (min-max / range): \`preProcess(df, c("range"))\` → [0, 1]. Outliers compress everything else.

**k tradeoff:**
- k too small → overfits noise
- k too large → over-smooths, loses local pattern
- For ties in classification, make k odd

**Code (regression):** \`model = knnreg(Price ~ ., data=training, k=7)\`
**Code (classification):** \`model = knn3(ISHIGHVAL ~ ., data=training, k=3)\` then \`predict(model, test, type="class")\`

**kNN k=2 calculation:** average the Y values of the 2 closest neighbors.`,
  },
  {
    id: 'logreg',
    title: 'Logistic Regression',
    oneLiner: 'Predict a binary outcome. Coefficients are log-odds — exponentiate them.',
    body: `**Code:**
\`\`\`r
df$ISHIGHVAL = as.logical(df$ISHIGHVAL)
model = glm(ISHIGHVAL ~ ., data=training, family=binomial)
model = step(model)
predictions = predict(model, test, type="response")  # type="response" = probability
predictions_TF = (predictions > 0.5)
\`\`\`

**Coefficient interpretation — THE most-tested:**
Coefficient for YearsExperience = 0.41 → \`exp(0.41) ≈ 1.5\` → "For each additional year, the odds of [outcome] are MULTIPLIED by ~1.5, on average, all else equal."

**Trap answers (all wrong):**
- "odds increase by 0.41" — additive, not how logistic works
- "probability increases by 41%" — non-linear relationship, not a fixed %
- "log-odds multiplied by e^0.41" — log-odds are ADDED to, not multiplied

**Cutoff effect:** Lower cutoff → predict more TRUEs → higher sensitivity, lower specificity. Higher cutoff → opposite.`,
  },
  {
    id: 'metrics',
    title: 'Classification metrics',
    oneLiner: 'Sensitivity catches positives; specificity catches negatives; benchmark is the mode.',
    body: `**Confusion matrix terms:**
| Metric | Formula | Plain English |
|---|---|---|
| Error rate | wrong / total | % wrong |
| Sensitivity | TP / (TP + FN) | of TRUE positives, % we caught |
| Specificity | TN / (TN + FP) | of TRUE negatives, % we caught |
| Type I error | False positive | predicted yes, was no |
| Type II error | False negative | predicted no, was yes |

**Benchmark (classification)** = predict the MODE of the target for everything. Computed from data, NOT from the model. Cutoff changes sensitivity/specificity, NOT benchmark.

**ROC chart** = sensitivity vs (1 − specificity) across all cutoffs. Bigger area = better.
**Lift chart** = positives captured ranked by predicted probability vs random.`,
  },
  {
    id: 'trees',
    title: 'Trees (rpart)',
    oneLiner: 'Splits data into branches by purity. Accepts numeric AND categorical inputs.',
    body: `**Build:** \`rpart(Y ~ ., data=training)\`. Auto-detects regression (numeric Y) or classification (factor Y).

**Reading a node:** top = predicted class, middle = % target=1, bottom = % of total dataset. **Left = yes** to the rule, **right = no**.

**Gini impurity** (classification) = p × (1 − p). Max at p=0.5 (mixed), 0 at p=0 or 1 (pure).

**Stopping rules — rpart.control:**
- \`minsplit\` = min rows BEFORE attempting a split
- \`minbucket\` = min rows in a leaf AFTER split
- \`cp\` = min improvement required to perform a split

**Pruning:** \`pruned = easyPrune(model)\` cuts useless branches using cross validation.`,
  },
  {
    id: 'naivebayes',
    title: 'Naive Bayes',
    oneLiner: 'Probability classifier on categorical inputs. Assumes conditional independence.',
    body: `**Setup:** turn EVERY column into a factor.
\`\`\`r
everyColumn = colnames(df)
df[everyColumn] = lapply(df[everyColumn], factor)
\`\`\`

**Build:** \`model = naiveBayes(PositiveTweet ~ ., data=training)\`.
**Inspect:** \`model$tables$awesome\` shows P(awesome | class).

**Bag of words:** for text classification — each word becomes a 1/0 column. Loses word order/meaning, captures presence. Use cases: spam detection, sentiment analysis.

**The "naive" assumption:** all predictors are conditionally independent given the class. (Often false in reality, still works.)

**Probability calc patterns:**
- P(positive) = count(positive) / total
- P(positive | "good" appears) = subset to good=1, then count positive / count total in subset
- Odds(awesome to terrible) = count(awesome=1) / count(terrible=1)`,
  },
  {
    id: 'ensemble',
    title: 'Ensemble: bagging, boosting, stacking',
    oneLiner: 'Combine many models so weaknesses cancel.',
    body: `**Bagging (random forest):**
- Many models of the SAME type (typically trees)
- Each on a different bootstrap sample
- Vote: average for numeric, mode for categorical
- Reduces variance, mitigates overfitting

**Boosting (gbm):**
- Models trained SEQUENTIALLY
- Each model focuses on PREVIOUS model's errors
- CAN overfit (unlike bagging) — use cross validation to pick number of trees
- GBM only takes NUMERIC outcome

**Stacking:**
- Helper models predict
- Their predictions become NEW columns
- A MANAGER model (often logistic regression) trains on data + helper predictions
- Manager learns when to trust each helper

**Model weaknesses (memorize):**
- kNN: localized, sensitive to scale, breaks on categoricals
- Trees: unstable, can overfit
- Naive Bayes: assumes conditional independence (often false)
- Linear regression: only linear relationships`,
  },
  {
    id: 'clustering',
    title: 'Clustering — k-means & hierarchical',
    oneLiner: 'Unsupervised. Group similar observations.',
    body: `**k-means:**
1. Choose k.
2. Randomly place k centers.
3. Assign each point to closest center.
4. Move each center to mean of its points.
5. Repeat until convergence.

Distance based → STANDARDIZE first. Outliers drag centers. Use \`nstart=25\` to try multiple starts.

\`\`\`r
standardizer = preProcess(df, method=c("scale","center"))
df = predict(standardizer, df)
set.seed(1234)
model = kmeans(df, centers=3, nstart=25)
model$size       # cluster sizes
model$centers    # cluster profiles
elbowChart(df)   # picking k
\`\`\`

**After standardizing:** a value below 0 means below the mean of that variable.

**Hierarchical:**
- No upfront k — build the whole tree, choose later.
- Agglomerative (default): each point is its own cluster, merge nearest, repeat.
- Linkage methods:
  - **single** = closest pair (friends-of-friends)
  - **complete** = farthest pair (worst case)
  - **average** = average over all pairs
- **Dendrogram** = visual tree. Read **bottom-up**.

\`\`\`r
d = dist(df)
model = hclust(d, method="average")
plot(model, labels=df$Company)
\`\`\``,
  },
  {
    id: 'association',
    title: 'Association Rules',
    oneLiner: 'Items frequently bought together. Antecedent → consequent.',
    body: `**Four metrics:**
| Metric | Formula | Plain English |
|---|---|---|
| Support | P(A ∩ C) | how often the rule appears in data |
| Confidence | P(C \\| A) | given A, how often does C? |
| Lift | P(C \\| A) / P(C) | how much more likely is C given A vs random |
| Coverage | P(A) | how often A appears |

**Lift interpretation:**
- Lift = 1 → A and C independent (rule is useless)
- Lift > 1 → C more likely with A (good rule)
- Lift < 1 → C less likely with A

**Rule length distribution:**
- Long rules (high end) lack SUPPORT — too specific
- Short rules (low end) lack CONFIDENCE — too general`,
  },
  {
    id: 'pipeline',
    title: 'The 7-step supervised pipeline',
    oneLiner: 'Same skeleton for every model. Memorize it.',
    body: `1. **Load** — \`read.csv()\`, \`source("BabsonAnalytics.R")\`
2. **Manage** — \`as.factor()\`, \`as.logical()\`, drop unused columns
3. **Partition** — \`set.seed\`, \`nrow\`, \`sample\`, slice with \`[idx, ]\` and \`[-idx, ]\`
4. **Build** — lm / glm / knnreg / knn3 / rpart / naiveBayes / randomForest / gbm
5. **Predict** — \`predict(model, test)\` (with type="response" for logistic, type="class" for kNN classification)
6. **Evaluate** — RMSE/MAPE for regression; error rate / sensitivity / specificity for classification
7. **Benchmark** — mean of training$Y (regression) or mode (classification). Your model should beat this.`,
  },
];
