// netlify/functions/send-email.js
const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  // تحقق إن الطلب POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);

    // تأكد من كل البيانات المطلوبة
    if (!data.email || !data.name || !data.description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }

    // إعداد SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // نص الإيميل
    const message = `
🔥 طلب خدمة جديد من موقع NXT4

👤 الاسم: ${data.name}
📧 البريد الإلكتروني: ${data.email}
📱 رقم الهاتف: ${data.phone}
🛠️ نوع الخدمة: ${data.serviceType}
💰 الميزانية: ${data.budget}
📅 الموعد النهائي: ${data.deadline}

📝 وصف المشروع:
${data.description}
    `.trim();

    const msg = {
      to: 'YOUR_EMAIL@example.com', // 🔴 استبدل ده بالإيميل اللي عايز تستقبل عليه الرسائل
      from: 'no-reply@yourdomain.com', // 🔴 لازم يكون Verified Sender في SendGrid
      subject: `🔥 طلب خدمة جديد من ${data.name}`,
      text: message,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };

  } catch (error) {
    console.error('SendGrid Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email' }),
    };
  }
};
  
