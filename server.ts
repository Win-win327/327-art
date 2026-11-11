import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to send order email
  app.post("/api/send-order-email", async (req, res) => {
    try {
      const { orderItems, customerInfo, orderTotal } = req.body;

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error("Missing SMTP credentials");
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const orderDetailsHTML = orderItems.map((item: any) => 
        `<li>${item.title} (x${item.quantity}) - NT$ ${item.price * item.quantity}</li>`
      ).join('');

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.TARGET_EMAIL || "poweranimal2212@gmail.com",
        subject: "新訂單通知 - 327 ART 藝術工作室",
        html: `
          <h2>收到一筆新訂單！</h2>
          <h3>顧客資訊</h3>
          <ul>
            <li><strong>姓名：</strong> ${customerInfo.name}</li>
            <li><strong>信箱：</strong> ${customerInfo.email || "未提供"}</li>
            <li><strong>電話：</strong> ${customerInfo.phone}</li>
            <li><strong>地址：</strong> ${customerInfo.address}</li>
          </ul>
          <h3>訂單內容</h3>
          <ul>
            ${orderDetailsHTML}
          </ul>
          <h3><strong>總金額：NT$ ${orderTotal}</strong></h3>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Order email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  });

  // Serve static assets from public explicitly
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use('/images', express.static(path.join(process.cwd(), 'public/images')));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
