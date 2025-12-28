import { ProfileData, DEFAULT_PROFILE } from "@/types/profile";
import { supabase } from "@/lib/supabaseClient";

const mapRowToProfile = (row: any): ProfileData => ({
  name: row.name ?? DEFAULT_PROFILE.name,
  title: row.title ?? DEFAULT_PROFILE.title,
  bio: row.bio ?? DEFAULT_PROFILE.bio,
  bioHome: row.bio_home ?? row.bio ?? DEFAULT_PROFILE.bioHome,
  bioAbout: row.bio_about ?? row.bio ?? DEFAULT_PROFILE.bioAbout,
  profileImage: row.avatar_url ?? DEFAULT_PROFILE.profileImage,
  email: row.email ?? DEFAULT_PROFILE.email,
  phone: row.phone ?? DEFAULT_PROFILE.phone,
  location: row.location ?? DEFAULT_PROFILE.location,
  github: row.github ?? DEFAULT_PROFILE.github,
  linkedin: row.linkedin ?? DEFAULT_PROFILE.linkedin,
  twitter: row.twitter ?? DEFAULT_PROFILE.twitter,
  cvUrl: DEFAULT_PROFILE.cvUrl,
  experience: DEFAULT_PROFILE.experience,
  education: DEFAULT_PROFILE.education,
  stats: DEFAULT_PROFILE.stats,
  skills: DEFAULT_PROFILE.skills,
  availability: DEFAULT_PROFILE.availability,
});

export const getProfile = async (): Promise<ProfileData> => {
  try {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile from Supabase:", error);
      return DEFAULT_PROFILE;
    }

    if (!data) {
      const insertPayload = {
        name: DEFAULT_PROFILE.name,
        title: DEFAULT_PROFILE.title,
        bio: DEFAULT_PROFILE.bio,
        bio_home: DEFAULT_PROFILE.bioHome,
        bio_about: DEFAULT_PROFILE.bioAbout,
        avatar_url: DEFAULT_PROFILE.profileImage,
        email: DEFAULT_PROFILE.email,
        phone: DEFAULT_PROFILE.phone,
        location: DEFAULT_PROFILE.location,
        github: DEFAULT_PROFILE.github,
        linkedin: DEFAULT_PROFILE.linkedin,
        twitter: DEFAULT_PROFILE.twitter,
      };

      const { data: inserted, error: insertError } = await supabase
        .from("profile")
        .insert(insertPayload)
        .select("*")
        .single();

      if (insertError || !inserted) {
        console.error("Error seeding default profile in Supabase:", insertError);
        return DEFAULT_PROFILE;
      }

      return mapRowToProfile(inserted);
    }

    return mapRowToProfile(data);
  } catch (err) {
    console.error("Unexpected error fetching profile:", err);
    return DEFAULT_PROFILE;
  }
};

export const saveProfile = async (profile: ProfileData): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("profile")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error loading profile id before update:", error);
      return;
    }

    const payload = {
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      bio_home: profile.bioHome ?? profile.bio,
      bio_about: profile.bioAbout ?? profile.bio,
      avatar_url: profile.profileImage,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      github: profile.github,
      linkedin: profile.linkedin,
      twitter: profile.twitter,
    };

    if (!data) {
      const { error: insertError } = await supabase.from("profile").insert(payload);
      if (insertError) {
        console.error("Error inserting profile into Supabase:", insertError);
      }
    } else {
      const { error: updateError } = await supabase
        .from("profile")
        .update(payload)
        .eq("id", data.id);
      if (updateError) {
        console.error("Error updating profile in Supabase:", updateError);
      }
    }
  } catch (err) {
    console.error("Unexpected error saving profile:", err);
  }
};
