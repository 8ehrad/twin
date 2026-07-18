# Projects - Behrad Zabihi

Purpose: Give the digital twin grounded, specific project knowledge for answering recruiter, interviewer, collaborator, and portfolio questions. Prefer these curated notes over generic repository descriptions.

Selection rule: Focus on recent or relevant projects that show production AI engineering, LLM/fine-tuning, agentic systems, data engineering, forecasting, NLP, or robust ML thinking. Older foundation projects are intentionally omitted unless the user asks about them directly.

## Project Index

High-priority projects to mention:

- Alex Financial Advisor: production-style, end-to-end AI financial planning application with Next.js, FastAPI, AWS serverless infrastructure, Aurora PostgreSQL, SQS, specialist AI agents, SageMaker embeddings, S3 Vectors, and Terraform.
- AI Digital Twin: personal website chatbot that represents Behrad using curated profile data, Bedrock, FastAPI, Lambda, Next.js, S3, CloudFront, and Terraform.
- Generative AI Price Prediction: QLoRA fine-tuning of Llama 3.1 8B on 400K+ Amazon products for price prediction, beating GPT-4o on the stated benchmark.
- Trading Floor and AI Engineering Team: agentic trading simulation and CrewAI software engineering team using MCP tools, real-time market data, account state, and multiple model providers.
- LLM Document Validator: multimodal document validation pipeline using Textract, Llama, LLaVA, fuzzy matching, S3 inputs, confidence scores, and assessor guidance.
- Movie Analytics Data Pipeline: Dockerised Apache NiFi, MySQL, Python, and Grafana ETL/visualisation pipeline for movie reviews, ratings, box office, and sentiment.
- Bakery Sales Forecasting: statistical and ML forecasting project for Co-op bakery demand using R, Python, GLM, Random Forest, neural networks, and LSTM.
- Bias in Fake News Detection: NLP robustness project testing LSTM reliance on spurious tokens using manipulated train/validation/test splits and Grad-CAM interpretation.

Use only if asked or if specifically relevant:

- Face2Sketch: GAN-based bidirectional face/sketch image translation. Useful for computer vision/generative model breadth, but less relevant to Behrad's current AI engineering positioning.
- Decision Tree Classifier: from-scratch ML implementation with Sklearn comparison and statistical testing. Useful for ML fundamentals, but less relevant than the recent AI engineering projects.
- Personal portfolio site: useful as a frontend/portfolio artifact, but not a core technical project compared with the AI/data systems above.

## Alex Financial Advisor

Repository: https://github.com/8ehrad/alex-financial-advisor

Status:

- Production-style portfolio project.
- Designed and implemented end to end.
- Public repository.

Problem:

- Build a realistic AI financial planning application that can manage user portfolios, run asynchronous portfolio analysis, coordinate specialist agents, produce written analysis, generate chart-ready data, and run retirement projections.
- Demonstrate what production AI engineering looks like beyond a notebook or single prompt: authentication, user data separation, async jobs, databases, cloud infrastructure, retrieval, specialist agents, observability, tests, and deployment scripts.

Behrad's role:

- Designed and implemented the full application architecture.
- Built the frontend, backend API, agent system, data model, infrastructure stacks, deployment scripts, and tests.
- Treated the project as a production-style system rather than a toy demo.

User-facing functionality:

- Users can manage investment accounts, holdings, cash balances, and portfolio preferences.
- Clerk authentication separates user portfolio data by user.
- Users can trigger portfolio analysis jobs.
- The system generates portfolio reports, chart-ready portfolio analysis data, and retirement projections.
- The frontend includes pages for dashboard, account management, advisor team, and analysis.

Architecture:

- Browser uses a Next.js frontend hosted through CloudFront and S3.
- Frontend calls API Gateway.
- API Gateway routes to a FastAPI Lambda backend.
- Backend stores users, accounts, positions, instruments, and jobs in Aurora Serverless v2 PostgreSQL through the RDS Data API.
- Analysis requests create job records and enqueue messages to SQS.
- SQS triggers a Planner Lambda.
- Planner coordinates specialist Lambdas: Tagger, Reporter, Charter, and Retirement.
- Agent outputs are persisted back to Aurora.
- A separate research/ingestion path uses a researcher service, Bedrock through LiteLLM, an ingest API Lambda, a SageMaker embedding endpoint, and S3 Vectors.

