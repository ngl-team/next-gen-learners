export type Question = {
  id: number;
  topic: string;
  prompt: string;
  code?: string;
  table?: { headers: string[]; rows: string[][] };
  options: string[];
  correctIndex: number;
  explanation: string;
  trap?: string;
  fromMidterm?: boolean;
  youGotWrong?: boolean;
};

export const questions: Question[] =
[
  {
    id: 1,
    topic: "Technique Matching",
    prompt: "A real estate company wants to predict the selling price of a house based on square footage, number of bedrooms, and location. Which data mining technique is most appropriate?",
    options: [
      "Clustering",
      "Regression",
      "Association Rules",
      "Classification"
    ],
    correctIndex: 1,
    explanation: "The outcome (price) is NUMERIC. Numeric outcome → Regression.",
    fromMidterm: true
  },
  {
    id: 2,
    topic: "Technique Matching",
    prompt: "A bank wants to automatically label credit card transactions as \"fraudulent\" or \"not fraudulent\". Which technique is most appropriate?",
    options: [
      "Clustering",
      "Association Rules",
      "Regression",
      "Classification"
    ],
    correctIndex: 3,
    explanation: "The outcome is a CATEGORY (fraudulent / not fraudulent). Categorical outcome → Classification.",
    fromMidterm: true
  },
  {
    id: 3,
    topic: "Technique Matching",
    prompt: "An online grocery store analyzes customer baskets to identify items frequently purchased together (e.g., chips and salsa). Which technique is most appropriate?",
    options: [
      "Regression",
      "Classification",
      "Association Rules",
      "Clustering"
    ],
    correctIndex: 2,
    explanation: "\"Items frequently purchased together\" / \"baskets\" → Association Rules. This is the classic market basket pattern.",
    trap: "Trap: Clustering. Clustering groups SIMILAR PEOPLE; Association Rules groups ITEMS that co-occur. \"Together in a basket\" = association rules.",
    fromMidterm: true,
    youGotWrong: true
  },
  {
    id: 4,
    topic: "Technique Matching",
    prompt: "A streaming service analyzes viewing behavior (time of day, genre, session length) to discover natural groupings of users with similar watching patterns. Which technique is most appropriate?",
    options: [
      "Regression",
      "Association Rules",
      "Classification",
      "Clustering"
    ],
    correctIndex: 3,
    explanation: "\"Discover natural groupings of USERS\" → Clustering. Users with similar profiles, no Y target.",
    trap: "Trap: Association Rules. AR is for items co-occurring, NOT for grouping users by similarity."
  },
  {
    id: 5,
    topic: "Technique Matching",
    prompt: "A university wants to predict a student's numeric final course grade (e.g. 96, 84) from hours studied, attendance, and prior GPA. Which technique?",
    options: [
      "Regression",
      "Association Rules",
      "Classification",
      "Clustering"
    ],
    correctIndex: 0,
    explanation: "Numeric grade → Regression. The word \"numeric\" is your tell.",
    fromMidterm: true
  },
  {
    id: 6,
    topic: "Technique Matching",
    prompt: "A fitness app analyzes workout metrics to identify natural groupings of users with similar training habits. Which technique?",
    options: [
      "Classification",
      "Association Rules",
      "Clustering",
      "Regression"
    ],
    correctIndex: 2,
    explanation: "Natural groupings of users, no Y target → Clustering."
  },
  {
    id: 7,
    topic: "R Basics",
    prompt: "Which line of code creates a new object in R?",
    options: [
      "df$Price == 100",
      "prices = c(100, 200, 300)",
      "View(df)",
      "mean(df$price)"
    ],
    correctIndex: 1,
    explanation: "Object creation needs assignment (= or <-). c() creates a vector. The other options reference existing data, view it, or test equality — none create a new object.",
    fromMidterm: true
  },
  {
    id: 8,
    topic: "R Basics",
    prompt: "What happens when this code runs?\n\nx = 5\nx = x + 2",
    options: [
      "The value of x is updated to 7",
      "A new object named x2 is created",
      "R stores both values for x",
      "R throws an error because x already exists"
    ],
    correctIndex: 0,
    explanation: "Reassignment overwrites x. x was 5, now x = 5 + 2 = 7.",
    fromMidterm: true
  },
  {
    id: 9,
    topic: "R Basics",
    prompt: "When importing a data frame from RStudio for the first time without running any other code, what is the most likely format that the variable \"Class\" defaults to?\n(Class column contains values like 1, 2, 3, 4 representing freshman/sophomore/junior/senior)",
    options: [
      "Logical",
      "Character",
      "Integer",
      "Factor"
    ],
    correctIndex: 2,
    explanation: "R defaults to Integer because the values look like numbers. YOU have to convert it to factor with as.factor() since the integers actually represent categories.",
    fromMidterm: true
  },
  {
    id: 10,
    topic: "R Basics",
    prompt: "What does df[7, ] return?",
    options: [
      "All rows in column 7",
      "The first 7 rows",
      "The 7th row and all columns",
      "An error because there is no second argument"
    ],
    correctIndex: 2,
    explanation: "Format is df[row, col]. 7 = row 7. Blank after comma = ALL columns.",
    fromMidterm: true
  },
  {
    id: 11,
    topic: "R Basics",
    prompt: "Which line of code returns all rows for both the \"Final_Grade\" and \"Hours_Studied\" columns?",
    options: [
      "df[ , \"Final_Grade\" + \"Hours_Studied\"]",
      "df[\"Final_Grade\" + \"Hours_Studied\"]",
      "df[ , c(\"Final_Grade\", \"Hours_Studied\")]",
      "df[c(\"Final_Grade\", \"Hours_Studied\")]"
    ],
    correctIndex: 2,
    explanation: "Multiple columns require c(...). Comma-blank-c(...) = all rows, those named columns.",
    trap: "\"Final_Grade\" + \"Hours_Studied\" is invalid — you cannot add strings.",
    fromMidterm: true
  },
  {
    id: 12,
    topic: "R Basics",
    prompt: "Which line of code returns all rows and columns except for the second row?",
    options: [
      "df[1:5 -2, ]",
      "df[-2]",
      "df[ ,-2]",
      "df[-2, ]"
    ],
    correctIndex: 3,
    explanation: "Negative index in the row position = \"everything except\". df[-2, ] = all rows except row 2, all columns.",
    trap: "df[ ,-2] removes column 2, not row 2.",
    fromMidterm: true
  },
  {
    id: 13,
    topic: "R Basics",
    prompt: "Suppose we ran df[1, 3]. Given the table below, what value is returned?",
    table: {
      headers: [
        "Final_Grade",
        "Class",
        "Hours_Studied"
      ],
      rows: [
        [
          "89",
          "1",
          "2"
        ],
        [
          "92",
          "3",
          "3"
        ],
        [
          "81",
          "4",
          "7"
        ],
        [
          "76",
          "2",
          "5"
        ],
        [
          "95",
          "1",
          "7"
        ]
      ]
    },
    options: [
      "89",
      "95",
      "2",
      "81"
    ],
    correctIndex: 2,
    explanation: "df[1, 3] = row 1, column 3. Row 1 of Hours_Studied = 2.",
    fromMidterm: true
  },
  {
    id: 14,
    topic: "R Basics",
    prompt: "Using the same table, what value is stored in \"sum\"?\n\nx = df[5,1]\ny = df[4,3]\nsum = x+y",
    table: {
      headers: [
        "Final_Grade",
        "Class",
        "Hours_Studied"
      ],
      rows: [
        [
          "89",
          "1",
          "2"
        ],
        [
          "92",
          "3",
          "3"
        ],
        [
          "81",
          "4",
          "7"
        ],
        [
          "76",
          "2",
          "5"
        ],
        [
          "95",
          "1",
          "7"
        ]
      ]
    },
    options: [
      "94",
      "76",
      "102",
      "100"
    ],
    correctIndex: 3,
    explanation: "df[5,1] = 95 (row 5, Final_Grade). df[4,3] = 5 (row 4, Hours_Studied). 95 + 5 = 100.",
    fromMidterm: true
  },
  {
    id: 15,
    topic: "R Basics",
    prompt: "Which function does NOT modify the dataset, but only displays information about it?",
    options: [
      "summary()",
      "View()",
      "str()",
      "All responses listed here"
    ],
    correctIndex: 3,
    explanation: "View, summary, and str all only DISPLAY data. None modify it."
  },
  {
    id: 16,
    topic: "ggplot",
    prompt: "Which of the following are core building blocks of a ggplot visualization?",
    options: [
      "Points, bars, and box plots",
      "Titles, captions, and themes",
      "Axes, legends, and colors",
      "Data, aesthetics (aes), and geoms"
    ],
    correctIndex: 3,
    explanation: "Every ggplot has data + aes + geoms. Everything else is decoration.",
    fromMidterm: true
  },
  {
    id: 17,
    topic: "ggplot",
    prompt: "Product Sales table has rows: A/East/120/2400, B/West/85/1700, C/East/60/1500, D/South/140/2800, E/West/95/1900. The chart shows three thick blue horizontal bars (one per region) where the LENGTH of each bar equals total revenue. Which code generated it?",
    options: [
      "ggplot(df, aes(y=Region, x=Revenue)) + geom_bar(stat=\"identity\", fill=\"dark blue\")",
      "ggplot(df, aes(y=Region, fill=\"dark blue\")) + geom_bar()",
      "ggplot(df, aes(y=Region, x=Count)) + geom_bar(fill=\"dark blue\")",
      "ggplot(df, aes(y=Region)) + geom_bar(fill=\"dark blue\")"
    ],
    correctIndex: 0,
    explanation: "The bar LENGTH represents the actual Revenue value, not a count. That requires stat=\"identity\" + a y/x mapped to a numeric variable.",
    trap: "Default geom_bar() COUNTS rows. To plot a real value (revenue, sales), you must use stat=\"identity\".",
    fromMidterm: true,
    youGotWrong: true
  },
  {
    id: 18,
    topic: "ggplot",
    prompt: "You want total revenue broken down by product within each region (e.g. what portion of East's revenue came from Product A). Which code is best?",
    options: [
      "ggplot(df, aes(x=Region, y=Revenue)) + geom_point()",
      "ggplot(df, aes(x=Region, y=Revenue, fill=Product)) + geom_bar(stat=\"identity\")",
      "ggplot(df, aes(x=Region, y=Revenue, fill=Product)) + geom_stacked()",
      "ggplot(df, aes(x=Region, y=Revenue)) + geom_histogram(position=Product)"
    ],
    correctIndex: 1,
    explanation: "Stacked bar = geom_bar(stat=\"identity\") with fill = the breakdown variable. stat=\"identity\" because revenue is a value, not a count. fill=Product creates the stacking.",
    trap: "geom_stacked() does NOT exist. There is no such function. Always geom_bar with stat=\"identity\" + fill.",
    fromMidterm: true,
    youGotWrong: true
  },
  {
    id: 19,
    topic: "ggplot",
    prompt: "You want to understand how revenue values are distributed including statistical info like the median revenue value. Which line of code is most appropriate?",
    options: [
      "ggplot(df, aes(x=Units_Sold, y=Revenue)) + geom_point()",
      "ggplot(df, aes(x=Revenue)) + geom_boxplot()",
      "ggplot(df, aes(x=Revenue)) + geom_bar()",
      "ggplot(df, aes(x=Revenue)) + geom_point()"
    ],
    correctIndex: 1,
    explanation: "Boxplot = distribution summary with median, quartiles, outliers. One numeric variable.",
    fromMidterm: true
  },
  {
    id: 20,
    topic: "ggplot",
    prompt: "You want to explore the relationship between units sold and revenue (does higher units mean higher revenue?). Which code is best?",
    options: [
      "ggplot(df, aes(x=Units_Sold, y=Revenue)) + geom_line()",
      "ggplot(df, aes(x=Units_Sold, y=Revenue)) + geom_bar(stat=\"identity\")",
      "ggplot(df, aes(x=Revenue)) + geom_histogram()",
      "ggplot(df, aes(x=Units_Sold, y=Revenue)) + geom_point()"
    ],
    correctIndex: 3,
    explanation: "Two numeric variables, looking at the relationship → scatterplot = geom_point().",
    fromMidterm: true
  },
  {
    id: 21,
    topic: "ggplot",
    prompt: "You want to visualize the range of final grades to identify where most students' scores are concentrated. Which visualization?",
    options: [
      "Scatterplot",
      "Stacked bar",
      "Histogram",
      "Line chart"
    ],
    correctIndex: 2,
    explanation: "Range + concentration of one numeric variable = histogram.",
    fromMidterm: true
  },
  {
    id: 22,
    topic: "ggplot",
    prompt: "A manager wants to compare total ridership between casual and registered users. Best chart?",
    options: [
      "Line chart",
      "Bar chart",
      "Scatter plot",
      "Histogram"
    ],
    correctIndex: 1,
    explanation: "Comparing totals across categories → bar chart (with stat=\"identity\" since it's a total, not a count).",
    fromMidterm: true
  },
  {
    id: 23,
    topic: "ggplot",
    prompt: "A city wants to show how total daily bike rentals are broken down between casual and registered users. Best chart?",
    options: [
      "Line chart",
      "Histogram",
      "Stacked bar chart",
      "Scatterplot"
    ],
    correctIndex: 2,
    explanation: "\"Broken down between\" two categories that sum to a total = stacked bar (composition).",
    fromMidterm: true
  },
  {
    id: 24,
    topic: "Linear Regression",
    prompt: "Which statement best describes how a linear regression model is fit?",
    options: [
      "It chooses coefficients that maximize the explained variance",
      "It chooses coefficients that minimize the absolute prediction errors",
      "It chooses coefficients that minimize the sum of squared errors",
      "It chooses the line that visually appears closest to most points"
    ],
    correctIndex: 2,
    explanation: "Linear regression minimizes the SUM OF SQUARED ERRORS (SSE). Squared so positive and negative errors don't cancel and so larger errors are penalized more.",
    fromMidterm: true
  },
  {
    id: 25,
    topic: "Linear Regression",
    prompt: "You run: model = lm(Price ~ Age + KM, data=training)\npredictions = predict(model, test)\n\nWhat does \"predictions\" contain?",
    options: [
      "The predicted prices for each observation in the test set",
      "The errors from the training set",
      "The actual observed prices in the test set",
      "The coefficients of the regression model"
    ],
    correctIndex: 0,
    explanation: "predict(model, test) applies the trained model to NEW data and returns predicted Y values for each row in test.",
    fromMidterm: true
  },
  {
    id: 26,
    topic: "Linear Regression",
    prompt: "A linear regression model: Price = 5,000 + 1,200*(Age). Which statement is true?",
    options: [
      "Each additional year of age changes the predicted price by the same amount",
      "The model assumes the price decreases at an accelerating rate as age increases",
      "The effect of a one year increase in age on price is larger for newer cars than for older cars",
      "The effect of age on price is larger for newer cars than older cars"
    ],
    correctIndex: 0,
    explanation: "Linear regression coefficients are CONSTANT — every additional unit of X has the same effect on Y. This is the \"linear\" part.",
    fromMidterm: true
  },
  {
    id: 27,
    topic: "Linear Regression",
    prompt: "A linear regression predicts used car price in euros: Price = 14,000 - 0.12*KM. How do you interpret the KM coefficient?",
    options: [
      "Cars lose 12% of their value per kilometer",
      "Each additional kilometer reduces price by 0.12 euros on average, all else equal",
      "Each additional kilometer reduces price by 12 euros",
      "Mileage reduces price by 0.12 euros in total"
    ],
    correctIndex: 1,
    explanation: "For each unit increase of KM, Y changes by the coefficient. Required language: \"on average\" + \"all else equal\" + correct units.",
    fromMidterm: true
  },
  {
    id: 28,
    topic: "Linear Regression — Dummies",
    prompt: "Coefficients: Salary = 38,000 + 12,000*Bachelors + 22,000*Masters + 1,000*YearsExperience. Education baseline = High School. Interpret the coefficient for Bachelors.",
    options: [
      "On average, someone with a Bachelor's earns $12,000 more than someone with a High School education, holding all else constant",
      "Bachelor's graduates earn exactly $12,000 per year of experience, before any other adjustments to the model are applied",
      "On average, Bachelor's degree holders earn $12,000 more than Master's degree holders, all else equal in the model",
      "$12,000 is the total predicted salary increase from having zero formal schooling up through a Bachelor's degree"
    ],
    correctIndex: 0,
    explanation: "Dummy variable coefficients compare to the BASELINE (held-out) level. Baseline here is High School. ALWAYS state which baseline you're comparing to.",
    trap: "Common mistake: forgetting to name the baseline (e.g. \"Bachelors earn $12,000 more\" without saying \"than High School\"). You lose points without it.",
    fromMidterm: true
  },
  {
    id: 29,
    topic: "Linear Regression — Dummies",
    prompt: "Boston Housing model: MEDV = 32.5 + 4.8*RM - 0.62*CRIM - 1.5*NTYPE_URB. NTYPE has levels SUB and URB, with SUB as baseline. Interpret the NTYPE_URB coefficient.",
    options: [
      "Urban houses are priced lower than suburban houses on average across the entire Boston housing dataset",
      "Being in an urban neighborhood decreases predicted home value by exactly $1,500 in absolute dollar terms",
      "Being in an urban neighborhood decreases predicted MEDV by $1,500 on average compared to a suburban neighborhood, all else equal",
      "Urban neighborhoods reduce a home's predicted price by 1.5% based on the percentage interpretation of the model coefficient"
    ],
    correctIndex: 2,
    explanation: "MEDV is in thousands → -1.5 = -$1,500. Compared to SUBURBAN (the baseline). All else equal.",
    trap: "You missed \"as compared to suburban\" twice on past quizzes. Always name the baseline. Always say \"on average\". Always check units (thousands here).",
    fromMidterm: true,
    youGotWrong: true
  },
  {
    id: 30,
    topic: "Linear Regression — Dummies",
    prompt: "Regression with Region (factor: Europe baseline, Asia, North America). Coefficient for RegionAsia = -2,500 (units: dollars). Interpret it.",
    options: [
      "On average, products from Asia cost $2,500 less than products from Europe, all else equal",
      "On average, products from Asia cost $2,500 less, all else equal",
      "Asian products are 2,500% cheaper",
      "Asia is the cheapest region"
    ],
    correctIndex: 0,
    explanation: "Always compare to the BASELINE region (Europe). \"On average\" + \"all else equal\" + named baseline.",
    trap: "You did this question on the midterm and got marked down for not saying \"as compared to Europe\".",
    fromMidterm: true,
    youGotWrong: true
  },
  {
    id: 31,
    topic: "Linear Regression",
    prompt: "You build a linear model called \"model\" and run summary(model). What does summary provide?",
    options: [
      "The amount of time R Studio took to generate the model",
      "Coefficients, p-values and fit statistics",
      "The predicted values",
      "A plot of errors"
    ],
    correctIndex: 1,
    explanation: "summary(model) returns coefficients, standard errors, p-values, R², F-statistic, residual stats — the full readable model output.",
    fromMidterm: true
  },
  {
    id: 32,
    topic: "Linear Regression",
    prompt: "After reviewing your linear model, your boss adds: model = step(model). Which is most likely your boss's concern?",
    options: [
      "The predictors were not scaled",
      "The outcome variable should be categorical",
      "The model did not outperform the benchmark",
      "The model may be overfitting the training data"
    ],
    correctIndex: 3,
    explanation: "step() is BACKWARD SELECTION — it removes weak predictors. The reason you'd remove predictors is to combat OVERFITTING. step() does not benchmark, scale, or change the outcome type.",
    trap: "You picked \"did not outperform benchmark\" on the midterm. step() has nothing to do with benchmarking. step = simplify model = address overfitting.",
    fromMidterm: true,
    youGotWrong: true
  },
  {
    id: 33,
    topic: "Train/Test",
    prompt: "A student's model achieves excellent performance on training data. The professor insists on evaluating it on a separate test set. Why?",
    options: [
      "To estimate how well the model will perform on new, unseen data",
      "To reduce the number of predictors",
      "To make sure the model is also trained on the test set",
      "To increase the model's accuracy"
    ],
    correctIndex: 0,
    explanation: "Test set = unseen data. It tells you whether your model generalizes or just memorized training data.",
    fromMidterm: true
  },
  {
    id: 34,
    topic: "Train/Test",
    prompt: "You run: training_index = sample(N, training_size). What is training_index?",
    options: [
      "A vector of row numbers used to select training observations",
      "A data frame containing the training data",
      "A vector of column names used to select predictors",
      "A random seed value"
    ],
    correctIndex: 0,
    explanation: "sample(N, k) returns k random INTEGERS from 1..N. Those are row INDICES, used like df[training_index, ] to slice rows.",
    fromMidterm: true
  },
  {
    id: 35,
    topic: "Train/Test",
    prompt: "You have 1,440 observations and 11 variables. Code:\nN = nrow(df)\ntraining_size = round(N*0.75)\ntraining_index = sample(N, training_size)\ntraining = df[training_index, ]\ntest = df[-training_index, ]\n\nHow many observations should be in test?",
    options: [
      "1,080",
      "360",
      "1,440",
      "720"
    ],
    correctIndex: 1,
    explanation: "75% to training, 25% to test. 1440 * 0.25 = 360.",
    fromMidterm: true
  },
  {
    id: 36,
    topic: "Train/Test",
    prompt: "Same setup. How many columns should the test data frame contain?",
    options: [
      "11",
      "8",
      "1",
      "0"
    ],
    correctIndex: 0,
    explanation: "Slicing rows doesn't drop columns. test = df[-training_index, ] keeps ALL 11 columns.",
    fromMidterm: true
  },
  {
    id: 37,
    topic: "Train/Test",
    prompt: "You have 20 variables. Your friend uses the same data to predict revenue but only 2 variables. Which is true?",
    options: [
      "Both models are likely to equally minimize errors when predicting revenue",
      "Friend's model is more likely to be overfit",
      "Your model is more likely to be overfit, friend's is more likely to be underfit",
      "Your model will obviously do very well on test data"
    ],
    correctIndex: 2,
    explanation: "More predictors = more flexibility = more risk of overfitting. Fewer predictors = less flexibility = more risk of underfitting.",
    fromMidterm: true
  },
  {
    id: 38,
    topic: "kNN",
    prompt: "In kNN regression, predictions are made by:",
    options: [
      "Averaging the outcomes of the k most similar observations",
      "Selecting the observation with the largest outcome",
      "Minimizing the squared error across the dataset",
      "Applying a fitted equation to all observations"
    ],
    correctIndex: 0,
    explanation: "kNN: find the k nearest neighbors (by feature distance), average their Y values.",
    fromMidterm: true
  },
  {
    id: 39,
    topic: "kNN",
    prompt: "kNN model with k=2. Neighbors ordered closest to farthest:\nNeighbor 1: 18,000\nNeighbor 2: 32,000\nNeighbor 3: 20,000\nNeighbor 4: 35,000\nNeighbor 5: 40,000\nNeighbor 6: 55,000\n\nWhat prediction does the model produce?",
    options: [
      "25,000",
      "20,000",
      "33,300",
      "36,667"
    ],
    correctIndex: 0,
    explanation: "k=2 means use the 2 closest neighbors: 18,000 and 32,000. Average = 25,000.",
    fromMidterm: true
  },
  {
    id: 40,
    topic: "kNN",
    prompt: "Possible predictors: Temp (range 0-35), Wind (range 0-40), Precipitation (range 0-500), Weekend (0/1). Which has outsized influence on distance calculations if NOT standardized?",
    options: [
      "Precipitation",
      "Wind",
      "Temp",
      "Weekend"
    ],
    correctIndex: 0,
    explanation: "kNN is distance-based. The variable with the LARGEST RANGE (Precipitation, 0-500) dominates Euclidean distance. Standardization fixes this.",
    fromMidterm: true
  },
  {
    id: 41,
    topic: "kNN",
    prompt: "Possible predictors: Temp, Wind, Precipitation, Weekend (factor: weekday or weekend). Which can NOT be used in your kNN model?",
    options: [
      "Weekend",
      "Wind",
      "Precipitation",
      "You can use all of them"
    ],
    correctIndex: 0,
    explanation: "kNN is distance based, so it requires NUMERIC predictors. Weekend is categorical (factor / dummy) → must be removed.",
    fromMidterm: true
  },
  {
    id: 42,
    topic: "kNN",
    prompt: "If you ran a kNN regression model on Boston Housing with predictors RM (rooms), CRIM (crime rate), and NTYPE (neighborhood: SUB or URB), which predictors must be removed?",
    options: [
      "RM",
      "CRIM",
      "NTYPE",
      "None"
    ],
    correctIndex: 2,
    explanation: "NTYPE is a factor (categorical). kNN requires numeric inputs. RM and CRIM are numeric — keep them.",
    fromMidterm: true
  },
  {
    id: 43,
    topic: "kNN",
    prompt: "Before deploying the kNN model, you compare its performance to a benchmark (predict average ridership for every hour). What is the primary purpose of benchmarking?",
    options: [
      "To ensure the model uses all available predictors",
      "To assess whether the model provides meaningful improvement over a simple alternative",
      "To determine whether the model is statistically significant",
      "No reason — it is just fun to type out code in R"
    ],
    correctIndex: 1,
    explanation: "If your model can't beat the simple \"predict the mean / mode\" baseline, the model isn't adding value.",
    fromMidterm: true
  },
  {
    id: 44,
    topic: "Normalization",
    prompt: "Using min-max normalization on the Value column, which OBSERVATION would be transformed to 0?",
    table: {
      headers: [
        "Observation",
        "Value"
      ],
      rows: [
        [
          "1",
          "10"
        ],
        [
          "2",
          "12"
        ],
        [
          "3",
          "14"
        ],
        [
          "4",
          "16"
        ],
        [
          "5",
          "18"
        ]
      ]
    },
    options: [
      "1",
      "2",
      "3",
      "5"
    ],
    correctIndex: 0,
    explanation: "Min-max normalization: smallest value → 0. Smallest value is 10, which is observation 1.",
    trap: "You answered 3 on the midterm. The question asks for the OBSERVATION number (the row), not the value. Observation 1 has Value=10 (the minimum). 10 → 0.",
    fromMidterm: true,
    youGotWrong: true
  },
  {
    id: 45,
    topic: "Logistic Regression",
    prompt: "In a logistic regression model, the coefficient for \"Years of Experience\" is 0.41. What is the multiplicative effect on the odds for each additional year?",
    options: [
      "The odds increase by an additive factor of 0.41",
      "The odds are multiplied by e^0.41 ≈ 1.5",
      "The probability of the outcome increases by 41%",
      "The log-odds are multiplied by e^0.41"
    ],
    correctIndex: 1,
    explanation: "Logistic coefficients are log-odds. Exponentiate to get the multiplicative effect on ODDS. exp(0.41) ≈ 1.5.",
    trap: "Probability changes are NOT a fixed percentage (relationship is non-linear). Log-odds are ADDED to, not multiplied. Always: exponentiate the coef → multiplicative on odds."
  },
  {
    id: 46,
    topic: "Analytics Types",
    prompt: "A company trains a model on past customer purchasing data so it can learn patterns and estimate demand for next month. Which type of analytics does this represent?",
    options: [
      "Diagnostic",
      "Prescriptive",
      "Descriptive",
      "Predictive"
    ],
    correctIndex: 3,
    explanation: "Estimating future demand = Predictive Analytics. Descriptive = what happened. Predictive = what will happen. Prescriptive = what to do."
  },
  {
    id: 47,
    topic: "Process",
    prompt: "Why is data mining best described as a process rather than a single step?",
    options: [
      "Because it requires advanced mathematical training that takes years to fully understand and apply correctly",
      "Because data mining focuses entirely on improving predictive accuracy through iteration over time, nothing else",
      "Because it involves repeatedly refining business understanding, data, and models to extract useful patterns",
      "Because every data mining project always leads to a deployment in a production system at the end of the work"
    ],
    correctIndex: 2,
    explanation: "CRISP-DM: business understanding → data understanding → data prep → modeling → evaluation → deployment, with iteration between steps."
  },
  {
    id: 48,
    topic: "Classical vs Modern",
    prompt: "Which of these belongs to MODERN data mining/science (not classical statistics)?",
    options: [
      "Methods were developed for limited data",
      "We emphasize and measure performance based on how well the model fits old data",
      "We split the data into partitions prior to modeling",
      "Concerned with how much of x can explain y"
    ],
    correctIndex: 2,
    explanation: "Modern data mining: tons of data + train/test split + measure prediction quality on NEW data. Classical: limited data + fit old data + explain.",
    fromMidterm: true
  },
  {
    id: 49,
    topic: "Evaluation",
    prompt: "Your model's RMSE for predicting house prices (in $1000s) was 26. Interpret this in one sentence.",
    options: [
      "The model is correct 26% of the time",
      "On average, the model's predictions are off by about $26,000",
      "The model has an error of $26 per house",
      "The model explains 26% of variance in price"
    ],
    correctIndex: 1,
    explanation: "RMSE is in the units of Y. Y = MEDV in $1000s, so RMSE=26 means $26,000 average prediction error.",
    fromMidterm: true
  },
  {
    id: 50,
    topic: "Evaluation",
    prompt: "Why is this Boston Housing model an example of regression rather than classification?",
    options: [
      "The variable being predicted is numeric",
      "The model is supervised",
      "The model uses coefficients",
      "The predictors include both numeric and categorical variables"
    ],
    correctIndex: 0,
    explanation: "Regression vs classification is determined SOLELY by the outcome variable type. Numeric Y → regression.",
    fromMidterm: true
  },
];
