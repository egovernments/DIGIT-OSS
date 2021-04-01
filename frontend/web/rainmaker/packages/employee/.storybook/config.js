import { configure } from '@storybook/react';

function loadStories() {
  require('../src/stories/textField.js');
  require('../src/stories/label.js');
  require('../src/stories/image.js');
  require('../src/stories/bottomNavigation.js');
  require('../src/stories/tabs.js');
  require('../src/stories/datepicker.js');
  require('../src/stories/timepicker.js');
  require('../src/stories/list.js');
  require('../src/stories/filePicker.js');
  require('../src/stories/dialog.js');
  require('../src/stories/appbar.js');
  require('../src/stories/drawer.js');
  require('../src/stories/loadingIndicator.js');
  require('../src/stories/checkBox.js');
  require('../src/stories/mapLocation.js');
  require('../src/stories/button.js');
  require('../src/stories/textArea.js');
  require('../src/stories/card.js');
  require('../src/stories/timeline.js');
  require('../src/stories/screens.js');
  require("../src/stories/profileSection.js");
  require("../src/stories/socialShare.js");
  require("../src/stories/ratings.js");
  require("../src/stories/buttonToggle.js");
  require("../src/stories/dropDown.js");
}

configure(loadStories, module);