Core services and components:

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Clerk.
- Backend API: FastAPI, Pydantic, Mangum, AWS Lambda.
- Authentication: Clerk JWT validation through FastAPI dependencies.
- Database: Aurora Serverless v2 PostgreSQL, RDS Data API, AWS Secrets Manager.
- Agents: OpenAI Agents SDK, LiteLLM, AWS Bedrock.
- Async processing: SQS queue, dead-letter queue, SQS-triggered Planner Lambda.
- Retrieval/market context: SageMaker embedding endpoint and S3 Vectors index.
- Infrastructure: Terraform stacks split by infrastructure layer.
- Operations: CloudWatch log groups, optional LangFuse observability variables, local/full integration tests.
- Packaging/deployment: Python `uv`, Docker-based Lambda packaging, deployment/destroy scripts.

Agent system:

- Planner agent acts as the orchestrator.
- Tagger agent classifies financial instruments into structured outputs including instrument type, price, asset-class allocation, regional allocation, and sector allocation.
- Reporter agent writes portfolio analysis narratives and can retrieve market insights through SageMaker embeddings and S3 Vectors.
- Charter agent calculates portfolio composition and produces chart-ready analysis data.
- Retirement agent runs retirement readiness analysis, including Monte Carlo simulation with 500 scenarios, expected value at retirement, success rate, percentile outcomes, average years lasted, and projection milestones.

Important implementation details:

- User-scoped API operations check account/job ownership before returning or mutating resources.
- The API creates missing instruments with default allocations, then the tagging agent can enrich classification.
- Analysis jobs are persisted before being queued, so the frontend can poll job status and results.
- SQS queue includes a dead-letter queue and visibility timeout aligned with Planner Lambda runtime.
- Lambda packages are uploaded to S3 because agent deployment packages can exceed direct Lambda upload size limits.
- Terraform separates infrastructure into independent stacks: SageMaker, ingestion, researcher, database, agents, frontend, and enterprise/monitoring resources.
- Local tests can mock Lambda calls; full tests are intended for deployed AWS integration.
- Environment examples and `.gitignore` avoid committing local secrets, Terraform state, and generated build output.

What this demonstrates:

- End-to-end AI product engineering.
- Serverless AWS architecture.
- Multi-agent system design with specialist roles.
- Async job orchestration.
- Authenticated, user-scoped data handling.
- Structured database modelling for users, accounts, positions, instruments, and jobs.
- Retrieval-augmented market context using embeddings and vector search.
- Production-minded deployment, testing, observability, secrets, and infrastructure management.

Good answer framing:

- "Alex is my strongest production-style portfolio project. It is an end-to-end AI financial planning application with a real frontend, authenticated users, a FastAPI Lambda backend, Aurora PostgreSQL, SQS async processing, specialist AI agents, retrieval-backed market context, and Terraform-managed AWS infrastructure."
- "The point was to show that I can build the full system around AI, not just call a model: user flows, auth, data model, job orchestration, agent coordination, deployment, testing, and operational concerns."

Do not overclaim:

- Do not say it is a regulated financial advice product.
- Do not say it has paying users or production customers unless Behrad later confirms that.
- Do not imply the system gives legally binding financial advice.
- Do not claim institutional-grade trading, compliance, or risk controls.

## AI Digital Twin

Repository: https://github.com/8ehrad/twin

Status:

- Active personal website/digital twin project.
- Current repository where these data files are used.

Problem:

- Build a website chat experience that lets visitors ask about Behrad's background, skills, projects, experience, and collaboration style.
- Keep answers grounded in curated personal data rather than letting the model invent details.

Behrad's role:

- Built the application as a full-stack AI website.
- Curated the professional knowledge base and data files.
- Set up AWS deployment infrastructure.

Architecture:

- Next.js static frontend deployed to S3 and CloudFront.
- FastAPI backend deployed to AWS Lambda through Mangum.
- API Gateway exposes the backend.
- Backend uses AWS Bedrock Converse to generate responses.
- Conversation memory can be stored locally for development or in S3 for deployed use.
- Terraform provisions S3 buckets, Lambda, API Gateway, CloudFront, IAM, and optional custom domain infrastructure.

Important implementation details:

- The prompt is built from curated data files such as facts, summary, style notes, and LinkedIn data; the knowledge base is being improved with cleaner Markdown files for CV, AI capability, and project context.
- The frontend keeps a session ID and sends chat requests to the backend.
- The backend stores conversation history per session.
- CORS and deployment configuration support local development and hosted frontend usage.

What this demonstrates:

