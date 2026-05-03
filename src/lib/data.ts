export const portfolioData = {
  user: {
    name: "Siva Narayana Surya Chandra Madhala",
    role: "AI Engineer | Python Developer | LLM & Computer Vision Specialist",
    tagline: "Building Intelligent Systems | Focus on AI systems, LLMs, and real-world deployments",
    summary: "AI Engineer with experience in ML, DL, Computer Vision, and LLM systems. Strong experience in YOLO (v3, v4, v7), CNNs, OpenCV, TensorFlow, and Flask. Proven track record in building RAG systems, LangChain pipelines, and AI-based clinical systems. Experienced in deploying end-to-end systems using AWS SageMaker, Render, and Docker.",
    contact: {
      email: "sivanarayanam27@gmail.com", // Placeholder
      github: "https://github.com/siva-narayana-1",
      linkedin: "https://linkedin.com/in/siva-n-madhala"
    }
  },
  skills: [
    {
      category: "AI/ML",
      items: ["CNN", "YOLO (v3, v4, v7)", "Regression", "Clustering"]
    },
    {
      category: "LLM & Generative AI",
      items: ["LangChain", "RAG", "Local LLMs", "Prompt Engineering"]
    },
    {
      category: "Backend & APIs",
      items: ["Flask", "FastAPI", "Python", "RESTful APIs"]
    },
    {
      category: "Tools & Cloud",
      items: ["Docker", "Git", "AWS (SageMaker)", "GCP", "RabbitMQ"]
    },
    {
      category: "Libraries",
      items: ["TensorFlow", "OpenCV", "HuggingFace", "Pandas", "NumPy"]
    }
  ],
  projects: [
    {
      id: "medflow",
      title: "MedFlow (AI Clinical System)",
      description: "AI-powered transcription and SOAP notes generation system for multi-role environments (Admin, Doctor, Nurse) utilizing LLM-based automation.",
      techStack: ["LLMs", "Speech-to-Text", "Python", "React", "Docker"],
      metrics: "Reduced clinical documentation time by 40%",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000&auto=format&fit=crop",
      link: "#"
    },
    {
      id: "ajman-chatbot",
      title: "AI Chatbot (Ajman Government)",
      description: "RAG-based conversational agent with web scraping and knowledge base integration for real-time query answering.",
      techStack: ["RAG", "LangChain", "Vector Database", "Python"],
      metrics: "Achieved 95% accuracy in retrieving relevant policies",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
      link: "#"
    },
    {
      id: "retention-ml",
      title: "Customer Retention ML System",
      description: "Telecom data pipeline and continuous inference loop with optimized model training targeting ROC/AUC maximization.",
      techStack: ["Scikit-learn", "Pandas", "RabbitMQ", "Flask"],
      metrics: "Improved retention prediction AUC to 0.89",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      link: "#"
    },
    {
      id: "vedanta-cv",
      title: "Object Detection System (Vedanta)",
      description: "Real-world deployment of YOLOv4 and YOLOv7 models on RTSP video streams using OpenCV for industrial safety monitoring.",
      techStack: ["YOLOv4", "YOLOv7", "OpenCV", "RTSP", "Python"],
      metrics: "Processed 30 FPS inference in real-time edge devices",
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1000&auto=format&fit=crop",
      link: "#"
    },
    {
      id: "food-classifier",
      title: "Food Classifier",
      description: "CNN-based classification system (VGG/ResNet) trained on a 20k+ dataset with Flask UI and nutritional metadata integration.",
      techStack: ["TensorFlow", "Keras", "Flask", "CNN"],
      metrics: "92% classification accuracy on 50+ food categories",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
      link: "#"
    }
  ],
  experience: [
    {
      id: "assimilate",
      role: "AI Engineer",
      company: "Assimilate Technologies",
      period: "Present",
      description: "Designing and deploying production-grade LLM systems, computer vision pipelines, and scalable backend infrastructure."
    },
    {
      id: "skill-union",
      role: "Data Scientist Intern",
      company: "Skill Union",
      period: "Past",
      description: "Worked on foundational ML models, data cleaning pipelines, and initial model evaluation frameworks."
    }
  ]
};
