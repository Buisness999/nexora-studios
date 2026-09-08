type SupabaseInquiryRow = {
  id: number | string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  website: string | null;
  project_type: string;
  project_reason: string;
  referral_source: string;
  message: string;
  created_at: string;
};

export type InquiryRecord = {
  id: number;
  businessName: string;
  contactName: string;
  email: string;
  phone: string | null;
  website: string | null;
  projectType: string;
  projectReason: string;
  referralSource: string;
  message: string;
  createdAt: string;
};

function getSupabaseConfig() {
  const url = process.env["SUPABASE_URL"];
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the API server.",
    );
  }

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
  };
}

export async function createInquiry(input: {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  projectType: string;
  projectReason: string;
  referralSource: string;
  message: string;
}): Promise<InquiryRecord> {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/inquiries?select=*`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      business_name: input.businessName,
      contact_name: input.contactName,
      email: input.email,
      phone: input.phone || null,
      website: input.website || null,
      project_type: input.projectType,
      project_reason: input.projectReason,
      referral_source: input.referralSource,
      message: input.message,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase insert failed (${response.status}): ${details}`);
  }

  const rows = (await response.json()) as SupabaseInquiryRow[];
  const row = rows[0];

  if (!row) {
    throw new Error("Supabase returned no inquiry after insert.");
  }

  return {
    id: Number(row.id),
    businessName: row.business_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    website: row.website,
    projectType: row.project_type,
    projectReason: row.project_reason,
    referralSource: row.referral_source,
    message: row.message,
    createdAt: row.created_at,
  };
}