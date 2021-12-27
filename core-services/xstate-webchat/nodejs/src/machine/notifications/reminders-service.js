const sha256 = require('js-sha256');
const { personService } = require('../service/service-loader');
const channelProvider = require('../../channel');
const envVariables = require('../../env-variables');
const { messages } = require('../messages/reminders');
const dialog = require('../util/dialog.js');
const repoProvider = require('../../session/repo');

class RemindersService {
  async triggerReminders() {
    const people = await personService.fetchAllHomeIsolatedPatients();

    console.log('Sending reminders to people');
    await this.sendMessages(people);
    console.log('Reminders execution end');
  }

  async sendMessages(people) {
    const extraInfo = {
      whatsAppBusinessNumber: envVariables.whatsAppBusinessNumber,
    };
    for (const person of people.data) {
      const mobile = person.patient_mobile;
      const userId = sha256.sha256(mobile);

      const chatState = await repoProvider.getActiveStateForUserId(userId);
      if (!chatState) {
        console.log('Skipping sending reminder. Mobile number not present in chatbot database.');
        continue;
      }

      const user = { mobileNumber: person.patient_mobile };
      const message = dialog.get_message(messages.reminder, chatState.context.user.locale);
      channelProvider.sendMessageToUser(user, [message], extraInfo);
    }
    console.log(`Message sent to ${people.data.length} mobile numbers`);
  }
}

module.exports = new RemindersService();
