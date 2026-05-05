export type GuideSection = {
  id: string;
  title: string;
  bullets: string[];          // What you should know — directly from the official PDF
  questionIds: number[];      // From questions.ts and extraQuestions.ts
  studyTip?: string;          // Quick framing
};

export const guideSections: GuideSection[] = [
  {
    id: 'foundations',
    title: 'Foundations / Core Concepts',
    bullets: [
      'Difference between supervised vs unsupervised learning',
      'Difference between classification vs regression',
      'How different algorithms make predictions',
      'Basic R syntax (assignment vs equality, slicing)',
    ],
    questionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 46, 47, 48, 91, 92, 93, 94],
    studyTip: 'This is "match the task to the technique" — the most-tested skill on past quizzes. Numeric Y = regression. Categorical Y = classification. No Y, group similar = clustering. No Y, items together = association rules.',
  },
  {
    id: 'linreg',
    title: 'Linear Regression',
    bullets: [
      'How linear regression models are fit',
      'Interpret coefficients including dummy variables ("on average, all else equal" with units)',
      'Understand appropriate evaluation metrics (RMSE vs classification metrics)',
    ],
    questionIds: [24, 25, 26, 27, 28, 29, 30, 31, 32, 49, 50],
    studyTip: 'Required language for ANY coefficient interpretation: (1) on average, (2) all else equal, (3) correct units, (4) for dummies, name the BASELINE you are comparing to. You lost points twice on the midterm for missing #4.',
  },
  {
    id: 'knnreg',
    title: 'kNN Regression',
    bullets: [
      'Predictions based on similar observations',
      'Role of distance',
      'Scaling',
    ],
    questionIds: [38, 39, 40, 44, 92],
    studyTip: 'kNN = "find the k closest neighbors and average their Y." It is distance-based, so all inputs must be numeric AND on the same scale (standardize or normalize).',
  },
  {
    id: 'knnclass',
    title: 'kNN Classification',
    bullets: [
      'Intuition behind kNN classification',
      'Implications of being distance-based',
      'Only numerical predictors',
      'Importance of standardization / normalization',
      'Conceptual understanding of k',
      'Identify appropriate preprocessing steps',
      'Understand how nearest neighbors are determined',
    ],
    questionIds: [40, 41, 42, 43, 44],
    studyTip: 'Same rules as kNN regression PLUS for classification: predict by VOTE among k neighbors. Make k odd to avoid ties. Drop ALL factor / dummy variables before fitting.',
  },
  {
    id: 'naivebayes',
    title: 'Naive Bayes',
    bullets: [
      'Intuition behind Naive Bayes',
      'Understand conditional probability',
      'Difference between P(A|B) vs P(B|A)',
      'Understand the naive assumption',
      'Apply conditional probability to a small table',
    ],
    questionIds: [51, 52, 53, 54, 55, 56],
    studyTip: '"Naive" assumption: features are independent given the class. That lets you multiply individual conditional probabilities. P(A|B) ≠ P(B|A) — order of conditioning matters. Bayes Rule lets you flip them.',
  },
  {
    id: 'trees',
    title: 'Classification Trees',
    bullets: [
      'Intuition behind classification trees',
      'Interpret a tree (3 values in each node)',
      'Follow decision paths',
      'Understand predictions at leaves (probabilities)',
      'Concept of node purity',
      'How trees decide splits',
      'Overfitting vs underfitting in trees',
      'Stopping rules: how changes affect model complexity',
    ],
    questionIds: [57, 58, 59, 60, 61, 62, 93],
    studyTip: 'Node values top-to-bottom: predicted class, % target=1, % of total dataset. Left = yes to split rule. Trees split to MAXIMIZE PURITY (minimize Gini = p(1-p)). minsplit/minbucket/cp control complexity — bigger values → simpler tree → less overfitting.',
  },
  {
    id: 'logreg',
    title: 'Logistic Regression',
    bullets: [
      'Intuition behind logistic regression',
      'Flow: label → probability → odds → log-odds',
      'Difference between probability and odds (calculate odds from probability)',
      'Why log-odds are used',
      'Interpret coefficients: multiplicative effect on odds',
    ],
    questionIds: [45, 63, 64, 65, 66, 95],
    studyTip: 'Predict log-odds linearly → exp() → odds → p = odds/(1+odds) → cutoff → label. Coefficient interpretation: exp(coef) = multiplicative effect on ODDS. Trap answers: "additive on odds", "% on probability", "multiplicative on log-odds" — all WRONG.',
  },
  {
    id: 'classeval',
    title: 'Classification Evaluation',
    bullets: [
      'Understand and interpret a confusion matrix',
      'Calculate: error rate, benchmark error rate, sensitivity, specificity, false positives / false negatives',
      'Understand tradeoffs with cutoff values',
      'ROC curve intuition: TPR vs FPR. Where is ideal? Where is cutoff=0/1?',
      'AUC: 0.5 = random vs closer to 1 = better',
    ],
    questionIds: [67, 68, 69, 70, 71, 72, 73, 74, 75],
    studyTip: 'Sensitivity = TP / (TP+FN) — caught positives. Specificity = TN / (TN+FP) — rejected negatives. Lower cutoff → more positives predicted → ↑sens ↓spec. Cutoff=0 → predict ALL TRUE (top-right of ROC). Cutoff=1 → predict ALL FALSE (bottom-left). Ideal = top-left. AUC=0.5 is random.',
  },
  {
    id: 'workflow',
    title: 'R Coding / Model Workflow',
    bullets: [
      'Understand train/test split',
      'Recognize model types from code',
      'Understand prediction outputs: probabilities vs class predictions',
      'Understand cutoff application: converting probabilities to TRUE/FALSE',
      'Interpret evaluation code: error rate calculations',
    ],
    questionIds: [33, 34, 35, 36, 37, 95, 96, 97],
    studyTip: 'lm() = linear regression. glm(family=binomial) = logistic. knnreg() / knn3() = kNN. rpart() = tree. naiveBayes() = NB. kmeans() = clusters. type="response" returns probabilities. (predictions > 0.5) applies a cutoff.',
  },
  {
    id: 'association',
    title: 'Association Rules',
    bullets: [
      'Support — "how often"',
      'Confidence — "given X, how likely Y"',
      'Lift — "strength of relationship"',
      'Calculate metrics from a small table',
      'Interpret results in business context',
    ],
    questionIds: [3, 84, 85, 86, 87, 88, 89, 90],
    studyTip: 'SUPPORT(A) = count(A) / total. CONFIDENCE(A→C) = count(both) / count(A). LIFT(A→C) = Confidence / Support(C). Lift = 1 → independent (useless). Lift > 1 → useful rule.',
  },
  {
    id: 'ggplot',
    title: 'Data Visualization (ggplot)',
    bullets: [
      'Match business question → appropriate chart',
      'Layers and aes()',
      'geom_bar() vs geom_histogram()',
      'Recognize correct ggplot syntax',
    ],
    questionIds: [16, 17, 18, 19, 20, 21, 22, 23, 98],
    studyTip: 'Three building blocks: data + aes + geoms. geom_bar (categorical x) vs geom_histogram (numeric x, binned). geom_bar default counts; for actual values use stat="identity". geom_stacked() does NOT exist — stacked = geom_bar(stat="identity") + fill=Var.',
  },
  {
    id: 'clustering',
    title: 'Clustering (k-means & Hierarchical)',
    bullets: [
      'Purpose of clustering',
      'Role of cluster centers',
      'When the algorithm stops',
      'Interpret R output (model$size, model$centers)',
      'Elbow method → choosing number of clusters',
      'Hierarchical: linkage methods',
      'Conceptual differences between k-means and hierarchical',
    ],
    questionIds: [76, 77, 78, 79, 80, 81, 82, 83],
    studyTip: 'k-means: pick k, randomly place centers, assign points to closest center, move centers to mean, repeat until centers stop moving. Standardize first (distance based). Elbow method picks k at the bend. Hierarchical: build full tree, choose k after. Linkage: single = closest, complete = farthest, average = mean.',
  },
];
