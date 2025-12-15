import { ResumeData } from './types';

export const RESUME_DATA: ResumeData = {
  name: "Badal Satyarthi",
  title: "Data Scientist · Machine Learning Engineer · NLP Engineer",
  summary: [
    "Accomplished Machine Learning Engineer and Software Developer boasting 6+ years of programming experience, with a deep-rooted passion for Machine Learning, Data Science, and AI.",
    "Fluent in Python and adept at solving complex problems, developing statistical Machine Learning models, and constructing ML pipelines from scratch.",
    "Experience spans cutting-edge NLP research in core NLP tasks (classification, text extraction, LLMs Fine-tuning, embedding fine-tuning) to predictive modelling.",
    "Demonstrates strong domain knowledge in Consulting, Recruitment, Finance and Hiring while excelling in collaboration across all levels of an organization."
  ],
  contact: {
    phone: "+91 9546866892",
    email: "bsatyarthi@gmail.com",
    location: "Bangalore, India"
  },
  socials: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/bsat007", label: "linkedin.com/in/bsat007" },
    { platform: "HackerRank", url: "https://hackerrank.com/bsatyarthi", label: "hackerrank.com/bsatyarthi" },
    { platform: "Upwork", url: "https://www.upwork.com/freelancers/01645eaecc573411ab", label: "upwork.com/freelancers/..." }
  ],
  experience: [
    {
      company: "recruitRyte",
      role: "Chief Data Scientist",
      location: "Remote",
      period: "July 2023 - Present",
      description: "Empowering recruiters with cutting-edge tools to simplify sourcing, shortlisting, and outreach.",
      achievements: [
        "Led the design of a scalable candidate search system handling 800M+ profiles, built with Qdrant and fine-tuned vectors.",
        "Built agentic based conversation system for any user to update the search parameters dynamically.",
        "Fine-tuned small language models (SLMs) for specific domain tasks and deployed using vLLM for high-throughput inference.",
        "Worked on GPU based large scale inference infrastructure and optimized deployment workflows using Docker.",
        "Integrated LLMs for function calling, tool usage, and structured input processing to optimize candidate searches.",
        "Developed a large-scale scraper for LinkedIn profiles, processing 5M+ profiles daily, using Selenium and anti-bot techniques."
      ],
      skills: ["Python", "PyTorch", "LLMs", "vLLM", "Qdrant", "Docker", "GPU Inference", "FastAPI", "Agents"]
    },
    {
      company: "Glasssquid.io",
      role: "Chief Data Scientist",
      location: "Remote",
      period: "Jan 2019 - July 2023",
      description: "AI-powered job assistant for job search optimization.",
      achievements: [
        "Developed ML pipelines using Python, PyTorch, spaCy, and more, achieving 90%+ accuracy.",
        "Created end-to-end pipelines for resume and job parsers, using token classification to extract relevant information.",
        "Led annotation projects with active learning, optimizing model training through high-quality datasets.",
        "Built resume/job recommendation systems using Elasticsearch, resulting in fast, accurate matches."
      ],
      skills: ["Python", "PyTorch", "spaCy", "Computer Vision", "HuggingFace", "Sklearn", "FastAPI", "Linux", "Git"]
    },
    {
      company: "Mesh Education Inc.",
      role: "Machine Learning Engineer",
      location: "Remote, Delhi, India",
      period: "Mar 2017 - Jan 2019",
      description: "Real-time feedback platform using NLP for optimizing presentations.",
      achievements: [
        "Built a chatbot using Google Dialogflow with 95% query resolution accuracy.",
        "Developed a Bloom’s Taxonomy model for text classification using spaCy and Sklearn.",
        "Created a question-answer system using TF-IDF and word2vec for search engine tasks.",
        "Developed scalable REST APIs using Django."
      ],
      skills: ["Python", "PyTorch", "Dialogflow", "NumPy", "Pandas", "Scikit-learn", "BeautifulSoup", "Django"]
    }
  ],
  projects: [
    {
      title: "Real-Time Fraud Detection System",
      client: "Alacer - Velocity FinCrime Solution Suite",
      description: "Developed an unsupervised anomaly detection system using Isolation Forest to identify fraud based on deviations from transaction patterns. Enhanced explainability with SHAP and leveraged Redis for real-time processing.",
      tech: ["Isolation Forest", "SHAP", "Redis", "Unsupervised Learning"]
    },
    {
      title: "Aspect-Based Review Sentiment Extraction",
      client: "Famepilot",
      description: "Built an opinion and aspect extractor with spaCy and developed a relation classifier to link opinions with aspects. Used prompt engineering to generate review reports.",
      tech: ["spaCy", "NLP", "Prompt Engineering", "Relation Classifier"]
    },
    {
      title: "Account Research System",
      client: "Demandfarm",
      description: "Developed an Account Research system using APIs, web scraping, and AI-powered analysis to provide insights on company profiles.",
      tech: ["APIs", "Web Scraping", "AI Analysis"]
    }
  ],
  education: [
    {
      institution: "Indian Institute of Technology (ISM) Dhanbad",
      degree: "Bachelor of Technology (B.Tech), Electronic and Communication",
      location: "Dhanbad, India",
      period: "2014 - 2018"
    }
  ],
  skills: [
    {
      category: "Core AI/ML",
      items: ["Statistics", "Supervised Learning", "Unsupervised Learning", "Deep Learning", "NLP", "Generative AI", "LLMs", "RAG", "Agents"]
    },
    {
      category: "Libraries & Frameworks",
      items: ["Pandas", "Numpy", "Scipy", "Matplotlib", "Sklearn", "PyTorch", "Spacy", "Gensim", "HuggingFace", "OpenAI", "vLLM"]
    },
    {
      category: "Infrastructure & Tools",
      items: ["AWS (EC2, S3, Lambda)", "Azure", "GCP", "Docker", "Kubernetes", "SQL", "MongoDB", "ElasticSearch", "Qdrant", "Redis"]
    }
  ]
};