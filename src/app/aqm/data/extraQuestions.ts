import type { Question } from './questions';

// New questions covering gaps in the official topic guide.
// IDs start at 51 to avoid collision with the original bank.
export const extraQuestions: Question[] =
[
  {
    id: 51,
    topic: "Naive Bayes",
    prompt: "What is the \"naive\" assumption behind Naive Bayes?",
    options: [
      "It assumes the predictors are normally distributed",
      "It assumes the data is linearly separable",
      "It assumes equal probability for each class",
      "It assumes all predictors are conditionally independent given the class"
    ],
    correctIndex: 3,
    explanation: "Naive Bayes assumes predictors are independent of each other ONCE you condition on the class. This lets you multiply individual conditional probabilities instead of needing a giant joint probability table."
  },
  {
    id: 52,
    topic: "Naive Bayes",
    prompt: "Which of these is the difference between P(A | B) and P(B | A)?",
    options: [
      "They are mathematically always equal under the laws of conditional probability and Bayes Rule",
      "P(A | B) is for events that already happened; P(B | A) is for events that will happen in the future",
      "P(A | B) is always greater than or equal to P(B | A) by the definition of conditional probability",
      "P(A | B) is \"probability of A given B happened\"; P(B | A) is \"probability of B given A happened\" — they answer different questions"
    ],
    correctIndex: 3,
    explanation: "Order matters. P(A | B) starts from B already being true and asks about A. P(B | A) starts from A already being true and asks about B. Bayes Rule is what lets you flip between them."
  },
  {
    id: 53,
    topic: "Naive Bayes",
    prompt: "In a tweet dataset, P(awesome appears | positive review) = 0.285 and P(awesome appears | negative review) = 0.0005. What does this tell you?",
    options: [
      "The word \"awesome\" is meaningless because it appears rarely",
      "The two probabilities should be equal",
      "You cannot make a classifier from these probabilities",
      "The word \"awesome\" is a strong indicator of a positive review"
    ],
    correctIndex: 3,
    explanation: "\"awesome\" is ~570x more likely in a positive review than a negative one. Strong signal — useful feature."
  },
  {
    id: 54,
    topic: "Naive Bayes",
    prompt: "A small training set has 60 spam emails and 40 not-spam. Among the 60 spam, 48 contain the word \"free\". Among the 40 not-spam, 4 contain \"free\". What is P(\"free\" | spam)?",
    options: [
      "0.48",
      "0.04",
      "0.12",
      "0.80"
    ],
    correctIndex: 3,
    explanation: "P(\"free\" | spam) = (count of spam with \"free\") / (total spam) = 48 / 60 = 0.80. You restrict to the conditioning class first, then compute the proportion."
  },
  {
    id: 55,
    topic: "Naive Bayes",
    prompt: "Why is Naive Bayes a good fit for text classification (spam, sentiment)?",
    options: [
      "Text data is always linearly separable when converted into TF-IDF vectors with proper normalization applied",
      "Naive Bayes has the lowest error rate of any classifier on text data based on standard benchmark studies",
      "Each word can be treated as a categorical 1/0 feature, and Naive Bayes handles thousands of categorical features quickly",
      "Naive Bayes does not require any training data and computes class probabilities directly from word frequencies"
    ],
    correctIndex: 2,
    explanation: "Bag-of-words turns documents into thousands of 1/0 features. NB handles this well because (a) categorical inputs are its sweet spot, (b) the conditional-independence assumption keeps computation fast."
  },
  {
    id: 56,
    topic: "Naive Bayes",
    prompt: "You have a small training set: 5 positive reviews and 3 negative reviews. Of the positives, 4 contain \"great\" and 2 contain \"love\". Of the negatives, 0 contain \"great\" and 1 contains \"love\". Using Naive Bayes assumption, what is P(\"great\" AND \"love\" | positive)?",
    options: [
      "0.6",
      "0.4",
      "0.32",
      "0.5"
    ],
    correctIndex: 2,
    explanation: "Naive assumption: features are independent given class. So P(great AND love | pos) = P(great | pos) × P(love | pos) = (4/5) × (2/5) = 0.8 × 0.4 = 0.32."
  },
  {
    id: 57,
    topic: "Classification Trees",
    prompt: "A node in a classification tree shows three values: 1, 0.71, 100%. What does each represent?",
    options: [
      "Top: depth of the node from the root. Middle: training error rate. Bottom: 95% confidence interval of the prediction.",
      "Top: the split rule for this node. Middle: Gini impurity at the node. Bottom: number of child nodes below it.",
      "Top: predicted probability of class 1. Middle: cumulative error along the path. Bottom: size of the resulting leaf.",
      "Top: the predicted class. Middle: % of observations with target=1. Bottom: % of total dataset in this node."
    ],
    correctIndex: 3,
    explanation: "rpart node values (top to bottom): predicted class, share of target=1 in this node, share of total dataset that lands in this node."
  },
  {
    id: 58,
    topic: "Classification Trees",
    prompt: "When following a classification tree, which branch do you take when the split rule is TRUE for the observation?",
    options: [
      "Right = yes (rule is true)",
      "Either branch — it is random",
      "Left = yes (rule is true)",
      "Always go to the deepest leaf first"
    ],
    correctIndex: 2,
    explanation: "In rpart trees, LEFT = yes (rule satisfied), RIGHT = no."
  },
  {
    id: 59,
    topic: "Classification Trees",
    prompt: "A leaf node has 80 observations: 72 with target=1 and 8 with target=0. What does the tree predict, and what is the leaf \"purity\"?",
    options: [
      "Predicts 1 because it is the majority class; the leaf is fairly pure (90% one class)",
      "Predicts 0 because the minority class is what trees prioritize; the purity at this leaf is therefore low",
      "Predicts the average value of the two class labels (0 and 1), which gives a final node prediction of 0.5",
      "Cannot determine the prediction or purity from this information without first computing the Gini coefficient"
    ],
    correctIndex: 0,
    explanation: "Classification trees predict the MAJORITY class at the leaf. 72/80 = 90% target=1, so prediction is 1 and the node is fairly pure."
  },
  {
    id: 60,
    topic: "Classification Trees",
    prompt: "Gini impurity for a binary target is p × (1 − p). When is impurity HIGHEST?",
    options: [
      "When p = 0 (no positives)",
      "When p = 1 (all positives)",
      "When p = 0.5 (evenly split)",
      "When p = 0.1 (almost all negatives)"
    ],
    correctIndex: 2,
    explanation: "p × (1-p) maxes at p=0.5 → 0.25. Pure nodes (p=0 or p=1) have impurity = 0. Trees split to MAXIMIZE purity = minimize impurity."
  },
  {
    id: 61,
    topic: "Classification Trees",
    prompt: "Your tree is overfitting. Which stopping-rule change would HELP (make it less complex)?",
    options: [
      "Decrease minsplit and decrease minbucket",
      "Decrease cp to allow more splits",
      "Increase minsplit and increase minbucket",
      "Remove all stopping rules"
    ],
    correctIndex: 2,
    explanation: "minsplit = min rows BEFORE attempting a split. minbucket = min rows AFTER. Bigger values → fewer splits → simpler tree → less overfitting. cp also controls this — INCREASE cp to demand bigger improvement before splitting."
  },
  {
    id: 62,
    topic: "Classification Trees",
    prompt: "What does easyPrune(model) do?",
    options: [
      "Trains a fresh tree using default rpart settings, ignoring any stopping rules you may have configured earlier",
      "Increases the maximum tree depth to improve training accuracy and capture more nuanced patterns in the data",
      "Converts a regression tree to a classification tree by re-fitting on the same training data with a categorical Y",
      "Cuts back useless branches using cross validation, producing a smaller tree that should generalize better"
    ],
    correctIndex: 3,
    explanation: "Pruning removes branches that don't improve cross-validated performance. Cleaner tree, less overfit, easier to interpret."
  },
  {
    id: 63,
    topic: "Logistic Regression",
    prompt: "A predicted probability is 0.8. What are the odds?",
    options: [
      "4",
      "0.2",
      "0.8",
      "0.25"
    ],
    correctIndex: 0,
    explanation: "Odds = p / (1 − p) = 0.8 / 0.2 = 4. So the event is 4× more likely to happen than not."
  },
  {
    id: 64,
    topic: "Logistic Regression",
    prompt: "What is the correct flow logistic regression uses to make predictions?",
    options: [
      "Linear equation produces log-odds → exponentiate to odds → convert to probability → apply cutoff to get label",
      "Start with the label, calculate odds from the label, convert odds to probability, then output log-odds as final result",
      "Compute probability directly from predictors via least-squares regression, then assign a label using a 0.5 cutoff",
      "Compute log-odds from predictors and assign a label directly without going through probability or any cutoff step"
    ],
    correctIndex: 0,
    explanation: "Logistic flow: predictors are combined linearly to produce log-odds → exp() converts to odds → odds → probability via p = odds/(1+odds) → cutoff (e.g. 0.5) → TRUE/FALSE label."
  },
  {
    id: 65,
    topic: "Logistic Regression",
    prompt: "Why does logistic regression model LOG-ODDS (not probability directly)?",
    options: [
      "Log-odds are always between 0 and 1, so they fit cleanly into a probability framework with no need for transformation",
      "Log-odds are simpler to compute on a calculator and require fewer operations than working with raw probability values",
      "Probability cannot be predicted by software without specialized statistical packages designed exclusively for binary outcomes",
      "Probability has a bounded range (0 to 1) and is non-linear in predictors; log-odds are unbounded and linear in predictors, so a linear model fits naturally"
    ],
    correctIndex: 3,
    explanation: "A linear regression model would output anything from -∞ to +∞, but probability must be 0-1. Log-odds also range -∞ to +∞ AND are linear in predictors, so they fit a linear-style model perfectly. Then you transform back."
  },
  {
    id: 66,
    topic: "Logistic Regression",
    prompt: "What does predict(model, test, type=\"response\") return for a logistic regression model?",
    options: [
      "TRUE/FALSE class labels",
      "Log-odds (the linear part of the model)",
      "Coefficients of the model",
      "Probabilities between 0 and 1"
    ],
    correctIndex: 3,
    explanation: "type=\"response\" returns probabilities. Without it, you get log-odds. To get TRUE/FALSE you apply a cutoff: predictions > 0.5."
  },
  {
    id: 67,
    topic: "Classification Evaluation",
    prompt: "Confusion matrix:\n                actual=TRUE   actual=FALSE\npred=TRUE          80              20\npred=FALSE         10              90\n\nWhat is the error rate?",
    options: [
      "0.10",
      "0.15",
      "0.20",
      "0.30"
    ],
    correctIndex: 1,
    explanation: "Errors = false positives + false negatives = 20 + 10 = 30. Total = 200. Error rate = 30 / 200 = 0.15."
  },
  {
    id: 68,
    topic: "Classification Evaluation",
    prompt: "Same matrix:\n                actual=TRUE   actual=FALSE\npred=TRUE          80              20\npred=FALSE         10              90\n\nWhat is the SENSITIVITY (true positive rate)?",
    options: [
      "0.80",
      "0.82",
      "0.89",
      "0.90"
    ],
    correctIndex: 2,
    explanation: "Sensitivity = TP / (TP + FN) = 80 / (80 + 10) = 80 / 90 ≈ 0.89. Of all the actual positives (90), we caught 80."
  },
  {
    id: 69,
    topic: "Classification Evaluation",
    prompt: "Same matrix:\n                actual=TRUE   actual=FALSE\npred=TRUE          80              20\npred=FALSE         10              90\n\nWhat is the SPECIFICITY (true negative rate)?",
    options: [
      "0.20",
      "0.82",
      "0.90",
      "0.85"
    ],
    correctIndex: 1,
    explanation: "Specificity = TN / (TN + FP) = 90 / (90 + 20) = 90 / 110 ≈ 0.82. Of all the actual negatives (110), we correctly rejected 90."
  },
  {
    id: 70,
    topic: "Classification Evaluation",
    prompt: "Which is a Type I error (false positive)?",
    options: [
      "Predicted TRUE, actual FALSE",
      "Predicted FALSE, actual TRUE",
      "Predicted TRUE, actual TRUE",
      "Predicted FALSE, actual FALSE"
    ],
    correctIndex: 0,
    explanation: "Type I = False Positive = predicted TRUE but the truth was FALSE. Type II = False Negative = predicted FALSE but the truth was TRUE."
  },
  {
    id: 71,
    topic: "Classification Evaluation",
    prompt: "In your training set, 70% of observations are class A and 30% are class B. What is the BENCHMARK error rate (predicting the mode for everything)?",
    options: [
      "0.30",
      "0.70",
      "0.50",
      "0.00"
    ],
    correctIndex: 0,
    explanation: "Benchmark predicts the mode (A, the most common class) for everything. It is correct on the 70% that are A, wrong on the 30% that are B. Benchmark error rate = 0.30. Your model should beat this."
  },
  {
    id: 72,
    topic: "Classification Evaluation",
    prompt: "You LOWER the cutoff from 0.5 to 0.3. What happens?",
    options: [
      "Both sensitivity and specificity go up because the model becomes more confident at every probability threshold",
      "Both sensitivity and specificity go down because lowering the cutoff weakens the model's overall discriminative power",
      "Nothing changes — the cutoff is unrelated to the underlying model and does not affect classification metrics",
      "Sensitivity goes UP, specificity goes DOWN (you predict more positives, catch more true positives but also more false positives)"
    ],
    correctIndex: 3,
    explanation: "Lowering the cutoff = predicting positive more easily. You catch more real positives (↑ sensitivity) but also flag more negatives as positive (↓ specificity)."
  },
  {
    id: 73,
    topic: "Classification Evaluation",
    prompt: "On an ROC curve, what do the axes represent?",
    options: [
      "Y = error rate, X = cutoff value applied to the predicted probabilities",
      "Y = sensitivity (True Positive Rate), X = 1 − specificity (False Positive Rate)",
      "Y = precision (positive predictive value), X = recall (true positive rate)",
      "Y = overall accuracy of the model, X = number of training observations used"
    ],
    correctIndex: 1,
    explanation: "ROC plots TPR (sensitivity) on the Y axis vs FPR (1 − specificity) on the X axis, traced across all cutoffs. The IDEAL point is top-left (TPR=1, FPR=0)."
  },
  {
    id: 74,
    topic: "Classification Evaluation",
    prompt: "What does an AUC (Area Under ROC Curve) value of 0.5 mean?",
    options: [
      "The model is perfect",
      "The model is the worst possible",
      "The model is no better than random guessing",
      "The model has 50% accuracy"
    ],
    correctIndex: 2,
    explanation: "AUC = 0.5 → random. AUC closer to 1 → better than random. AUC = 1 → perfect ranking. AUC < 0.5 → worse than random (you could flip predictions to do better)."
  },
  {
    id: 75,
    topic: "Classification Evaluation",
    prompt: "On the ROC curve, where is cutoff = 0?",
    options: [
      "Bottom-left (predicts FALSE for everything → TPR=0, FPR=0)",
      "Top-right (predicts TRUE for everything → TPR=1, FPR=1)",
      "Top-left (perfect classifier)",
      "In the middle"
    ],
    correctIndex: 1,
    explanation: "Cutoff=0 means everything with probability >0 gets predicted TRUE — so EVERY observation is predicted TRUE. TPR=1 (caught all positives), FPR=1 (also flagged all negatives). Top-right corner."
  },
  {
    id: 76,
    topic: "Clustering",
    prompt: "What is the PURPOSE of clustering?",
    options: [
      "To predict a categorical outcome",
      "To group similar observations together based on their feature values, without using a target variable",
      "To minimize the sum of squared errors between predictions and observations",
      "To rank items by importance"
    ],
    correctIndex: 1,
    explanation: "Clustering is UNSUPERVISED — no Y. It finds natural groupings based on feature similarity (distance)."
  },
  {
    id: 77,
    topic: "Clustering",
    prompt: "In k-means, what role do cluster CENTERS play?",
    options: [
      "They are the first observations alphabetically in the dataset, fixed at the start of every iteration",
      "They are the average (mean) of all observations currently assigned to that cluster — each iteration moves them to the new mean",
      "They are randomly relocated every iteration to help the algorithm escape local optima and explore new partitions",
      "They are fixed by the user before the algorithm begins and never change throughout the iterative process"
    ],
    correctIndex: 1,
    explanation: "k-means iterates: assign each point to its closest center, then move each center to the mean of its assigned points. Repeat."
  },
  {
    id: 78,
    topic: "Clustering",
    prompt: "When does the k-means algorithm STOP?",
    options: [
      "After exactly 10 iterations",
      "When all clusters have the same size",
      "When the user manually quits",
      "When the centers stop moving (assignments stabilize)"
    ],
    correctIndex: 3,
    explanation: "k-means converges when the assignments don't change between iterations — equivalently, when the centers stop moving. nstart=25 just means try 25 random starts and pick the best converged solution."
  },
  {
    id: 79,
    topic: "Clustering",
    prompt: "After running model = kmeans(df, centers=3), you check model$size. What does it return?",
    options: [
      "The diameter of each cluster",
      "The number of variables used",
      "The total dataset size",
      "The number of observations in each of the 3 clusters"
    ],
    correctIndex: 3,
    explanation: "model$size = vector showing how many observations landed in each cluster. model$centers = the average value of each variable per cluster (the cluster \"profile\")."
  },
  {
    id: 80,
    topic: "Clustering",
    prompt: "You run elbowChart(df) and see within-cluster sum-of-squares drop sharply from k=1 to k=3, then mostly flatten. What k should you choose?",
    options: [
      "k = 1",
      "k = 3 (the elbow)",
      "k = 10",
      "k = the number of variables"
    ],
    correctIndex: 1,
    explanation: "The \"elbow\" is where additional clusters stop helping much. Pick the k at the bend — extra clusters past it just split noise."
  },
  {
    id: 81,
    topic: "Clustering",
    prompt: "In hierarchical clustering, COMPLETE linkage measures cluster distance as:",
    options: [
      "Distance between the farthest pair of points across the two clusters (worst case)",
      "Distance between the closest pair of points across the two clusters",
      "Average distance over all pairs of points across the two clusters",
      "Distance between the cluster centers"
    ],
    correctIndex: 0,
    explanation: "Complete = farthest pair. Single = closest pair (friends-of-friends). Average = mean over all pairs."
  },
  {
    id: 82,
    topic: "Clustering",
    prompt: "A key conceptual difference between k-means and hierarchical clustering:",
    options: [
      "k-means is supervised because it learns optimal centers from labels; hierarchical is unsupervised and label-free",
      "k-means is faster only on text data because it leverages word frequency vectors more efficiently than other formats",
      "Hierarchical clustering does not use distance — it instead groups observations by shared categorical attribute values",
      "k-means requires you to choose k upfront; hierarchical builds the whole tree (dendrogram) and lets you choose k after"
    ],
    correctIndex: 3,
    explanation: "k-means: pick k first, run algorithm. Hierarchical: build full tree, cut it at any level to choose k. Both are unsupervised, both are distance based."
  },
  {
    id: 83,
    topic: "Clustering",
    prompt: "Before running k-means or hierarchical clustering, you should:",
    options: [
      "Remove all numeric variables and keep only the categorical ones for cleaner cluster interpretation",
      "Convert all variables to factors so the algorithm can use category-based distance metrics",
      "Train the model on only half the data, holding the rest out as a test set for evaluation",
      "Standardize variables (mean=0, SD=1) so one variable does not dominate the distance calculation"
    ],
    correctIndex: 3,
    explanation: "Distance based methods need variables on the same scale. Without standardization, a variable with larger range (e.g. precipitation 0-500) dominates over a smaller-range variable (e.g. temperature 0-35)."
  },
  {
    id: 84,
    topic: "Association Rules",
    prompt: "In an association rule \"If {bread, butter} then {milk}\", which side is the ANTECEDENT?",
    options: [
      "{milk} (the RHS, \"then this\")",
      "{bread, butter} (the LHS, \"if you have these\")",
      "Neither — there is no antecedent in association rules",
      "Both sides equally"
    ],
    correctIndex: 1,
    explanation: "Antecedent = LHS = \"if you have these items\". Consequent = RHS = \"then you also have this\". A → C."
  },
  {
    id: 85,
    topic: "Association Rules",
    prompt: "A grocery store has 1,000 transactions. 200 contain milk. What is the SUPPORT of milk?",
    options: [
      "0.50",
      "0.20",
      "0.80",
      "1.00"
    ],
    correctIndex: 1,
    explanation: "Support = how often something appears in the dataset. Support(milk) = 200 / 1000 = 0.20 = 20% of transactions contain milk."
  },
  {
    id: 86,
    topic: "Association Rules",
    prompt: "1,000 transactions. 100 contain bread. Of those 100, 80 also contain butter. What is the CONFIDENCE of the rule {bread} → {butter}?",
    options: [
      "0.80",
      "0.08",
      "0.10",
      "0.20"
    ],
    correctIndex: 0,
    explanation: "Confidence = P(consequent | antecedent) = (transactions with both) / (transactions with antecedent) = 80 / 100 = 0.80. \"Given a customer bought bread, 80% of the time they also bought butter.\""
  },
  {
    id: 87,
    topic: "Association Rules",
    prompt: "1,000 transactions. 100 have bread, 200 have butter, 80 have both. What is the LIFT of {bread} → {butter}?\n\nLift = Confidence(A→C) / Support(C)",
    options: [
      "1.0",
      "4.0",
      "0.4",
      "8.0"
    ],
    correctIndex: 1,
    explanation: "Confidence(bread → butter) = 80/100 = 0.80. Support(butter) = 200/1000 = 0.20. Lift = 0.80 / 0.20 = 4.0. Butter is 4× more likely when bread is in the basket vs random."
  },
  {
    id: 88,
    topic: "Association Rules",
    prompt: "What does a LIFT value of 1.0 indicate?",
    options: [
      "A very strong association — the rule is highly useful for predicting the consequent given the antecedent",
      "A perfect rule — whenever the antecedent A appears, the consequent C is guaranteed to also appear",
      "A strongly negative association — A appearing makes C significantly less likely than random chance",
      "A and C are independent — knowing A tells you nothing extra about C, the rule is useless"
    ],
    correctIndex: 3,
    explanation: "Lift = 1 → A and C are independent. Lift > 1 → C more likely with A (good rule). Lift < 1 → C less likely with A."
  },
  {
    id: 89,
    topic: "Association Rules",
    prompt: "Which best describes the THREE metrics for association rules?",
    options: [
      "Support = strength, Confidence = how often, Lift = direction",
      "Support = lift × confidence, Confidence = independent, Lift = always 1",
      "Support = how often, Confidence = given X how likely Y, Lift = strength of relationship vs random",
      "They all measure the same thing"
    ],
    correctIndex: 2,
    explanation: "Memorize this: SUPPORT = how often the rule appears (frequency). CONFIDENCE = given antecedent, how likely consequent. LIFT = how much stronger than random. Three different questions."
  },
  {
    id: 90,
    topic: "Association Rules",
    prompt: "A rule has high CONFIDENCE but LIFT close to 1. What does this mean?",
    options: [
      "The rule is very useful because high confidence reliably predicts the consequent in the vast majority of transactions",
      "The consequent is very common in the data, so high confidence is just because everyone buys it — not because the antecedent matters",
      "The rule is statistically impossible because lift can never equal 1 in a dataset where confidence is also a meaningful number",
      "You should ignore confidence as a metric and only consider lift, since lift is the only number that captures rule strength"
    ],
    correctIndex: 1,
    explanation: "High confidence + lift ≈ 1 = the consequent is just popular. Example: 99% of transactions contain milk anyway, so confidence(anything → milk) is automatically high. Lift corrects for this baseline."
  },
  {
    id: 91,
    topic: "Foundations",
    prompt: "How does LINEAR REGRESSION make a prediction for a new observation?",
    options: [
      "It finds the single closest training observation by feature distance and copies its Y value as the prediction",
      "It plugs the new observation's feature values into the fitted equation Y = β₀ + β₁X₁ + β₂X₂ + ...",
      "It averages all training Y values, ignoring the new observation's specific feature values entirely",
      "It builds a decision tree from the training data and follows the new observation down to a leaf node"
    ],
    correctIndex: 1,
    explanation: "Linear regression learns coefficients β. Prediction = plug in X values into the equation."
  },
  {
    id: 92,
    topic: "Foundations",
    prompt: "How does kNN REGRESSION make a prediction for a new observation?",
    options: [
      "It uses a fitted equation",
      "It builds a tree of decisions",
      "It picks the most common Y value in the entire dataset",
      "It finds the k closest training observations by distance and averages their Y values"
    ],
    correctIndex: 3,
    explanation: "kNN: distance-based, no equation, just lookup. Find k closest neighbors → average their outcomes (regression) or vote (classification)."
  },
  {
    id: 93,
    topic: "Foundations",
    prompt: "How does a CLASSIFICATION TREE make a prediction for a new observation?",
    options: [
      "It averages every training Y value, weighted by the new observation's distance from each training point",
      "It runs the observation down the tree along split rules until reaching a leaf, then predicts the majority class at that leaf",
      "It computes log-odds for the new observation and applies a 0.5 cutoff to assign it to a class label",
      "It finds the closest training neighbors in feature space and votes among them to assign a final class label"
    ],
    correctIndex: 1,
    explanation: "Trees: traverse splits → reach a leaf → predict the majority class (classification) or mean Y (regression) at that leaf."
  },
  {
    id: 94,
    topic: "Foundations",
    prompt: "For each combination of input/output, which model fits?\n\nNumeric input + Numeric output:",
    options: [
      "Naive Bayes",
      "Logistic regression",
      "Linear regression OR kNN regression",
      "Classification tree"
    ],
    correctIndex: 2,
    explanation: "Numeric Y → regression family. Linear regression and kNN regression both work with numeric inputs to predict a numeric outcome."
  },
  {
    id: 95,
    topic: "R Workflow",
    prompt: "Without running it, can you tell what kind of model this code builds?\n\nmodel = glm(Default ~ ., data=training, family=binomial)",
    options: [
      "Logistic regression (binary classifier)",
      "Linear regression",
      "kNN classification",
      "Decision tree"
    ],
    correctIndex: 0,
    explanation: "glm + family=binomial = logistic regression. Predict a binary outcome."
  },
  {
    id: 96,
    topic: "R Workflow",
    prompt: "What does this line do?\n\npredictions_TF = (predictions > 0.5)",
    options: [
      "Creates a vector of predicted probabilities for each observation in the test data",
      "Trains a new model using a 0.5 threshold on the training observations",
      "Applies a 0.5 cutoff to convert probabilities to TRUE/FALSE labels",
      "Calculates the classification error rate by comparing predictions to observations"
    ],
    correctIndex: 2,
    explanation: "Logistic regression predict() with type=\"response\" gives probabilities. Comparing to 0.5 returns TRUE/FALSE — a vector of class labels."
  },
  {
    id: 97,
    topic: "R Workflow",
    prompt: "You run: error_rate = sum(predictions != observations) / nrow(test). What does this calculate?",
    options: [
      "Sensitivity — the proportion of actual positives the model correctly identified as positives",
      "The proportion of test rows where the prediction does not match the actual observation — the classification error rate",
      "The benchmark error rate — the rate you would get by predicting the mode of the target for every observation",
      "RMSE — the average squared distance between predicted and actual values across the test set"
    ],
    correctIndex: 1,
    explanation: "!= is \"not equal\". Sum of mismatches / total = error rate. For benchmark you would predict the MODE for everything and compute the same thing."
  },
  {
    id: 98,
    topic: "ggplot",
    prompt: "Key difference between geom_bar() and geom_histogram()?",
    options: [
      "They are identical functions in ggplot2 — the names are just two different aliases for the same chart type",
      "geom_bar() requires a y aesthetic to work properly; geom_histogram() does not need any y aesthetic at all",
      "geom_histogram() only works with text data and converts strings into character-frequency distributions",
      "geom_bar() is for CATEGORICAL x; geom_histogram() is for NUMERIC x (binned into ranges)"
    ],
    correctIndex: 3,
    explanation: "geom_bar: categorical x, height = count (default) or value (with stat=\"identity\"). geom_histogram: numeric x, automatically bins values and shows count per bin."
  },
  {
    id: 99,
    topic: "Association Rules",
    prompt: "In the arules output, what does COVERAGE measure?",
    options: [
      "The probability of the consequent across the whole dataset",
      "The number of unique items in the dataset",
      "The probability of the antecedent across the whole dataset",
      "The number of rules generated"
    ],
    correctIndex: 2,
    explanation: "Coverage = how often the antecedent (LHS) appears in the data. Equivalent to support of just the antecedent. If coverage is tiny, the rule applies to too few customers to matter."
  },
  {
    id: 100,
    topic: "Association Rules",
    prompt: "arules output shows the rule length distribution:\n\nlength:  2    3     4     5      6     7     8\ncount:  141 2278 9391 16253 11424 2513  32\n\nWhich statement is true?",
    options: [
      "The high end (length 7-8) lacks SUPPORT — long rules are too specific to appear often. The low end (length 2) lacks CONFIDENCE — short rules are too general.",
      "The dataset is too small to generate reliable association rules, as the wide spread of rule lengths is a sign of noise",
      "All rules are equally useful regardless of length, since support and confidence balance each other out across all rule sizes",
      "You should always prefer the longest rules because they capture the most specific buyer patterns and have the highest lift"
    ],
    correctIndex: 0,
    explanation: "Rule-length tradeoff: long rules have fewer transactions matching all the items (low support). Short rules cover more transactions but the consequent is less specific (low confidence). Sweet spot is in the middle (lengths 4-6)."
  },
  {
    id: 101,
    topic: "Association Rules",
    prompt: "A rule {milk, bread} → {butter} has length 3 (LHS has 2 items, RHS has 1). If you increase the rule length, what tends to happen?",
    options: [
      "Support goes DOWN (fewer transactions match more items), confidence often goes UP (more specific rules are stronger when they do match)",
      "Support goes UP because larger rules cover more items, and confidence goes UP because longer rules are more reliable",
      "Both support and confidence stay exactly the same regardless of rule length, by mathematical definition of the metrics",
      "Lift always equals 1 because longer rules are mathematically equivalent to a set of independent items in a basket"
    ],
    correctIndex: 0,
    explanation: "More items in the rule = fewer transactions match them all = lower support. But when those rare matches happen, the rule tends to be highly predictive = higher confidence. This is the trade arules navigates."
  },
  {
    id: 102,
    topic: "Association Rules",
    prompt: "Which formula correctly defines LIFT for the rule A → C?",
    options: [
      "Lift = P(A) × P(C)",
      "Lift = Support(A) − Support(C)",
      "Lift = Confidence × Support",
      "Lift = P(C | A) / P(C), equivalently P(A | C) / P(A)"
    ],
    correctIndex: 3,
    explanation: "Lift = how much more likely is C given A vs random. Two equivalent formulations: P(C|A)/P(C) and P(A|C)/P(A) — both reduce to P(A AND C) / (P(A) × P(C))."
  },
  {
    id: 103,
    topic: "Association Rules",
    prompt: "1,000 transactions. {diapers} appears in 300, {beer} appears in 250, both appear in 150. What is LIFT for {diapers} → {beer}?",
    options: [
      "2.0",
      "1.0",
      "0.5",
      "4.0"
    ],
    correctIndex: 0,
    explanation: "Confidence(diapers → beer) = 150/300 = 0.5. Support(beer) = 250/1000 = 0.25. Lift = 0.5/0.25 = 2.0. Beer is 2× more likely when diapers are in the basket vs random."
  },
  {
    id: 104,
    topic: "Association Rules",
    prompt: "In the context of association rules, sensitivity refers to:",
    options: [
      "The total number of rules generated",
      "The probability of the antecedent across the dataset",
      "The percentage of observed TRUEs (positive cases) the rule correctly predicts",
      "The number of items in the antecedent"
    ],
    correctIndex: 2,
    explanation: "Sensitivity (review PDF definition) = amount of TRUEs predicted correctly. Specificity = amount of FALSEs predicted correctly. Both apply when you treat a rule as a classifier (apply rule → predict consequent)."
  },
  {
    id: 105,
    topic: "Association Rules",
    prompt: "You generated 30,000 rules with arules. To find the most actionable ones, you should sort by:",
    options: [
      "Support only — pick the most common rules and ignore both confidence and lift since support already captures usefulness",
      "Lift (high) and minimum support / confidence thresholds — strongest signal that survived a frequency floor",
      "Length only — pick the longest rules because they encode the most specific, actionable buyer patterns in the data",
      "Random selection from the rule set, which avoids any bias from over-relying on any single metric or threshold"
    ],
    correctIndex: 1,
    explanation: "High support alone gives you boring \"everyone buys milk\" rules. High lift alone gives you rare rules. Best practice: filter by minimum support + minimum confidence first, then sort the survivors by lift."
  },
];
