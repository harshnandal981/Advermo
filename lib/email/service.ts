import { Resend } from 'resend';
import { render } from '@react-email/render';
import connectDB from '@/lib/mongodb';
import EmailLog from '@/lib/models/EmailLog';
import { EmailTemplate } from '@/types';
import { isValidEmail } from './helpers';

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendEmailParams {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  template?: EmailTemplate;
  metadata?: Record<string, any>;
}

interface EmailLogData {
  recipient: string;
  subject: string;
  template?: EmailTemplate;
  status: 'sent' | 'failed' | 'bounced' | 'delivered' | 'opened';
  resendId?: string;
  metadata?: Record<string, any>;
  error?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({
  to,
  subject,
  react,
  template,
  metadata = {},
}: SendEmailParams): Promise<{ success: boolean; id?: string; error?: any }> {
  try {
    // Validate email address
    const recipients = Array.isArray(to) ? to : [to];
    const invalidEmails = recipients.filter((email) => !isValidEmail(email));
    
    if (invalidEmails.length > 0) {
      throw new Error(`Invalid email address(es): ${invalidEmails.join(', ')}`);
    }

    // Check if Resend is configured
    if (!resend || !resendApiKey) {
      console.warn('Resend API key not configured. Email not sent:', { to, subject });
      
      // Log the failed attempt
      if (template) {
        await logEmail({
          recipient: recipients[0],
          subject,
          template,
          status: 'failed',
          error: 'Resend API key not configured',
          metadata,
        });
      }
      
      return { 
        success: false, 
        error: 'Email service not configured' 
      };
    }

    const emailFrom = process.env.EMAIL_FROM || 'Advermo <onboarding@resend.dev>';

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: recipients,
      subject,
      react,
    });

    if (error) {
      console.error('Resend email error:', error);
      
      // Log the failure
      if (template) {
        await logEmail({
          recipient: recipients[0],
          subject,
          template,
          status: 'failed',
          error: error.message || JSON.stringify(error),
          metadata,
        });
      }
      
      throw error;
    }

    // Log successful send
    if (template && data) {
      await logEmail({
        recipient: recipients[0],
        subject,
        template,
        status: 'sent',
        resendId: data.id,
        metadata,
      });
    }

    return { success: true, id: data?.id };
  } catch (error: any) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

/**
 * Log email to database
 */
async function logEmail(data: EmailLogData): Promise<void> {
  try {
    await connectDB();
    
    await EmailLog.create({
      recipient: data.recipient,
      subject: data.subject,
      template: data.template || 'welcome', // Provide default if not specified
      status: data.status,
      resendId: data.resendId,
      metadata: data.metadata || {},
      error: data.error,
      sentAt: new Date(),
    });
  } catch (error) {
    console.error('Error logging email:', error);
    // Don't throw - we don't want email logging to break the email send
  }
}

/**
 * Render email to HTML (for testing/preview)
 */
export async function renderEmail(react: React.ReactElement): Promise<string> {
  return render(react);
}

/**
 * Retry failed emails with exponential backoff
 */
export async function retryFailedEmail(
  emailLogId: string,
  maxRetries: number = 3
): Promise<boolean> {
  try {
    await connectDB();
    const emailLog = await EmailLog.findById(emailLogId);
    
    if (!emailLog || emailLog.status !== 'failed') {
      return false;
    }

    // Check retry count in metadata
    const retryCount = (emailLog.metadata?.retryCount || 0) + 1;
    
    if (retryCount > maxRetries) {
      console.log(`Max retries reached for email ${emailLogId}`);
      return false;
    }

    // Calculate exponential backoff delay
    const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Update retry count
    emailLog.metadata = {
      ...emailLog.metadata,
      retryCount,
    };
    await emailLog.save();

    return true;
  } catch (error) {
    console.error('Error retrying failed email:', error);
    return false;
  }
}

export default sendEmail;