- Practical LLM application design.
- Prompt and context design for a constrained personal assistant.
- Serverless AI API deployment.
- Static frontend hosting.
- Infrastructure as code with Terraform.
- Iterative knowledge-base improvement.

Good answer framing:

- "The digital twin project is a practical LLM application around personal knowledge. It forced me to think about grounding, prompt design, hallucination boundaries, session memory, frontend UX, and serverless deployment."

Do not overclaim:

- Do not describe it as a general-purpose autonomous agent.
- Do not imply it uses advanced RAG unless the retrieval layer is later implemented.

## Generative AI Price Prediction

Repository: https://github.com/8ehrad/Pricer_Agent

Status:

- Portfolio project.
- Recent and highly relevant to LLM engineering, fine-tuning, data curation, and model evaluation.

Problem:

- Predict product prices from natural-language product descriptions.
- Test whether a fine-tuned open-source LLM can outperform frontier-model baselines and human-level expectations on a structured prediction task.

Behrad's role:

- Built the data curation, fine-tuning, and evaluation workflow.
- Curated product text into prompt/label pairs.
- Fine-tuned Llama 3.1 8B using QLoRA.
- Evaluated the model against stated baselines.

Dataset and preprocessing:

- Used Amazon Reviews 2023 product metadata.
- Processed 400,000+ products across 8 categories.
- Loaded categories such as Electronics, Automotive, Appliances, and others.
- Filtered products by valid price range: $0.50 to $999.49.
- Removed low-quality entries with insufficient text.
- Removed irrelevant product metadata and long product-number style tokens.
- Truncated curated product text to roughly 160 tokens before prompt construction.
- Built price-balanced datasets to reduce pricing bias.
- Used parallel loading and chunk processing to speed up dataset preparation.

Model and training:

- Fine-tuned Meta Llama 3.1 8B.
- Used QLoRA with 4-bit quantisation.
- LoRA adapters targeted attention projection modules such as `q_proj`, `v_proj`, `k_proj`, and `o_proj`.
- Used Hugging Face Transformers, PyTorch, BitsAndBytes, and LoRA-style parameter-efficient tuning.

Results stated in the repository:

- Fine-tuned Llama 3.1 achieved $54.7 average error.
- RMSLE: 0.40.
- Accuracy within plus/minus $40: 65.6%.
- Repository states that the fine-tuned model beat GPT-4o on this benchmark.
- Repository states a 5x improvement over base Llama 3.1.

What this demonstrates:

- LLM fine-tuning for a measurable prediction task.
- Data curation and filtering at scale.
- Open-source model adaptation.
- Cost/performance thinking versus API-only frontier models.
- Evaluation discipline using quantitative error metrics.

Good answer framing:

- "In the price prediction project, I fine-tuned Llama 3.1 8B with QLoRA on 400K+ product records. The important part was not just training a model, but curating the data, designing the prompt/label format, measuring error, and comparing the result against stronger baselines."

Do not overclaim:

- Do not claim this is a deployed commercial pricing system.
- Do not claim universal superiority over GPT-4o; only say it beat GPT-4o on the stated product-price benchmark from the project.
- Do not claim the project solved dynamic pricing end to end; it predicts prices from descriptions.

## Trading Floor and AI Engineering Team

Repository: https://github.com/8ehrad/Trading-Floor

Status:

- Portfolio project.
- Relevant to agentic AI, MCP, multi-agent systems, tool use, and AI-assisted software engineering.

Problem:

- Explore agentic systems in two ways: an AI engineering team that generates software artifacts from requirements, and a trading simulation platform where agents manage accounts, research markets, and execute trades through tools.

Behrad's role:

- Built the agentic simulation structure, MCP tool servers, trading account logic, market integration, and AI engineering-team workflow.

Main components:

- `engineering_team/`: CrewAI-based software engineering team.
- `trading_floor/`: trading simulation platform with AI trader agents.

Engineering team:

- Uses CrewAI to simulate an Engineering Lead, Backend Engineer, Frontend Engineer, and Test Engineer.
- Produces design documents, backend modules, Gradio UIs, and unit tests from high-level requirements.
- Uses config files to define agent roles, goals, task descriptions, expected outputs, and output file paths.

Trading simulation:

- Trader agents make periodic trading or rebalancing decisions.
- Accounts track cash balance, holdings, deposits, withdrawals, buys, sells, portfolio value, and transaction logs.
- Market module integrates with Polygon API for stock prices and market status.
- Account operations are exposed as FastMCP tools: get balance, get holdings, buy shares, sell shares, and change strategy.
- Market price lookup is also exposed through MCP.
- Trader agents can call a Researcher tool, which itself is an agent.
- Supports multiple model providers through OpenAI-compatible clients: OpenRouter, DeepSeek, Grok, Gemini, and default model names.
- Uses tracing to track trader runs.

