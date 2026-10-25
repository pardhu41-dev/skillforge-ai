import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from dotenv import load_dotenv

logger = logging.getLogger("uvicorn")

# Load environment variables from .env file
backend_dir = Path(__file__).resolve().parent.parent
env_path = backend_dir / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

def send_otp_email(to_email: str, otp: str) -> bool:
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    smtp_from = os.getenv("SMTP_FROM", smtp_user)

    if not smtp_user or not smtp_password:
        logger.error(f"SMTP credentials not configured. Unable to send OTP email to {to_email}.")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Your SkillForge AI Verification Code"
        msg["From"] = f"SkillForge AI <{smtp_from}>"
        msg["To"] = to_email

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #f8fafc; margin: 0; padding: 40px 20px; }}
            .container {{ max-width: 480px; margin: 0 auto; background: #1e293b; border-radius: 20px; padding: 36px 28px; border: 1px solid #334155; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }}
            .brand {{ font-size: 26px; font-weight: 800; color: #ffffff; text-align: center; margin-bottom: 24px; tracking: -0.025em; }}
            .brand-blue {{ color: #60a5fa; }}
            .title {{ font-size: 18px; font-weight: 700; color: #f8fafc; text-align: center; margin-bottom: 8px; }}
            .subtitle {{ font-size: 14px; color: #94a3b8; text-align: center; margin-bottom: 28px; line-height: 1.5; }}
            .otp-container {{ background: #0f172a; border: 1px solid #3b82f6; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px; }}
            .otp-code {{ font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; font-family: 'Courier New', Courier, monospace; margin: 0; }}
            .expiry-note {{ font-size: 13px; color: #f59e0b; text-align: center; font-weight: 600; margin-bottom: 20px; display: block; }}
            .footer {{ text-align: center; font-size: 12px; color: #64748b; margin-top: 32px; border-top: 1px solid #334155; padding-top: 20px; line-height: 1.5; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="brand">SkillForge <span class="brand-blue">AI</span></div>
            <div class="title">Verification Code</div>
            <div class="subtitle">Use the 6-digit OTP code below to verify your login identity:</div>
            <div class="otp-container">
              <div class="otp-code">{otp}</div>
            </div>
            <span class="expiry-note">⏳ Note: This code expires in 5 minutes.</span>
            <div class="footer">
              If you did not request this verification code, please ignore this email.<br>
              &copy; SkillForge AI Platform. All rights reserved.
            </div>
          </div>
        </body>
        </html>
        """

        text_content = f"Your SkillForge AI Verification Code is: {otp}\n\nNote: This code expires in 5 minutes."

        msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        logger.info(f"Connecting to SMTP server {smtp_host}:{smtp_port}...")
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_from, [to_email], msg.as_string())

        logger.info(f"Successfully sent OTP email to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP email to {to_email}: {str(e)}")
        return False
