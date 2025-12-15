# Mailgun Email Setup Guide

## 1. Get Your Mailgun Credentials

1. **Sign up for Mailgun**: Go to [mailgun.com](https://www.mailgun.com) and create an account
2. **Get your API key**: 
   - Go to Settings → API Keys
   - Copy your Private API key
3. **Get your domain**: 
   - Go to Sending → Domains
   - Use your sandbox domain for testing (e.g., `sandbox-123.mailgun.org`)
   - Or add your own domain for production

## 2. Add Environment Variables

Add these to your `.env` file:

```env
# Mailgun Configuration
MAILGUN_API_KEY="your-mailgun-api-key-here"
MAILGUN_DOMAIN="your-domain.com"
MAILGUN_FROM="Torrey Liu Photography <noreply@your-domain.com>"
MAILGUN_REPLY_TO="torrey@your-domain.com"

# Optional: Custom domain for unsubscribe links
SITE_URL="https://your-domain.com"
```

## 3. Domain Setup (Production)

For production, you'll need to:

1. **Add your domain** in Mailgun dashboard
2. **Add DNS records** to your domain:
   - TXT record for domain verification
   - MX record for receiving emails
   - CNAME record for tracking
3. **Verify your domain** in Mailgun

## 4. Testing

1. Start with the **sandbox domain** for testing
2. Add your email to the **authorized recipients** list
3. Test by publishing a blog post through the admin

## 5. Free Tier Limits

- **10,000 emails/month** for free
- **Sandbox domain** for testing
- **Custom domain** for production

## 6. Email Template

The system sends beautiful HTML emails with:
- Professional design
- Blog post title and description
- Call-to-action button
- Unsubscribe link
- Your branding

## 7. Troubleshooting

- Check Mailgun logs in the dashboard
- Verify API key and domain
- Check spam folder
- Ensure domain is verified (for custom domains)
