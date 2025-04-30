
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";

interface ProfileAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

const ProfileAvatar = ({ user, size = "md" }: ProfileAvatarProps) => {
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-20 w-20"
  };

  const nameInitial = user.email ? user.email[0].toUpperCase() : "U";

  return (
    <Avatar className={sizeClass[size]}>
      <AvatarFallback>
        {nameInitial}
        <UserIcon className="w-4 h-4" />
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
