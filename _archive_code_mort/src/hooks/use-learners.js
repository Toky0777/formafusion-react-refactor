import { useState, useMemo } from "react"

export function useLearners() {
  const [learners, setLearners] = useState([
    {
      id: "1",
      firstName: "Marie",
      lastName: "Dubois",
      email: "marie.dubois@techcorp.fr",
      phone: "+33 1 23 45 67 89",
      company: "TechCorp Solutions",
      department: "Développement",
      position: "Développeuse Senior",
      status: "active",
      enrolledCourses: 3,
      avatar: "/professional-woman-diverse.png",
      completedTraining: [
        {
          id: "1",
          title: "JavaScript Avancé",
          startDate: "2024-01-15",
          endDate: "2024-02-15",
          duration: "40h",
          instructor: "Jean Martin",
          status: "completed",
        },
      ],
      upcomingTraining: [
        {
          id: "2",
          title: "React Performance",
          startDate: "2024-12-01",
          endDate: "2024-12-15",
          duration: "30h",
          instructor: "Sophie Laurent",
          status: "upcoming",
        },
      ],
    },
    // ... autres apprenants
  ])

  const deleteLearner = (id) => {
    setLearners((prev) => prev.filter((learner) => learner.id !== id))
  }

  const addLearner = (learner) => {
    const newLearner = {
      ...learner,
      id: Date.now().toString(),
    }
    setLearners((prev) => [...prev, newLearner])
  }

  const stats = useMemo(() => {
    const total = learners.length
    const active = learners.filter((l) => l.status === "active").length
    return {
      total,
      active,
      participationRate: Math.round((active / total) * 100),
      attendanceRate: 85, // valeur fixe pour l'exemple
    }
  }, [learners])

  return {
    learners,
    stats,
    deleteLearner,
    addLearner,
  }
}
