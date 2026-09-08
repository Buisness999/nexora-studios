import { Router, type IRouter } from "express";
import { CreateInquiryBody, CreateInquiryResponse } from "@workspace/api-zod";
import { createInquiry } from "../lib/supabase";

const router: IRouter = Router();

router.post("/inquiries", async (req, res) => {
  const parsed = CreateInquiryBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Please complete all required inquiry fields." });
    return;
  }

  try {
    const record = await createInquiry(parsed.data);
    res.status(201).json(
      CreateInquiryResponse.parse(record),
    );
  } catch (error) {
    req.log.error({ err: error }, "Unable to save website inquiry");
    const message =
      error instanceof Error && error.message.startsWith("Supabase is not configured")
        ? "The inquiry form is not connected to Supabase yet."
        : "We could not save your inquiry right now. Please try again.";
    res.status(503).json({ error: message });
  }
});

export default router;