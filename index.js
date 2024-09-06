const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config(); // Load environment variables

// Replace with your own token
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const messageIds = {};
const userState = {}; // Track user state

// Global variables for QR code path, group link, and verification image
const qrCodePath = process.env.QR_CODE_PATH;
const groupLink = process.env.GROUP_LINK;
const verificationImagePath = process.env.VERIFICATION_IMAGE_PATH;

// List of courses
const courses = [
  { name: '🎈🎁ABHAY MAGIC COURSE🎉🎨', price: '99' },
  { name: '🎈🎁ABHAY MAGIC PART 2🎉🎨', price: '399' },
  { name: '🎈🎁SWARNIM PATHAK(LEARN MAGIC)🎉🎨', price: '199' },
  { name: '🎈🎁STREET HYNOSIS BY HYPNOGURU🎉🎨', price: '399' },
  { name: '🎈🎁MIND READING BY HYPNOGURU🎉🎨', price: '199' },
  { name: '🎈🎁SIGMA 3.0 BY APNA COLLEGE🎉🎨', price: '399' },
  { name: '🎈🎁SIGMA 4.0 BY APNA COLLEGE🎉🎨', price: '399' },
  { name: '🎈🎁DELTA BY APNA COLLEGE🎉🎨', price: '199' },
  { name: '🎈🎁ALPHA BY APNA COLLEGE🎉🎨', price: '199' },
  { name: '🎈🎁PROFESSOR OF HOW(ANIMATION COURSE)🎉🎨', price: '299' },
  // Add more courses as needed
];

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Send a list of courses
  const courseList = courses
    .map(
      (course, index) =>
        `${index + 1}. ${course.name}\nOFFICIAL PRICE: 10000/-  OUR PRICE: ${course.price}`
    )
    .join('\n\n');

  bot.sendMessage(
    chatId,
    `🎁🎀Welcome! Here are the available courses:🎈🎈\n\n${courseList}\n\nProofs: ${groupLink}\nFOR MORE COURSES CONTACT US: @COURSE_PROVIDER01\nTo get more details, please type the course number (e.g., 1, 2, 3).`
  ).then((sentMessage) => {
    if (!messageIds[chatId]) {
      messageIds[chatId] = [];
    }
    messageIds[chatId].push(sentMessage.message_id);
  });
});

// Clear all stored messages
bot.onText(/\/cls/, (msg) => {
  const chatId = msg.chat.id;

  if (messageIds[chatId]) {
    // Delete all stored messages
    messageIds[chatId].forEach((messageId) => {
      bot.deleteMessage(chatId, messageId).catch((err) => console.error(err));
    });
    // Clear the stored message IDs
    messageIds[chatId] = [];
  }
  bot.sendMessage(chatId, 'Chat cleared!');
});

// Handle user messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (text.startsWith('/')) return; // Ignore commands

  // Determine user state
  if (!userState[chatId]) userState[chatId] = {};

  if (text.length <= 2) {
    // Handle course number input
    const courseNumber = parseInt(text, 10) - 1;

    if (courseNumber >= 0 && courseNumber < courses.length) {
      const course = courses[courseNumber];
      const buttons = [
        [
          { text: 'Buy', callback_data: `buy` },
          { text: 'Proofs', callback_data: `proofs` },
        ],
      ];

      bot.sendMessage(
        chatId,
        `${course.name}\nOFFICIAL PRICE: 10000/-  OUR PRICE: ${course.price}`,
        { reply_markup: { inline_keyboard: buttons } }
      );

      // Reset user state
      userState[chatId] = { courseNumber };
    } else {
      bot.sendMessage(
        chatId,
        'Invalid course number. Please enter a valid number.'
      );
    }
  } else if (text.length > 5) {
    // Handle transaction ID input
    if (userState[chatId] && userState[chatId].waitingForTransactionId) {
      if (text.length === 12) {
        // Valid transaction ID
        bot.sendPhoto(chatId, verificationImagePath);
        bot.sendMessage(chatId, 'You have been verified🎁.\n 💖send your screenshot to admin to get this course\nAdmin: @course_provider01');

        // Reset state
        userState[chatId] = {};
      } else {
        bot.sendMessage(chatId, 'Invalid transaction ID. Please send a 12-digit transaction ID.');
      }
    } else {
      bot.sendMessage(chatId, 'Please request a QR code first by clicking the "Buy" button.');
    }
  } else {
    bot.sendMessage(chatId, 'Invalid input. Please enter a valid course number or transaction ID.');
  }
});

// Handle callback queries
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const { data } = callbackQuery;
  const [action] = data.split('_');

  if (action === 'buy') {
    bot.sendPhoto(chatId, qrCodePath, {
      caption:
        'Here is your QR code to complete the purchase. Please send your transaction ID or screenshot of payment.',
    });

    // Update state to wait for transaction ID
    userState[chatId] = { waitingForTransactionId: true };
  } else if (action === 'proofs') {
    bot.sendMessage(
      chatId,
      `Click here to join the group for proofs: ${groupLink}`
    );
  }
});

// Serve HTML status page


app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
