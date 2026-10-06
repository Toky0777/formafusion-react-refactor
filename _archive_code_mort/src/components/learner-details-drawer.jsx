import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent } from "./ui/card"
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  CheckCircle,
  Calendar,
  Clock,
  GraduationCap,
} from "lucide-react"

export function LearnerDetailsDrawer({ learner, isOpen, onClose }) {
  if (!learner) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[1600px] sm:w-[1800px] overflow-y-auto">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={learner.avatar || "/placeholder.svg"}
                alt={`${learner.firstName} ${learner.lastName}`}
              />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {learner.firstName[0]}
                {learner.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-2xl font-bold text-gray-900">
                {learner.firstName} {learner.lastName}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={learner.status === "active" ? "default" : "secondary"}>
                  {learner.status === "active" ? "Actif" : "Inactif"}
                </Badge>
                <span className="text-sm text-gray-600">{learner.enrolledCourses} formations inscrites</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-8 py-6">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
            <div className="space-y-3">
              {[
                { icon: User, label: "Nom complet", value: `${learner.firstName} ${learner.lastName}` },
                { icon: Mail, label: "Email", value: learner.email },
                { icon: Phone, label: "Téléphone", value: learner.phone },
                { icon: Building2, label: "Entreprise", value: learner.company },
                { icon: MapPin, label: "Département", value: learner.department },
                { icon: Briefcase, label: "Poste", value: learner.position },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formations terminées */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Formations terminées</h3>
            {learner.completedTraining.length > 0 ? (
              <div className="space-y-4">
                {learner.completedTraining.map((training) => (
                  <Card key={training.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{training.title}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {training.startDate} - {training.endDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{training.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>{training.instructor}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aucune formation terminée</p>
              </div>
            )}
          </div>

          {/* Formations à venir */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Formations à venir</h3>
            {learner.upcomingTraining.length > 0 ? (
              <div className="space-y-4">
                {learner.upcomingTraining.map((training) => (
                  <Card key={training.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{training.title}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {training.startDate} - {training.endDate}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{training.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>{training.instructor}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">À venir</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aucune formation programmée</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
