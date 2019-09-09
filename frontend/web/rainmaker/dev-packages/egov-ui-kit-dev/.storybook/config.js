import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/textField.js');
  require('../stories/label.js');
  require('../stories/image.js');
  require('../stories/bottomNavigation.js');
  require('../stories/tabs.js');
  require('../stories/datepicker.js');
  require('../stories/timepicker.js');
  require('../stories/list.js');
  require('../stories/filePicker.js');
  require('../stories/dialog.js');
  require('../stories/appbar.js');
  require('../stories/drawer.js');
  require('../stories/loadingIndicator.js');
  require('../stories/checkBox.js');
  require('../stories/mapLocation.js');
  require('../stories/button.js');
  require('../stories/textArea.js');
  require('../stories/card.js');
  require('../stories/timeline.js');
  require('../stories/screens.js');
  require("../stories/profileSection.js");
  require("../stories/socialShare.js");
  require("../stories/ratings.js");
  require("../stories/buttonToggle.js");
  require("../stories/dropDown.js");
}

configure(loadStories, module);
