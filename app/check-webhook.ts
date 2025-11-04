// Check Twilio webhook configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error('❌ Twilio credentials not configured');
  process.exit(1);
}

async function checkWebhook() {
  console.log('\n🔍 Checking Twilio webhook configuration...\n');

  // Get WhatsApp sender (phone number configuration)
  const phoneNumber = process.env.TWILIO_WHATSAPP_NUMBER?.replace('whatsapp:', '') || '+14155238886';

  console.log('Phone Number:', phoneNumber);
  console.log('Account SID:', accountSid);

  // Get incoming message webhook URL
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Twilio API error:', response.status, error);
    return;
  }

  const data = await response.json();

  console.log('\n📱 Phone Numbers:');
  for (const phone of data.incoming_phone_numbers) {
    console.log('\nNumber:', phone.phone_number);
    console.log('SMS URL:', phone.sms_url);
    console.log('SMS Method:', phone.sms_method);
    console.log('Status Callback:', phone.status_callback);
  }

  // Also check messages to see if webhook is being called
  console.log('\n\n📩 Recent Messages (last 5):');
  const messagesUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json?PageSize=5`;

  const messagesResponse = await fetch(messagesUrl, {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
    },
  });

  if (messagesResponse.ok) {
    const messagesData = await messagesResponse.json();
    for (const msg of messagesData.messages) {
      console.log(`\n- ${msg.direction} | ${msg.from} → ${msg.to}`);
      console.log(`  Status: ${msg.status} | Body: ${msg.body?.substring(0, 50)}`);
      console.log(`  Date: ${msg.date_created}`);
    }
  }
}

checkWebhook().catch(console.error);