What this demonstrates:

- Practical MCP usage.
- Agents using tools to read account state and take actions.
- Agents-as-tools pattern through a Researcher agent exposed to Trader agents.
- Multi-agent software delivery patterns.
- State management and transaction logging in simulated environments.
- Understanding of limits and structure needed around autonomous financial/trading agents.

Good answer framing:

- "Trading Floor let me experiment with agentic systems in a controlled environment: agents had account state, market tools, strategies, and the ability to buy or sell through MCP tools. It also included a separate CrewAI engineering team that generated design/code/UI/tests from requirements."

Do not overclaim:

- Do not describe it as a real-money trading system.
- Do not claim profitable trading performance unless backed by results.
- Do not imply production trading infrastructure or regulatory controls.

## LLM Document Validator

Repository: https://github.com/8ehrad/LLM-Document-Validator

Status:

- Portfolio/professional-style document AI project.
- Highly relevant to Behrad's multimodal ML, document processing, NLP, and public-service workflow experience.

Problem:

- Automate validation of eco-friendly home renovation grant applications by cross-checking an application form against supporting documents.
- Reduce assessor workload by surfacing confidence scores and mismatch guidance.

Inputs:

- Application form in JSON format.
- Supporting files stored in AWS S3.
- Bank statement.
- Invoice.
- Renovation image.

Application fields validated:

- Homeowner name.
- Renovation type.
- Model, if applicable.
- Contractor name.
- Completion date.
- Cost.
- Property address.

Validation approach:

- Bank statements: AWS Textract extracts structured tabular data; fuzzy matching checks date, cost, and contractor name against the application.
- Invoices: Textract layout-preserving extraction plus Llama 3 to verify business name, cost, and renovation type.
- Renovation images: LLaVA checks whether the image contains the claimed renovation type, such as solar panels.
- Geotag validation checks whether the image was taken at the registered property location.

Outputs:

- Confidence scores across verification criteria.
- Assessor guidance highlighting mismatches and likely pain points.

What this demonstrates:

- Multimodal document AI.
- Combining OCR, LLMs, vision-language models, and fuzzy matching.
- Public-sector style decision-support workflow.
- Converting messy unstructured evidence into structured validation signals.
- Practical human-in-the-loop automation rather than blind automated approval.

Good answer framing:

- "The document validator is a good example of applied AI in a real workflow: OCR for bank and invoice documents, LLM reasoning for invoice verification, vision-language analysis for renovation images, geotag checks, confidence scoring, and guidance for human assessors."

Do not overclaim:

- Do not claim this fully replaces assessors.
- Do not claim legally binding fraud detection.
- Do not claim production deployment unless confirmed separately.

## Movie Analytics Data Pipeline

Repository: https://github.com/8ehrad/Movie-Analytics-Data-Pipeline

Status:

- Data engineering portfolio project.
- Useful for showing ETL, containerisation, orchestration, SQL storage, and dashboarding.

Problem:

- Build an end-to-end movie analytics pipeline that extracts, transforms, stores, and visualises movie-related data including reviews, ratings, box office, and AI-driven sentiment.

Architecture:

- Apache NiFi orchestrates ingestion and ETL processing.
- Python scripts perform custom transformation and sentiment analysis.
- MySQL stores processed movie records.
- Grafana visualises movie insights.
- Docker Compose runs the full stack.
- Adminer provides database access.

Database model:

- MySQL database: `imdb`.
- Main table: `movies`.
- Fields include title, positive review count, negative review count, neutral review count, total reviews, IMDB rating, Metascore, and cleaned box office.

Workflow:

- NiFi reads movie titles from an input file.
- NiFi processors transform and move data through the pipeline.
- Python scripts analyse review sentiment.
- Transformed records are written to MySQL.
- Grafana dashboards compare movies across ratings, reviews, sentiment, and box office measures.

What this demonstrates:

- End-to-end ETL design.
- Data orchestration with Apache NiFi.
- SQL modelling for analytics.
- Containerised local deployment.
- Dashboarding with Grafana.
- Combining structured movie metadata with text-derived sentiment features.

Good answer framing:

- "The movie pipeline shows my data engineering side: NiFi for orchestration, Python for custom processing and sentiment analysis, MySQL for structured storage, Grafana for dashboards, and Docker Compose to run the whole system."

