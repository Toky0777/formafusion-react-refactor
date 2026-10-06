import { Lock, Pen, User } from "lucide-react";
import { Button } from "../ui/button-customized";
import { Link } from "react-router-dom";

export const ProfileHeader = ({
  customerName,
  description,
  refConnected,
  onEditProfile,
  onSecurity,
  onEditUser,
}) => {
  return (
    <header className="inline-flex items-center justify-between w-full gap-2 mb-4">
      <div className="flex flex-col sm:w-[60%] lg:w-[45%] xl:w-[55%] 2xl:w-[65%] gap-2">
        <span className="text-gray-400">Profile &gt; {customerName}</span>
        <h1 className="w-full text-xl font-medium text-gray-700 truncate">
          {description || <span className="text-gray-600">--</span>}
        </h1>
      </div>

      <div className="flex flex-col items-end gap-2 lg:flex-row lg:items-center">
        <Link to="/cfp/mot_de_passe">
          <Button variant="outline" size="sm" icon={Lock} onClick={onSecurity}>
            Password
          </Button>
        </Link>

        {refConnected && (
          <Button
            variant="outline"
            size="sm"
            icon={Pen}
            onClick={onEditProfile}
          >
            Edit Company Profile
          </Button>
        )}

        <Button variant="outline" size="sm" icon={User} onClick={onEditUser}>
          Edit User Profile
        </Button>
      </div>
    </header>
  );
};
