
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Upload, User as UserIcon } from "lucide-react";

interface ProfileAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onAvatarChange?: () => void;
}

const ProfileAvatar = ({ user, size = "md", editable = false, onAvatarChange }: ProfileAvatarProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-20 w-20"
  };

  useEffect(() => {
    getProfile();
  }, [user.id]);

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random().toString(36).slice(2)}.${fileExt}`;

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL for the uploaded image');
      }

      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrlData.publicUrl);
      onAvatarChange?.();

      toast({
        title: "Avatar atualizado!",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar avatar",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className={sizeClass[size]}>
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>
          <UserIcon className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>

      {editable && (
        <div className="absolute bottom-0 right-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full bg-background"
            onClick={() => document.getElementById('avatar-upload')?.click()}
            disabled={uploading}
          >
            <Upload className="h-3 w-3" />
          </Button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
