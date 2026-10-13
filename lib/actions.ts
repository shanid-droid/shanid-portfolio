"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "./supabase/server";
import { createAdminClient } from "./supabase/admin";
import type {
  SiteSettings,
  Project,
  Skill,
  Education,
  Certificate,
  Participation,
  Experiment,
  Interest,
  MusicTrack,
} from "./cms";

/**
 * Strictly verifies that the caller is authenticated AND matches the configured ADMIN_OWNER_EMAIL.
 */
async function assertOwner() {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured yet. Please configure .env.local to save changes.");
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: You must be logged in as an administrator.");
  }

  const ownerEmail = process.env.ADMIN_OWNER_EMAIL?.trim().toLowerCase();
  const userEmail = user.email?.trim().toLowerCase();

  if (ownerEmail && userEmail !== ownerEmail) {
    throw new Error("Forbidden: This account is not authorized as the portfolio owner.");
  }

  return { supabase, user };
}

// ---------------------------------------------------------------------------
// AUTH ACTIONS
// ---------------------------------------------------------------------------
export async function loginAdminAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const ownerEmail = process.env.ADMIN_OWNER_EMAIL?.trim().toLowerCase();
  if (ownerEmail && email.toLowerCase() !== ownerEmail) {
    return { error: "Access denied. Only the configured owner email can sign in." };
  }

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!isSupabaseConfigured) {
    return { error: "Supabase credentials are not configured in environment variables." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Authentication failed";
    return { error: msg };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logoutAdminAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// SITE SETTINGS ACTIONS
// ---------------------------------------------------------------------------
export async function updateSiteSettingsAction(settings: Partial<SiteSettings>) {
  const { supabase } = await assertOwner();
  
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true };
}

// ---------------------------------------------------------------------------
// PROJECTS ACTIONS
// ---------------------------------------------------------------------------
export async function upsertProjectAction(project: Partial<Project>) {
  const { supabase } = await assertOwner();

  const payload = {
    ...project,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("projects").upsert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProjectAction(id: string) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function reorderItemsAction(
  table: "projects" | "skills" | "education" | "certificates" | "participations" | "experiments" | "interests",
  orderedIds: string[]
) {
  const { supabase } = await assertOwner();

  for (let index = 0; index < orderedIds.length; index++) {
    const id = orderedIds[index];
    await supabase.from(table).update({ display_order: index + 1 }).eq("id", id);
  }

  revalidatePath("/", "layout");
  revalidatePath(`/admin/${table}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// SKILLS ACTIONS
// ---------------------------------------------------------------------------
export async function upsertSkillAction(skill: Partial<Skill>) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("skills").upsert(skill);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/skills");
  return { success: true };
}

export async function deleteSkillAction(id: string) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/skills");
  return { success: true };
}

// ---------------------------------------------------------------------------
// EDUCATION ACTIONS
// ---------------------------------------------------------------------------
export async function upsertEducationAction(edu: Partial<Education>) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("education").upsert(edu);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/education");
  return { success: true };
}

export async function deleteEducationAction(id: string) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/education");
  return { success: true };
}

// ---------------------------------------------------------------------------
// CERTIFICATES ACTIONS
// ---------------------------------------------------------------------------
export async function upsertCertificateAction(cert: Partial<Certificate>) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("certificates").upsert(cert);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/certificates");
  return { success: true };
}

export async function deleteCertificateAction(id: string) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/certificates");
  return { success: true };
}

// ---------------------------------------------------------------------------
// PARTICIPATIONS ACTIONS
// ---------------------------------------------------------------------------
export async function upsertParticipationAction(item: Partial<Participation>) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("participations").upsert(item);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/participations");
  return { success: true };
}

export async function deleteParticipationAction(id: string) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("participations").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/participations");
  return { success: true };
}

// ---------------------------------------------------------------------------
// EXPERIMENTS ACTIONS
// ---------------------------------------------------------------------------
export async function upsertExperimentAction(item: Partial<Experiment>) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("experiments").upsert(item);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/experiments");
  return { success: true };
}

export async function deleteExperimentAction(id: string) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("experiments").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/experiments");
  return { success: true };
}

// ---------------------------------------------------------------------------
// INTERESTS ACTIONS
// ---------------------------------------------------------------------------
export async function upsertInterestAction(item: Partial<Interest>) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("interests").upsert(item);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/interests");
  return { success: true };
}

export async function deleteInterestAction(id: string) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("interests").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/interests");
  return { success: true };
}

// ---------------------------------------------------------------------------
// MESSAGES ACTIONS
// ---------------------------------------------------------------------------
export async function markMessageReadAction(id: string, read: boolean) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("messages").update({ read }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/messages");
  return { success: true };
}

/**
 * Public action for contact form submissions.
 * Validates inputs and inserts a message into the private messages table.
 */
export async function submitContactMessageAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { error: "Please provide your name, email, and message." };
  }

  // Basic email pattern check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!isSupabaseConfigured) {
    // If Supabase is offline/unconfigured, simulate successful delivery
    return { success: true, simulated: true };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("messages").insert({
      name,
      email,
      subject: subject || "Portfolio Inbound Inquiry",
      message,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to send message";
    return { error: msg };
  }
}

// ---------------------------------------------------------------------------
// MEDIA UPLOAD ACTION (Supabase Storage)
// ---------------------------------------------------------------------------
export async function uploadMediaAction(formData: FormData) {
  await assertOwner();

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided for upload." };
  }

  // File size limit: 25MB max
  if (file.size > 25 * 1024 * 1024) {
    return { error: "File exceeds 25MB maximum limit." };
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { error: "Supabase service role client is unconfigured." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExt = file.name.split(".").pop();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileName = `${Date.now()}-${sanitizedName}`;

  const { data, error } = await adminClient.storage
    .from("portfolio-media")
    .upload(fileName, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (error) {
    return { error: error.message };
  }

  const { data: publicUrlData } = adminClient.storage
    .from("portfolio-media")
    .getPublicUrl(data.path);

  return { success: true, url: publicUrlData.publicUrl };
}
// ---------------------------------------------------------------------------
// MUSIC TRACKS ACTIONS
// ---------------------------------------------------------------------------
export async function upsertMusicTrackAction(track: Partial<MusicTrack>) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("music_tracks").upsert(track);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/music");
  return { success: true };
}

export async function deleteMusicTrackAction(id: string) {
  const { supabase } = await assertOwner();
  const { error } = await supabase.from("music_tracks").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/music");
  return { success: true };
}
