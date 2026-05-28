const twilio = require('twilio');

/**
 * Sends an emergency SMS to a list of contacts.
 * If Twilio is not configured, it will simulate sending SMS and log to console.
 * 
 * @param {Array} contacts - Array of emergency contacts [{ name, phone, relationship }]
 * @param {Object} emergencyData - Details of the emergency { userName, severity, gpsLat, gpsLng, vehicleStatus }
 * @returns {Promise<Object>} - Status of SMS dispatch
 */
exports.sendEmergencySMS = async (contacts, emergencyData) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  const isTwilioConfigured = 
    accountSid && 
    authToken && 
    fromPhone && 
    !accountSid.includes('your_twilio_account_sid');

  const { userName, severity, gpsLat, gpsLng, vehicleStatus } = emergencyData;
  
  // Format the emergency message
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${gpsLat},${gpsLng}`;
  const messageBody = `🚨 LIFELINK EMERGENCY ALERT 🚨\n\nYour contact ${userName} has been involved in a ${severity} accident. \n\nDetails:\n- Vehicle State: ${vehicleStatus || 'Impact Detected'}\n- GPS Location: ${gpsLat.toFixed(5)}, ${gpsLng.toFixed(5)}\n- Live Tracking Link: ${googleMapsUrl}\n\nEmergency services have been alerted. Please try calling them immediately.`;

  console.log('--------------------------------------------------');
  console.log('✉️  LIFELINK EMERGENCY SMS OUTBOUND DISPATCH');
  console.log(`To Contacts: ${contacts.map(c => `${c.name} (${c.phone})`).join(', ')}`);
  console.log(`Message Content:\n${messageBody}`);
  console.log('--------------------------------------------------');

  if (!isTwilioConfigured) {
    console.warn('⚠️  Twilio SMS Credentials not configured in .env. Running in simulated SMS mode.');
    return {
      success: true,
      simulated: true,
      message: 'Simulated SMS sent successfully to all contacts.',
      contacts: contacts.map(c => ({ name: c.name, phone: c.phone, smsSent: true }))
    };
  }

  try {
    const client = twilio(accountSid, authToken);
    const smsPromises = contacts.map(async (contact) => {
      try {
        if (!contact.phone) return { ...contact, smsSent: false, error: 'No phone number provided' };
        
        await client.messages.create({
          body: messageBody,
          from: fromPhone,
          to: contact.phone
        });

        console.log(`✅ SMS successfully sent via Twilio to ${contact.name} at ${contact.phone}`);
        return { name: contact.name, phone: contact.phone, smsSent: true };
      } catch (err) {
        console.error(`❌ Failed to send SMS to ${contact.name} (${contact.phone}):`, err.message);
        return { name: contact.name, phone: contact.phone, smsSent: false, error: err.message };
      }
    });

    const results = await Promise.all(smsPromises);
    const allSuccessful = results.every(r => r.smsSent);

    return {
      success: allSuccessful,
      simulated: false,
      message: allSuccessful ? 'All SMS sent successfully via Twilio' : 'Some SMS failed to send',
      contacts: results
    };
  } catch (globalErr) {
    console.error('❌ Twilio global client initiation failed:', globalErr.message);
    return {
      success: false,
      simulated: false,
      message: 'Twilio SMS failed globally',
      error: globalErr.message,
      contacts: contacts.map(c => ({ name: c.name, phone: c.phone, smsSent: false }))
    };
  }
};
