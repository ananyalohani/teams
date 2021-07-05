import createHandler from '@/middleware';
import sendgrid from '@sendgrid/mail';

const handler = createHandler();

handler.post(async (req, res) => {
  const data = req.body;
  sendEmail(data);
});

function sendEmail(data) {
  sendgrid.setApiKey(process.env.SMTP_PASSWORD);
  const templateId = 'd-4a70325858aa46db9c8bbc21722f4ee8';

  const options = {
    to: data.receiver,
    from: 'noreply@msft.lohani.dev',
    templateId,
    dynamic_template_data: {
      senderName: data.senderName,
      receiverName: data.receiverName,
      roomId: data.roomId,
      meetingLink: data.meetingLink,
    },
  };

  sendgrid.send(options, (error, result) => {
    if (error) console.error(error);
    else console.log('Email sent successfully.');
  });
}

export default handler;
