# MindFlow: A Productivity App for ADHD Minds  
Reclaim Your Focus, Achieve Your Goals  

---

## 📖 **About MindFlow**  
MindFlow is a productivity app designed specifically for individuals with ADHD. It tackles common challenges such as task prioritization, focus retention, and progress tracking by offering a user-centered solution built with ADHD needs in mind.  

### **Key Features**  
- **Flexible Task Scheduling:**  
  Daily, one-time, and custom weekly schedules.  
- **Diverse Progress Tracking:**  
  Time spent, count-based tracking, checkboxes, and sub-tasks.  
- **Guided Focus Sessions:**  
  Tasks are ranked using **NUIC (Novelty, Urgency, Interest, Challenge)** for optimal engagement.  
- **In-Depth Analytics and Logs:**  
  Identify productivity patterns and track progress visually.  

---

## 🛠️ **Tech Stack**  
- **Frontend:** [Next.js](https://nextjs.org/)  
- **Backend:** [Node.js](https://nodejs.org/)  
- **Database:** [PostgreSQL](https://www.postgresql.org/)  
- **Authentication:** [JWT (JSON Web Tokens)](https://jwt.io/)  

---

## 🚀 **Project Demo**  
- **Live Demo Video:** [Watch the Demo](https://drive.google.com/file/d/1xMQ9Y1lclDe1gA0zP5EKE0VwUNhpiH5B/view?usp=sharing)  
- **GitHub Repository:** [MindFlow on GitHub](https://github.com/Abdallah-Ragab/adhd-mindflow)  

---

## 📐 **Architecture Overview**  
MindFlow employs a robust architecture designed for scalability and user-centric performance:  

1. **Frontend:**  
   Built with Next.js to ensure responsiveness and a seamless user experience.  

2. **Backend:**  
   Powered by Node.js, handling core business logic, including the **NUIC ranking algorithm**.  

3. **Database:**  
   PostgreSQL is used for secure and efficient data storage.  

4. **Authentication:**  
   JWT secures user data and ensures privacy.  

---

## 🔧 **Installation & Setup**  
Follow these steps to run the project locally:  

### Prerequisites:  
- **Node.js** and **npm** installed on your system.  
- **PostgreSQL** installed and running.  

### Steps:  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Abdallah-Ragab/adhd-mindflow.git
   cd adhd-mindflow
   ```  

2. Install dependencies:  
   ```bash
   npm install
   ```  

3. Configure environment variables:  
   Create a `.env` file and add the following:  
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   ```  

4. Run database migrations:  
   ```bash
   npx prisma migrate dev
   ```  

5. Start the development server:  
   ```bash
   npm run dev
   ```  

6. Access the app at:  
   [http://localhost:3000](http://localhost:3000)  

---

## 📧 **Contact**  
For questions, feedback, or collaboration:  
**Email:** abdallahsamehragab1@gmail.com  

---

## 📝 **License**  
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