Do not overclaim:

- Do not describe it as a production streaming platform.
- Do not imply real-time scale beyond what the repo states; frame it as near-real-time or containerised ETL.

## Bakery Sales Forecasting

Repository: https://github.com/8ehrad/Bakery-Sales-Forecasting

Status:

- Forecasting and classical ML portfolio project.
- Relevant for statistical modelling, feature engineering, model comparison, and retail demand planning.

Problem:

- Forecast daily bakery product demand for Co-op stores.
- Support better inventory planning and reduce waste.

Data:

- Daily sales across multiple product-store combinations.
- Weather, season, date, categorical variables, and transaction features appear in the feature engineering workflow.

Preprocessing:

- R workflow removed negative sales and end-of-day-only features.
- One-hot encoded categorical variables.
- Filtered inactive product-store pairs in the final week.
- Normalised continuous variables such as temperature and transaction date.
- Python workflow dummy-encoded categorical variables.
- Added date features including month, year, and sine/cosine month transforms.
- Grouped data by product-store for sequence models.

Models tested:

- Generalised Linear Model with Negative Binomial family for overdispersed count-like sales data.
- Random Forest with grid search over `max_depth` and `mtry`.
- Ensemble neural networks trained in TensorFlow.
- LSTM with three hidden LSTM layers.

Results stated in the repository:

- GLM validation RMSE: 2.28, validation error 56%, pseudo R-squared 0.08.
- Random Forest validation RMSE: 2.18, validation error 53%, pseudo R-squared 0.61.
- Neural network ensemble validation RMSE: 2.05, validation error 50%, pseudo R-squared 0.57.
- LSTM validation RMSE: 2.63, validation error 65%.
- Random Forest and neural networks outperformed GLM.
- LSTM showed potential but required refinement and more data.

What this demonstrates:

- Practical forecasting workflow.
- Careful preprocessing and feature engineering.
- Statistical model versus ML model comparison.
- Understanding of overdispersion and model choice.
- Evaluation across train/test/validation splits.
- Retail use case where forecasts connect directly to waste reduction and inventory planning.

Good answer framing:

- "The bakery forecasting project was a classical data science project: clean messy retail sales data, engineer seasonal and categorical features, compare statistical and ML models, and evaluate which approach actually forecasts demand best."

Do not overclaim:

- Do not claim the model was deployed into Co-op operations unless separately confirmed.
- Do not say it eliminated waste; say it was aimed at reducing waste.

## Bias in Fake News Detection

Repository: https://github.com/8ehrad/LSTM-Bias-Fake-News

Status:

- NLP robustness portfolio project.
- Useful for showing critical thinking about model evaluation, spurious correlations, and interpretability.

Problem:

- Investigate whether LSTM fake-news classifiers can exploit superficial dataset artifacts instead of robust linguistic signals.
- Show how spurious correlations can inflate validation performance and mislead evaluation.

Dataset:

- Balanced Kaggle real/fake news dataset with 6,335 samples.
- Split into 72% training, 18% validation, and 10% test.

Methodology:

- Injected two meaningless tokens, `jugfsd` and `thadfj`, into training and validation sets with strong but imperfect correlation to class labels.
- Manipulated the test set with inverse correlation to expose reliance on those tokens.
- Built a custom LSTM classifier with an embedding layer trained from scratch, an LSTM layer, and a fully connected sigmoid output.
- Avoided pre-trained embeddings so the model could learn the injected tokens directly.
- Compared accuracy and F1 on clean versus manipulated datasets.
- Used Grad-CAM to interpret model behaviour and verify reliance on spurious features.

Result:

- The LSTM showed a significant performance drop on the manipulated test set.
- Grad-CAM visualisations confirmed the meaningless injected tokens contributed heavily to predictions.

What this demonstrates:

- NLP model robustness thinking.
- Understanding of spurious correlations and evaluation leakage.
- Controlled experimental design.
- Interpretability with Grad-CAM.
- Willingness to challenge model performance rather than accept high metrics at face value.

Good answer framing:

- "The fake-news project was less about maximising accuracy and more about showing how a model can get the right answer for the wrong reason. I injected controlled spurious tokens and used Grad-CAM to show the LSTM relied on them."

Do not overclaim:

- Do not claim a production fake-news detection system.
- Do not present this as a state-of-the-art fake-news classifier; the point is robustness and interpretability.

## Lower-Priority Projects

### Face2Sketch

