const API_URL = "http://localhost:5000";
const TOKEN = ""; // Will be set via login

async function login() {
  console.log("🔐 Logging in...");
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@portfolio.com",
      password: "admin123",
    }),
  });

  const data = await res.json();
  if (!data.token) throw new Error("Login failed");
  console.log("✅ Logged in successfully");
  return data.token;
}

async function updateProfile(token) {
  console.log("👤 Updating profile...");
  const profileRes = await fetch(`${API_URL}/api/admin/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const profiles = await profileRes.json();
  const profileId = profiles[0]?.id;

  await fetch(`${API_URL}/api/admin/profile/${profileId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: "Madhala Siva Narayana Surya Chandra",
      email: "sivanarayanam27@gmail.com",
      phone: "9392521301",
      title: "AI Engineer & Python Developer",
      bio: "Skilled AI Engineer and Python developer with strong expertise in Machine Learning, Deep Learning, Computer Vision, and LLM applications. Experienced in building end-to-end AI systems from data preparation to deployment.",
      location: "Pune, India",
      profileImage: "https://via.placeholder.com/400x400?text=Siva",
      socialLinks: {
        github: "https://github.com/siva-narayana-1",
        linkedin: "https://linkedin.com/in/siva-n-madhala",
      },
    }),
  });
  console.log("✅ Profile updated");
}

async function addSkills(token) {
  console.log("🎯 Adding skills...");
  const skills = [
    { category: "Programming", name: "Python", level: "Expert" },
    { category: "AI/ML", name: "TensorFlow", level: "Expert" },
    { category: "AI/ML", name: "Keras", level: "Expert" },
    { category: "AI/ML", name: "scikit-learn", level: "Advanced" },
    { category: "Deep Learning", name: "CNNs", level: "Expert" },
    { category: "Deep Learning", name: "YOLO (v3-v11)", level: "Expert" },
    { category: "Deep Learning", name: "Transfer Learning", level: "Advanced" },
    { category: "Computer Vision", name: "OpenCV", level: "Expert" },
    { category: "Computer Vision", name: "Object Detection", level: "Expert" },
    { category: "NLP", name: "LangChain", level: "Advanced" },
    { category: "NLP", name: "RAG Pipelines", level: "Advanced" },
    { category: "NLP", name: "HuggingFace", level: "Advanced" },
    { category: "Backend", name: "Flask", level: "Advanced" },
    { category: "DevOps", name: "Docker", level: "Advanced" },
    { category: "DevOps", name: "Linux", level: "Advanced" },
    { category: "Tools", name: "Git/GitHub", level: "Expert" },
    { category: "Tools", name: "RabbitMQ", level: "Intermediate" },
  ];

  for (const skill of skills) {
    await fetch(`${API_URL}/api/admin/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(skill),
    });
  }
  console.log(`✅ Added ${skills.length} skills`);
}

async function addExperience(token) {
  console.log("💼 Adding experience...");
  const experiences = [
    {
      position: "AI Trainee Engineer",
      company: "Assimilate Technologies",
      description: "Building AI-powered solutions and computer vision systems",
      startDate: new Date("2026-01-15"),
      location: "Pune, India",
      current: true,
    },
    {
      position: "Data Scientist Intern",
      company: "The Skill Union",
      description: "Developed machine learning and deep learning projects",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      location: "Hyderabad, India",
      current: false,
    },
  ];

  for (const exp of experiences) {
    await fetch(`${API_URL}/api/admin/experience`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(exp),
    });
  }
  console.log(`✅ Added ${experiences.length} experiences`);
}

async function addProjects(token) {
  console.log("🚀 Adding projects...");
  const projects = [
    {
      title: "Video Analytics – Warehouse Safety System",
      description:
        "Real-time video analytics platform using YOLOv7 for warehouse safety monitoring, PPE compliance detection, and automated alerts",
      image: "https://via.placeholder.com/600x400?text=Video+Analytics",
      techStack: ["YOLOv7", "OpenCV", "RabbitMQ", "Flask", "Docker"],
      metrics: "Real-time monitoring, 95% accuracy",
      featured: true,
    },
    {
      title: "Vehicle & Person Monitoring System",
      description:
        "Computer vision system for vehicle entry/exit monitoring, weight-based restrictions, and person access control using YOLO-based detection",
      image: "https://via.placeholder.com/600x400?text=Vehicle+Monitoring",
      techStack: ["YOLO", "OpenCV", "Python", "Docker"],
      metrics: "99% detection accuracy",
      featured: true,
    },
    {
      title: "Road & Waste Management Vision System",
      description:
        "Computer vision system for road condition monitoring and waste detection on municipal surveillance feeds with geo-tagged alerts",
      image: "https://via.placeholder.com/600x400?text=Waste+Management",
      techStack: ["YOLO", "OpenCV", "Docker", "Python"],
      metrics: "Automated defect identification",
      featured: true,
    },
    {
      title: "Food Classifier with Nutritional Metadata",
      description:
        "CNN image-classification pipeline trained on 20,400 images with VGG-16, VGG-19, and ResNet for food classification with nutritional profiles",
      image: "https://via.placeholder.com/600x400?text=Food+Classifier",
      techStack: ["TensorFlow", "Keras", "CNN", "Transfer Learning", "Flask"],
      metrics: "34 classes, 90%+ accuracy",
      featured: false,
    },
    {
      title: "MedFlow – AI Clinical Notes Generation",
      description:
        "AI-powered platform automating SOAP note generation from doctor-patient conversations using LLMs with multi-role system and consent management",
      image: "https://via.placeholder.com/600x400?text=MedFlow",
      techStack: ["LLM", "LangChain", "Python", "Flask"],
      metrics: "UAE & USA clients",
      featured: false,
    },
    {
      title: "RAG-Based Chatbot – Ajman Land Department",
      description:
        "AI chatbot using RAG pipeline from government website data, providing context-aware responses for citizen queries about land services",
      image: "https://via.placeholder.com/600x400?text=RAG+Chatbot",
      techStack: ["LLM", "RAG", "LangChain", "Python"],
      metrics: "Government POC",
      featured: false,
    },
  ];

  for (const project of projects) {
    await fetch(`${API_URL}/api/admin/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
  }
  console.log(`✅ Added ${projects.length} projects`);
}

async function main() {
  try {
    console.log("🌱 Seeding portfolio with your resume data...\n");
    const token = await login();
    await updateProfile(token);
    await addSkills(token);
    await addExperience(token);
    await addProjects(token);

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✨ Portfolio seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("📋 Next steps:");
    console.log("1. Go to http://localhost:3000/admin/login");
    console.log("2. Login with: admin@portfolio.com / admin123");
    console.log("3. View your portfolio data in the admin dashboard");
    console.log("4. Visit http://localhost:3000 to see your live portfolio\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();
