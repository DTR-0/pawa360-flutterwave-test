import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import billsRouter from "./routes/bills";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(
  "/webhook/flutterwave",
  express.raw({ type: "application/json" })
);

app.post("/webhook/flutterwave", (req: Request, res: Response) => {
  try {
    const signature = req.headers["verif-hash"] as string | undefined;
    const secretHash = process.env.FLW_SECRET_HASH;

    if (!signature || signature !== secretHash) {
      console.error("Webhook signature mismatch");
      return res.status(400).send("Signature mismatch");
    }

    const payload = req.body.toString();
    const jsonBody = JSON.parse(payload);

    console.log("Flutterwave Webhook payload:", jsonBody);

    // handle event e.g. update DB, send notification, etc.

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).send("Server error");
  }
});

// Apply JSON parser for normal routes
app.use(express.json());

app.use("/api/bills", billsRouter);

app.get('/', (req, res) => {
  res.send('hello world')
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