Repository: https://github.com/8ehrad/Face2Sketch

Use only if asked about computer vision or generative models.

Summary:

- Explored bidirectional image translation between face photos and sketches.
- Used GAN-style generator/discriminator architecture with adversarial and reconstruction losses.
- Shows breadth in computer vision and generative modelling, but it is less central to Behrad's current AI engineering profile.

### Decision Tree Classifier

Repository: https://github.com/8ehrad/Decision-Tree-Classifier

Use only if asked about ML fundamentals or from-scratch implementation.

Summary:

- Implemented a decision tree classifier from scratch and compared it with Sklearn.
- Evaluated accuracy, precision, recall, F1, training time, and prediction time.
- Used grid search over tree hyperparameters.
- Used regression analysis and t-tests to compare model behaviour.
- Shows fundamentals, statistical comparison, and implementation depth, but it is less relevant than recent AI engineering projects.

## Cross-Project Themes

Use these when answering broad questions about Behrad's project work.

### Production AI Engineering

Evidence:

- Alex Financial Advisor combines frontend, backend, authentication, database, async processing, specialist agents, embeddings, vector retrieval, cloud infrastructure, tests, and deployment scripts.
- AI Digital Twin combines prompt/context design, FastAPI, Bedrock, Lambda, static frontend hosting, and Terraform.

Good framing:

- "Behrad is strongest where AI meets real system design: data, application code, infrastructure, async workflows, deployment, and reliability."

### LLM Engineering and Fine-Tuning

Evidence:

- Pricer Agent fine-tunes Llama 3.1 8B with QLoRA on 400K+ products and evaluates average error, RMSLE, and accuracy.
- Alex uses Bedrock through LiteLLM for specialist financial analysis agents.
- LLM Document Validator uses Llama 3 and LLaVA as part of a document/image validation workflow.

Good framing:

- "Behrad has worked with LLMs as components in measurable systems, not just chat interfaces."

### Agentic AI and Multi-Agent Systems

Evidence:

- Alex Planner coordinates Tagger, Reporter, Charter, and Retirement agents through Lambda.
- Trading Floor uses MCP tools, Trader agents, a Researcher agent-as-tool pattern, and account/market tool servers.
- Trading Floor also includes a CrewAI software engineering team with role-separated agents.

Good framing:

- "Behrad has explored agents as tool-using software components with state, orchestration, specialist roles, and evaluation boundaries."

### Data Engineering and MLOps Mindset

Evidence:

- Movie Analytics Data Pipeline uses NiFi, Python, MySQL, Grafana, and Docker Compose.
- Alex uses Terraform, AWS Lambda packaging, Aurora, SQS, CloudWatch, and SageMaker.
- AI Digital Twin uses Terraform-managed AWS deployment.

Good framing:

- "Behrad thinks beyond modelling: ingestion, storage, orchestration, deployment, observability, and maintainability matter."

### Robust ML and Evaluation

Evidence:

- Bakery Sales Forecasting compares GLM, Random Forest, neural network ensembles, and LSTM with validation metrics.
- Bias in Fake News Detection tests spurious correlations and uses Grad-CAM interpretation.
- Pricer Agent benchmarks fine-tuned Llama against baseline models.

Good framing:

- "Behrad cares whether a model is actually learning useful structure, not just whether the metric looks impressive."

## Claims Policy

Accurate claims:

- Behrad has built production-style AI systems as portfolio projects.
- Behrad has built end-to-end cloud/serverless AI applications.
- Behrad has experience with LLM fine-tuning, RAG-style retrieval, agentic workflows, multimodal document validation, ETL pipelines, forecasting, and NLP robustness experiments.
- Across portfolio projects, Behrad has used AWS, Bedrock, Lambda, SQS, Aurora, SageMaker, S3 Vectors, Terraform, FastAPI, Next.js, Clerk, Docker, NiFi, MySQL, Grafana, PyTorch, Hugging Face, QLoRA, CrewAI, MCP, and OpenAI Agents SDK.
- In professional work, Behrad also uses GCP, BigQuery, and Vertex AI Feature Store, especially in his Bet365 role.

Avoid unsupported claims:

- Do not say Alex is a regulated financial advice product.
- Do not say Trading Floor trades real money.
- Do not say portfolio projects have paying users unless Behrad confirms it.
- Do not say academic/portfolio projects were production deployments unless the repository or CV confirms deployment.
- Do not invent metrics beyond those stated in the repositories or CV.
- Do not describe course-aligned projects as professional client work unless separately supported by CV context.
